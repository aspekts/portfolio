/// <reference lib="webworker" />
// The radio. Holds each station's signal, and decodes whatever the dial is tuned to.

import { decode, encode, FRAME, FRAME_SECONDS, HEIGHT, makeNoise, spectrum, WIDTH, type Reception } from './dsp';

interface Tx { id: string; freq: number; src?: string; pcm?: Float32Array }

const ctx = self as unknown as Worker;
const FFT = 256;
const BINS = 80;
const WINDOWS = 6;
const BURST_MS = 1100;

let stations: Tx[] = [];
let tuned = 87.9;
let paused = false;
let lastDecoded = -1;
let lastCycle = -1;
let still = false;
let liveCover: string | null = null;
let burstUntil = 0;

const noise = makeNoise();
const scratch = { i: new Float32Array(FRAME), q: new Float32Array(FRAME), f: new Float32Array(FRAME) };
const hann = Float32Array.from({ length: FFT }, (_, i) => .5 - .5 * Math.cos((2 * Math.PI * i) / (FFT - 1)));
const fftRe = new Float32Array(FFT), fftIm = new Float32Array(FFT), mag = new Float32Array(FFT / 2);

const clock = () => Date.now() / 1000 / FRAME_SECONDS;

function reception(freq: number): { tx: Tx; rx: Reception; q: number } {
  const tx = stations.reduce((a, b) => (Math.abs(b.freq - freq) < Math.abs(a.freq - freq) ? b : a));
  const d = freq - tx.freq;
  const q = Math.min(1, Math.abs(d) / .42);
  // A new song arrives through a burst of interference that clears as it locks on.
  const burst = !tx.src && tx.pcm ? Math.max(0, burstUntil - Date.now()) / BURST_MS : 0;
  return { tx, q, rx: { noise: .03 + 1.5 * q ** 1.5 + burst * 1.2, offsetHz: Math.sign(d) * 720 * q, skew: Math.sign(d) * 2.6 * q + burst * 1.4 } };
}

function pump() {
  if (!paused && stations.some((s) => s.pcm)) {
    const { tx, rx, q } = reception(tuned);
    const cycle = Math.floor(clock());
    const offAir = !tx.pcm && !still; // an empty channel is live static
    const moving = tuned !== lastDecoded || q > .02 || cycle !== lastCycle || offAir || Date.now() < burstUntil;
    if (moving) {
      lastDecoded = tuned;
      lastCycle = cycle;
      const out = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
      decode(q >= 1 || !tx.pcm ? null : tx.pcm, q >= 1 ? { noise: 1, offsetHz: 0, skew: 0 } : rx, noise, out, scratch);
      ctx.postMessage({ type: 'frame', data: out, id: tx.id, q }, [out.buffer]);
    }
  }
  setTimeout(pump, 70);
}

function rows() {
  if (paused) return;
  const at = Math.floor((clock() % 1) * FRAME);
  const out = new Float32Array(stations.length * BINS);
  stations.forEach((s, i) => {
    if (!s.pcm) return;
    // Several short windows per row, so each row holds the spread of the whole 55 ms.
    for (let w = 0; w < WINDOWS; w++) {
      spectrum(s.pcm, at + w * Math.floor(3520 / WINDOWS), FFT, hann, fftRe, fftIm, mag);
      for (let b = 0; b < BINS; b++) out[i * BINS + b] = Math.max(out[i * BINS + b], mag[b]);
    }
  });
  ctx.postMessage({ type: 'rows', rows: out }, [out.buffer]);
}

async function picture(src: string, square: boolean) {
  const blob = await (await fetch(src)).blob();
  const bmp = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  if (square) {
    // Album covers are square and carry their own type, so they are never cropped.
    c.fillStyle = '#0a23d8';
    c.fillRect(0, 0, WIDTH, HEIGHT);
    c.drawImage(bmp, (WIDTH - HEIGHT) / 2, 0, HEIGHT, HEIGHT);
  } else {
    c.drawImage(bmp, 0, 0, WIDTH, HEIGHT);
  }
  return encode(c.getImageData(0, 0, WIDTH, HEIGHT).data);
}

async function prepare(s: Tx) {
  if (!s.src) return;
  s.pcm = await picture(s.src, false);
  lastDecoded = -1; // the tuned station may have been waiting on this
}

async function goLive(cover: string | null) {
  liveCover = cover;
  const tx = stations.find((s) => !s.src);
  if (!tx) return;
  const pcm = cover ? await picture(cover, true).catch(() => undefined) : undefined;
  if (cover !== liveCover) return; // the song has already changed again
  tx.pcm = pcm;
  if (pcm && !still) burstUntil = Date.now() + BURST_MS;
  lastDecoded = -1;
}

ctx.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    stations = data.stations;
    tuned = data.freq;
    still = data.still;
    // The tuned station first, so the picture is live as soon as possible.
    const order = [...stations].sort((a, b) => Math.abs(a.freq - tuned) - Math.abs(b.freq - tuned));
    pump();
    setInterval(rows, 55);
    // A station that fails to load stays off air; it must not take the others with it.
    for (const s of order) await prepare(s).catch(() => {});
    ctx.postMessage({ type: 'ready' });
  } else if (data.type === 'tune') {
    tuned = data.freq;
  } else if (data.type === 'live') {
    goLive(data.cover);
  } else if (data.type === 'pause') {
    paused = data.paused;
  }
};

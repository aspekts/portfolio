/// <reference lib="webworker" />
// The radio. Holds each station's signal, and decodes whatever the dial is tuned to.

import { decode, encode, FRAME, FRAME_SECONDS, HEIGHT, makeNoise, spectrum, WIDTH, type Reception } from './dsp';

interface Tx { id: string; freq: number; src: string; pcm?: Float32Array }

const ctx = self as unknown as Worker;
const FFT = 256;
const BINS = 80;
const WINDOWS = 6;

let stations: Tx[] = [];
let tuned = 87.9;
let paused = false;
let lastDecoded = -1;
let lastCycle = -1;

const noise = makeNoise();
const scratch = { i: new Float32Array(FRAME), q: new Float32Array(FRAME), f: new Float32Array(FRAME) };
const hann = Float32Array.from({ length: FFT }, (_, i) => .5 - .5 * Math.cos((2 * Math.PI * i) / (FFT - 1)));
const fftRe = new Float32Array(FFT), fftIm = new Float32Array(FFT), mag = new Float32Array(FFT / 2);

const clock = () => Date.now() / 1000 / FRAME_SECONDS;

function reception(freq: number): { tx: Tx; rx: Reception; q: number } {
  const tx = stations.reduce((a, b) => (Math.abs(b.freq - freq) < Math.abs(a.freq - freq) ? b : a));
  const d = freq - tx.freq;
  const q = Math.min(1, Math.abs(d) / .42);
  return { tx, q, rx: { noise: .03 + 1.5 * q ** 1.5, offsetHz: Math.sign(d) * 720 * q, skew: Math.sign(d) * 2.6 * q } };
}

function pump() {
  if (!paused && stations.some((s) => s.pcm)) {
    const { tx, rx, q } = reception(tuned);
    const cycle = Math.floor(clock());
    const moving = tuned !== lastDecoded || q > .02 || cycle !== lastCycle;
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

async function prepare(s: Tx) {
  const blob = await (await fetch(s.src)).blob();
  const bmp = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(WIDTH, HEIGHT);
  const c = canvas.getContext('2d', { willReadFrequently: true })!;
  c.drawImage(bmp, 0, 0, WIDTH, HEIGHT);
  s.pcm = encode(c.getImageData(0, 0, WIDTH, HEIGHT).data);
}

ctx.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    stations = data.stations;
    tuned = data.freq;
    // The tuned station first, so the picture is live as soon as possible.
    const order = [...stations].sort((a, b) => Math.abs(a.freq - tuned) - Math.abs(b.freq - tuned));
    pump();
    setInterval(rows, 55);
    for (const s of order) await prepare(s);
    ctx.postMessage({ type: 'ready' });
  } else if (data.type === 'tune') {
    tuned = data.freq;
  } else if (data.type === 'pause') {
    paused = data.paused;
  }
};

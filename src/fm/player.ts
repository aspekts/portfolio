// One audio element for the whole site, so the radio and the shelf can never overlap.
// Off-frequency, music closes down through a low-pass filter instead of turning to static.

export interface Now { owner: 'radio' | 'shelf'; id: string; title: string; artist: string; cover?: string }

const LEVEL = .3;

let audio: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let filter: BiquadFilterNode | null = null;
let gain: GainNode | null = null;
let now: Now | null = null;
let current = '';
let request = 0;
const listeners = new Set<() => void>();

// Previews held in memory, so pressing play never has to wait on the network.
const ready = new Map<string, string>();
const queued = new Set<string>();
const waiting: string[] = [];
let fetching = 0;
const PARALLEL = 2;

function pump() {
  while (fetching < PARALLEL && waiting.length) {
    const url = waiting.shift()!;
    fetching++;
    fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((data) => { ready.set(url, URL.createObjectURL(new Blob([data], { type: 'audio/mp4' }))); })
      .catch(() => { queued.delete(url); })
      .finally(() => { fetching--; pump(); });
  }
}

/** Data Saver and the slowest connections opt out: the song then just streams on play. */
export function canPreload() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !c?.saveData && !/2g/.test(c?.effectiveType ?? '');
}

export function preload(urls: string[], { first = false } = {}) {
  if (!canPreload()) return;
  const fresh = urls.filter((u) => !queued.has(u));
  fresh.forEach((u) => queued.add(u));
  if (first) waiting.unshift(...fresh); else waiting.push(...fresh);
  pump();
}

const emit = () => listeners.forEach((fn) => fn());

function ensure() {
  if (audio) return audio;
  audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.loop = true;
  // If a held copy will not play, fall back to streaming it.
  audio.addEventListener('error', () => {
    const blob = audio!.src;
    const remote = [...ready].find(([, held]) => held === blob)?.[0];
    if (!remote) return;
    ready.delete(remote);
    audio!.src = remote;
    current = remote;
    audio!.play().catch(() => stop());
  });
  ctx = new AudioContext();
  filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 20000;
  gain = ctx.createGain();
  ctx.createMediaElementSource(audio).connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  return audio;
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export const getNow = () => now;

export function play(next: Now, url: string) {
  const el = ensure();
  ctx!.resume();
  if (current !== url) {
    gain!.gain.cancelScheduledValues(ctx!.currentTime);
    gain!.gain.setValueAtTime(0, ctx!.currentTime);
    gain!.gain.linearRampToValueAtTime(LEVEL, ctx!.currentTime + .18);
    current = url;
    el.src = ready.get(url) ?? url;
  }
  // Swapping songs quickly aborts the previous play(); only a real failure should stop the radio.
  const mine = ++request;
  el.play().catch((e: DOMException) => { if (e.name !== 'AbortError' && mine === request) stop(); });
  now = next;
  emit();
}

/** The radio stays on with nothing to play, for a live song that has no clean preview. */
export function hush(next: Now) {
  const el = ensure();
  ctx!.resume();
  el.pause();
  current = '';
  now = next;
  emit();
}

export function stop() {
  audio?.pause();
  now = null;
  emit();
}

/** q runs from 0 on frequency to 1 lost. */
export function detune(q: number) {
  if (!filter || !gain || !ctx) return;
  filter.frequency.setTargetAtTime(420 + 19500 * (1 - q) ** 3, ctx.currentTime, .05);
  gain.gain.setTargetAtTime(LEVEL * (.28 + .72 * (1 - q) ** 2), ctx.currentTime, .05);
}

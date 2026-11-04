// One audio element for the whole site, so the radio and the shelf can never overlap.
// Off-frequency, music closes down through a low-pass filter instead of turning to static.

export interface Now { owner: 'radio' | 'shelf'; id: string; title: string; artist: string; cover?: string }

const LEVEL = .3;

let audio: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let filter: BiquadFilterNode | null = null;
let gain: GainNode | null = null;
let now: Now | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

function ensure() {
  if (audio) return audio;
  audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.loop = true;
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
  if (el.src !== url) {
    gain!.gain.cancelScheduledValues(ctx!.currentTime);
    gain!.gain.setValueAtTime(0, ctx!.currentTime);
    gain!.gain.linearRampToValueAtTime(LEVEL, ctx!.currentTime + .35);
    el.src = url;
  }
  // Swapping songs quickly aborts the previous play(); only a real failure should stop the radio.
  el.play().catch((e: DOMException) => { if (e.name !== 'AbortError') stop(); });
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

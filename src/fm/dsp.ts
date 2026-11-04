// AFM-320: a slow-scan picture format. Each line is a sync tone, then luma, then one
// chroma channel, frequency modulated onto an audio carrier.

export const WIDTH = 320;
export const HEIGHT = 240;
// Nothing here is listened to, so the signal can sit above the audible band and carry more.
export const SAMPLE_RATE = 64000;

const SYNC = 192;
const LUMA = 1792;
const CHROMA = 896;
export const LINE = SYNC + LUMA + CHROMA;
export const FRAME = LINE * HEIGHT;
export const FRAME_SECONDS = FRAME / SAMPLE_RATE;

const CARRIER = 10000;
const SPAN = 8000;
const SYNC_HZ = 4800;
const TWO_PI = Math.PI * 2;

// A carrier of 10 kHz at 64 kHz repeats every 32 samples, so the mixer can be a table.
const LO_N = 32;
const LO_COS = Float32Array.from({ length: LO_N }, (_, n) => Math.cos(TWO_PI * CARRIER * n / SAMPLE_RATE));
const LO_SIN = Float32Array.from({ length: LO_N }, (_, n) => Math.sin(TWO_PI * CARRIER * n / SAMPLE_RATE));

const toHz = (v: number) => CARRIER - SPAN / 2 + v * SPAN;

/** Picture to audio. `rgba` is WIDTH by HEIGHT. */
export function encode(rgba: Uint8ClampedArray): Float32Array {
  const out = new Float32Array(FRAME);
  let phase = 0;
  let n = 0;

  const tone = (hz: number) => {
    phase += TWO_PI * hz / SAMPLE_RATE;
    if (phase > TWO_PI) phase -= TWO_PI;
    out[n++] = Math.sin(phase);
  };

  // Lines are held in samples, not pixels, so the tone glides between pixel values.
  const channel = (values: Float32Array, samples: number) => {
    const count = values.length;
    for (let i = 0; i < samples; i++) {
      const at = (i / samples) * count - .5;
      const a = Math.max(0, Math.floor(at));
      const b = Math.min(count - 1, a + 1);
      const f = Math.max(0, at - a);
      tone(toHz(values[a] * (1 - f) + values[b] * f));
    }
  };

  const luma = new Float32Array(WIDTH);
  const chroma = new Float32Array(WIDTH / 2);

  for (let y = 0; y < HEIGHT; y++) {
    for (let i = 0; i < SYNC; i++) tone(SYNC_HZ);
    for (let x = 0; x < WIDTH; x++) {
      const p = (y * WIDTH + x) * 4;
      luma[x] = (.299 * rgba[p] + .587 * rgba[p + 1] + .114 * rgba[p + 2]) / 255;
    }
    channel(luma, LUMA);

    // Red difference on even lines, blue difference on odd ones.
    const row = y & ~1;
    for (let x = 0; x < WIDTH / 2; x++) {
      const p = (row * WIDTH + x * 2) * 4;
      const r = rgba[p] / 255, g = rgba[p + 1] / 255, b = rgba[p + 2] / 255;
      const Y = .299 * r + .587 * g + .114 * b;
      chroma[x] = .5 + (y % 2 === 0 ? (r - Y) * .713 : (b - Y) * .564);
    }
    channel(chroma, CHROMA);
  }
  return out;
}

export function makeNoise(length = 131071): Float32Array {
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 2) {
    const u = Math.sqrt(-2 * Math.log(1 - Math.random()));
    const v = TWO_PI * Math.random();
    out[i] = u * Math.cos(v);
    if (i + 1 < length) out[i + 1] = u * Math.sin(v);
  }
  return out;
}

export interface Reception {
  /** Noise added to the received signal, relative to the signal. */
  noise: number;
  /** How far off the carrier the receiver sits, in hertz. */
  offsetHz: number;
  /** Line clock error when sync is lost, in samples per line. */
  skew: number;
}

const FILTER_A = 3;
const FILTER_B = 4;
const DELAY = 3;

/** Audio to picture: mix to baseband, low-pass, FM discriminate, then sample each pixel. */
export function decode(
  pcm: Float32Array | null,
  rx: Reception,
  noise: Float32Array,
  out: Uint8ClampedArray,
  scratch: { i: Float32Array; q: Float32Array; f: Float32Array },
) {
  const { i: I, q: Q, f: D } = scratch;
  const seed = Math.floor(Math.random() * noise.length);
  const nl = noise.length;

  // Two short boxcars: together they null the image at twice the carrier.
  const bi = new Float32Array(FILTER_A), bq = new Float32Array(FILTER_A);
  const ci = new Float32Array(FILTER_B), cq = new Float32Array(FILTER_B);
  let si = 0, sq = 0, ti = 0, tq = 0;

  for (let n = 0; n < FRAME; n++) {
    const x = (pcm ? pcm[n] : 0) + rx.noise * noise[(n + seed) % nl];
    const lo = n % LO_N;
    const a = x * LO_COS[lo], b = -x * LO_SIN[lo];

    const pa = n % FILTER_A;
    si += a - bi[pa]; sq += b - bq[pa];
    bi[pa] = a; bq[pa] = b;

    const pb = n % FILTER_B;
    ti += si - ci[pb]; tq += sq - cq[pb];
    ci[pb] = si; cq[pb] = sq;

    I[n] = ti; Q[n] = tq;
  }

  const toValue = SAMPLE_RATE / (TWO_PI * SPAN);
  for (let n = 1; n < FRAME; n++) {
    const re = I[n] * I[n - 1] + Q[n] * Q[n - 1];
    const im = Q[n] * I[n - 1] - I[n] * Q[n - 1];
    D[n] = Math.atan2(im, re) * toValue + .5 + rx.offsetHz / SPAN;
  }

  const read = (start: number, samples: number) => {
    let sum = 0;
    for (let k = 0; k < samples; k++) sum += D[((start + k) % FRAME + FRAME) % FRAME];
    return sum / samples;
  };

  const yStep = LUMA / WIDTH;
  const cStep = CHROMA / (WIDTH / 2);
  const cr = new Float32Array(WIDTH), cb = new Float32Array(WIDTH);

  for (let y = 0; y < HEIGHT; y++) {
    const line = y * LINE + Math.round(y * rx.skew) + DELAY;

    const chromaStart = line + SYNC + LUMA;
    const target = y % 2 === 0 ? cr : cb;
    for (let x = 0; x < WIDTH / 2; x++) {
      const v = read(chromaStart + Math.round(x * cStep), Math.ceil(cStep)) - .5;
      target[x * 2] = v; target[x * 2 + 1] = v;
    }
    for (let x = 0; x < WIDTH; x++) {
      const Y = read(line + SYNC + Math.round(x * yStep), Math.ceil(yStep));
      const R = Y + 1.403 * cr[x], B = Y + 1.773 * cb[x];
      const G = (Y - .299 * R - .114 * B) / .587;
      const p = (y * WIDTH + x) * 4;
      out[p] = R * 255; out[p + 1] = G * 255; out[p + 2] = B * 255; out[p + 3] = 255;
    }
  }
}

/** Radix-2 magnitude spectrum, used to draw each station on the band. */
export function spectrum(pcm: Float32Array, at: number, size: number, window: Float32Array, re: Float32Array, im: Float32Array, out: Float32Array) {
  const bits = Math.log2(size);
  for (let i = 0; i < size; i++) {
    let r = 0;
    for (let b = 0; b < bits; b++) if (i & (1 << b)) r |= 1 << (bits - 1 - b);
    re[r] = pcm[(at + i) % FRAME] * window[i];
    im[r] = 0;
  }
  for (let len = 2; len <= size; len <<= 1) {
    const step = -TWO_PI / len;
    for (let i = 0; i < size; i += len) {
      for (let j = 0; j < len / 2; j++) {
        const c = Math.cos(step * j), s = Math.sin(step * j);
        const k = i + j + len / 2;
        const tr = re[k] * c - im[k] * s, ti = re[k] * s + im[k] * c;
        re[k] = re[i + j] - tr; im[k] = im[i + j] - ti;
        re[i + j] += tr; im[i + j] += ti;
      }
    }
  }
  for (let i = 0; i < size / 2; i++) out[i] = Math.hypot(re[i], im[i]);
}

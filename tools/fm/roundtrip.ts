// Round-trip check: image, FM audio, noise, demodulator, image.
// Usage: node tools/fm/roundtrip.ts <in.rgba> <out-prefix>
import { readFileSync, writeFileSync } from 'node:fs';
import { decode, encode, FRAME, HEIGHT, makeNoise, WIDTH } from '../../src/fm/dsp.ts';

const [, , input, prefix] = process.argv;
const rgba = new Uint8ClampedArray(readFileSync(input));
const t0 = performance.now();
const pcm = encode(rgba);
const t1 = performance.now();

const noise = makeNoise();
const scratch = { i: new Float32Array(FRAME), q: new Float32Array(FRAME), f: new Float32Array(FRAME) };
const out = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

const psnr = () => {
  let err = 0;
  for (let i = 0; i < rgba.length; i += 4) for (let c = 0; c < 3; c++) err += (rgba[i + c] - out[i + c]) ** 2;
  return 10 * Math.log10(255 ** 2 / (err / (WIDTH * HEIGHT * 3)));
};

const cases: [string, { noise: number; offsetHz: number; skew: number }][] = [
  ['clean', { noise: 0, offsetHz: 0, skew: 0 }],
  ['live', { noise: .04, offsetHz: 0, skew: 0 }],
  ['near', { noise: .5, offsetHz: 200, skew: .6 }],
  ['off', { noise: 1.4, offsetHz: 600, skew: 2 }],
];

console.log(`encode ${(t1 - t0).toFixed(1)} ms, ${FRAME} samples`);
for (const [name, rx] of cases) {
  const t = performance.now();
  decode(pcm, rx, noise, out, scratch);
  console.log(`${name}: ${psnr().toFixed(1)} dB, decode ${(performance.now() - t).toFixed(1)} ms`);
  writeFileSync(`${prefix}-${name}.rgba`, out);
}

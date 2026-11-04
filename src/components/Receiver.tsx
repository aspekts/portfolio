'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FRAME_SECONDS, HEIGHT, WIDTH } from '@/fm/dsp';
import { detune, getNow, play, preload, stop, subscribe, type Now } from '@/fm/player';
import { BAND, stations, type Station } from '@/content/stations';
import music from '@/content/music.generated.json';
import useLanyard from '@/hooks/useLanyard';

const BINS = 80;
const CELL = 2;
const BAND_MHZ = .44;
const LOCK = .03;
const SNAP = .26;
const START = 87.9;
const SWIPE = 44;
const NEARBY = 3;
const INK = [10, 35, 216], HOT = [255, 59, 29], PAPER = [255, 212, 0];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + .5) / 16);

const pct = (f: number) => ((f - BAND.low) / (BAND.high - BAND.low)) * 100;
type Song = (typeof music.dial)[keyof typeof music.dial];
const songFor = (s: Station) => (music.dial as Record<string, Song>)[s.id];
const asNow = (s: Station, t: Song): Now => ({ owner: 'radio', id: s.id, title: t.title, artist: t.artist, cover: t.cover });

const nearest = (f: number) => stations.reduce((a, b) => (Math.abs(b.freq - f) < Math.abs(a.freq - f) ? b : a));

export default function Receiver() {
  const screenRef = useRef<HTMLCanvasElement>(null);
  const bandRef = useRef<HTMLCanvasElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const freqRef = useRef(START);
  const targetRef = useRef<number | null>(null);

  const [station, setStation] = useState<Station | null>(stations[0]);
  const [live, setLive] = useState(false);
  const [now, setNow] = useState<Now | null>(null);
  const [line, setLine] = useState(0);
  const { spotifyPresence: song } = useLanyard();
  const railRef = useRef<HTMLOListElement>(null);
  const touchRef = useRef<{ x: number; f: number; moved: boolean } | null>(null);
  const swipeRef = useRef<number | null>(null);

  const tune = useCallback((f: number, smooth = false) => {
    const v = Math.min(BAND.high, Math.max(BAND.low, f));
    if (smooth) { targetRef.current = v; return; }
    targetRef.current = null;
    freqRef.current = v;
  }, []);

  useEffect(() => subscribe(() => setNow(getNow())), []);

  // All thirteen previews are about 14 MB. A desktop gets them once the page has settled;
  // a phone gets the nearest few, and the rest only once someone has pressed Listen.
  useEffect(() => {
    const songs = stations.map((s) => songFor(s)?.preview).filter(Boolean) as string[];
    const touch = matchMedia('(pointer: coarse)').matches;
    const t = setTimeout(() => preload(touch ? songs.slice(0, NEARBY) : songs), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL('../fm/receiver.worker.ts', import.meta.url));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const screen = screenRef.current!.getContext('2d')!;
    const image = screen.createImageData(WIDTH, HEIGHT);
    const band = bandRef.current!;
    const b = band.getContext('2d')!;
    let row: ImageData;
    let bandY = 0;

    const size = () => {
      band.width = Math.floor(band.clientWidth / CELL);
      band.height = Math.floor(band.clientHeight / CELL);
      b.fillStyle = `rgb(${PAPER})`;
      b.fillRect(0, 0, band.width, band.height);
      row = b.createImageData(band.width, 1);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(band);

    const drawRow = (rows: Float32Array) => {
      const W = band.width, tuned = freqRef.current, span = BAND.high - BAND.low;
      for (let x = 0; x < W; x++) {
        const f = BAND.low + (x / W) * span;
        let v = Math.random() ** 4 * .3;
        stations.forEach((s, i) => {
          const u = (f - s.freq) / BAND_MHZ;
          if (Math.abs(u) >= 1) return;
          // The signal sits in the middle of the channel; let its edges fall away instead of stopping dead.
          const bin = Math.round(40 + u * 21);
          v = Math.max(v, Math.log1p(rows[i * BINS + bin] * .9) / 3.2 + (1 - Math.abs(u)) * .12);
        });
        if (Math.abs(f - tuned) < .05) v = Math.max(v, .3);
        const t = BAYER[(x & 3) + ((bandY & 3) << 2)];
        const c = v > .5 + t * .34 ? INK : v > .16 + t * .34 ? HOT : PAPER;
        const p = x * 4;
        row.data[p] = c[0]; row.data[p + 1] = c[1]; row.data[p + 2] = c[2]; row.data[p + 3] = 255;
      }
      b.drawImage(band, 0, 1);
      b.putImageData(row, 0, 0);
      bandY++;
    };

    worker.onmessage = ({ data }) => {
      if (data.type === 'frame') {
        image.data.set(data.data);
        screen.putImageData(image, 0, 0);
        setLive(true);
      } else if (data.type === 'rows') {
        drawRow(data.rows);
      }
    };

    worker.postMessage({
      type: 'init',
      freq: START,
      stations: stations.map((s) => ({ id: s.id, freq: s.freq, src: `/fm/${s.id}.png` })),
    });

    // The dial, the readout and the music follow one loop, so React only sees station changes.
    let raf = 0, sent = -1, current: string | null = stations[0].id, held = '', heldAt = 0;
    let last = performance.now();
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      const dt = time - last;
      last = time;
      const goal = targetRef.current;
      if (goal !== null) {
        // Ease against the clock, so a slow phone arrives as quickly as a fast laptop.
        const next = reduced ? goal : freqRef.current + (goal - freqRef.current) * (1 - Math.exp(-Math.min(dt, 120) / 45));
        freqRef.current = Math.abs(goal - next) < .004 ? goal : next;
        if (freqRef.current === goal) targetRef.current = null;
      }
      const f = freqRef.current;
      if (f !== sent) {
        sent = f;
        worker.postMessage({ type: 'tune', freq: f });
        needleRef.current!.style.left = `${pct(f)}%`;
        readoutRef.current!.textContent = f.toFixed(1);
        dialRef.current!.setAttribute('aria-valuenow', f.toFixed(1));
      }
      const s = nearest(f);
      const off = Math.abs(s.freq - f);
      const id = off < SNAP ? s.id : null;
      if (id !== current) {
        current = id;
        setStation(id ? s : null);
        setLine(0);
        if (id) navigator.vibrate?.(8);
      }
      const playing = getNow();
      if (playing?.owner === 'radio') {
        // Only change song once the dial has settled, not for every station it sweeps past.
        if (playing.id !== s.id && off < SNAP) {
          if (held !== s.id) { held = s.id; heldAt = performance.now(); }
          else if (performance.now() - heldAt > 180) { const t = songFor(s); if (t) play(asNow(s, t), t.preview); }
        }
        detune(Math.min(1, off / .42));
      }
      if (scanRef.current) {
        const p = ((Date.now() / 1000) % FRAME_SECONDS) / FRAME_SECONDS;
        scanRef.current.style.top = `${p * 100}%`;
      }
    };
    raf = requestAnimationFrame(frame);

    // Stop decoding when nobody can see it.
    const io = new IntersectionObserver(([e]) => worker.postMessage({ type: 'pause', paused: !e.isIntersecting }));
    io.observe(screenRef.current!);

    const onTune = (e: Event) => {
      tune((e as CustomEvent<number>).detail, true);
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    };
    window.addEventListener('fm:tune', onTune);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      worker.terminate();
      window.removeEventListener('fm:tune', onTune);
    };
  }, [tune]);

  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('button.active');
    if (rail && active && rail.scrollWidth > rail.clientWidth) {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const li = active.parentElement!;
      rail.scrollTo({ left: li.offsetLeft - rail.clientWidth / 2 + li.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [station]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setLine((l) => l + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const listening = now?.owner === 'radio';

  const toggleListen = () => {
    if (listening) { stop(); return; }
    const s = nearest(freqRef.current), t = songFor(s);
    if (t) play(asNow(s, t), t.preview);
    preload(stations.map((x) => songFor(x)?.preview).filter(Boolean) as string[]);
  };

  const freqAt = (x: number) => {
    const r = dialRef.current!.getBoundingClientRect();
    return BAND.low + ((x - r.left) / r.width) * (BAND.high - BAND.low);
  };

  // A mouse grabs the needle. A thumb covers the band, so it moves the needle from where
  // it is, at half speed, and a plain tap jumps.
  const onPointer = (e: React.PointerEvent) => {
    const down = e.type === 'pointerdown';
    if (down) dialRef.current!.setPointerCapture(e.pointerId);
    if (e.pointerType === 'mouse') {
      if (down || e.buttons) tune(freqAt(e.clientX));
      return;
    }
    if (down) { touchRef.current = { x: e.clientX, f: freqRef.current, moved: false }; return; }
    const t = touchRef.current;
    if (!t) return;
    const dx = e.clientX - t.x;
    if (Math.abs(dx) > 6) t.moved = true;
    if (t.moved) tune(t.f + (dx / dialRef.current!.clientWidth) * (BAND.high - BAND.low) * .5);
  };

  const release = (e: React.PointerEvent) => {
    const t = touchRef.current;
    touchRef.current = null;
    if (t && !t.moved) tune(freqAt(e.clientX));
    const f = freqRef.current, s = nearest(f);
    if (Math.abs(s.freq - f) < SNAP) tune(s.freq, true);
  };

  const onScreenDown = (e: React.PointerEvent) => { swipeRef.current = e.clientX; };
  const onScreenUp = (e: React.PointerEvent) => {
    if (swipeRef.current === null) return;
    const dx = e.clientX - swipeRef.current;
    swipeRef.current = null;
    if (Math.abs(dx) > SWIPE) seek(dx < 0 ? 1 : -1);
  };

  const seek = (dir: number) => {
    const f = targetRef.current ?? freqRef.current;
    const list = dir > 0 ? stations : [...stations].reverse();
    const next = list.find((s) => (dir > 0 ? s.freq > f + LOCK : s.freq < f - LOCK));
    if (next) tune(next.freq, true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowLeft: -.1, ArrowDown: -.1, ArrowRight: .1, ArrowUp: .1 }[e.key];
    if (step) { e.preventDefault(); tune(freqRef.current + step); return; }
    if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); seek(e.key === 'PageUp' ? 1 : -1); }
  };

  const rt = station ? [...(station.id === 'recordbox' && song ? [`NOW ${song.song} - ${song.artist}`.toUpperCase()] : []), ...station.rt] : [];
  const onAir = station && songFor(station);

  return (
    <>
      <div className="screen-wrap">
        <div className="screen" onPointerDown={onScreenDown} onPointerUp={onScreenUp} onPointerCancel={() => { swipeRef.current = null; }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fm/marcus.png" alt="Marcus, seen from behind in a white shirt, in a garden of tall golden grass" width={320} height={240} />
          <canvas ref={screenRef} width={WIDTH} height={HEIGHT} className={live ? 'on' : ''} aria-hidden="true" />
          <div className="scan" ref={scanRef} aria-hidden="true" />
        </div>

        <div className="rds" aria-live="polite">
          <p className="rds-ps">{station ? station.ps : '--------'}</p>
          <p className="rds-rt">{station ? rt[line % rt.length] : 'NO SIGNAL'}</p>
        </div>
      </div>

      <div className="tuner">
        <div className="tuner-head">
          <p className="readout"><span ref={readoutRef}>{START.toFixed(1)}</span> <small>MHz</small></p>
          <p className="now-on">{station ? <><b>{station.name}</b> {station.format}</> : 'Between stations'}</p>
          <div className="song">
            {onAir && (
              <a href={onAir.link ?? undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={onAir.cover} alt="" width={42} height={42} />
                <span><b>{onAir.title}</b><span>{onAir.artist}</span><em>{onAir.genre}</em></span>
              </a>
            )}
          </div>
          <div className="tuner-btns">
            <button type="button" className="seek" onClick={() => seek(-1)} aria-label="Previous station">◀ Seek</button>
            <button type="button" className="seek" onClick={() => seek(1)} aria-label="Next station">Seek ▶</button>
            <button type="button" onClick={toggleListen} aria-pressed={listening}>{listening ? 'Stop' : 'Listen'}</button>
          </div>
        </div>

        <div
          className="band"
          ref={dialRef}
          role="slider"
          tabIndex={0}
          aria-label="Tuning dial"
          aria-valuemin={BAND.low}
          aria-valuemax={BAND.high}
          aria-valuenow={START}
          aria-valuetext={station ? `${station.freq} megahertz, ${station.name}` : 'Between stations'}
          onPointerDown={onPointer}
          onPointerMove={onPointer}
          onPointerUp={release}
          onPointerCancel={() => { touchRef.current = null; }}
          onKeyDown={onKey}
        >
          <canvas ref={bandRef} aria-hidden="true" />
          <div className="needle" ref={needleRef} style={{ left: `${pct(START)}%` }} aria-hidden="true" />
        </div>

        <ol className="stops" ref={railRef}>
          {stations.map((s) => (
            <li key={s.id} style={{ left: `${pct(s.freq)}%` }}>
              <button type="button" className={station?.id === s.id ? 'active' : ''} onClick={() => tune(s.freq, true)} aria-label={`Tune to ${s.name}, ${s.freq} megahertz`}>
                <span>{s.ps}</span>
                <small>{s.freq.toFixed(1)}</small>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { discs } from '@/content/shelf';
import { listening, stations } from '@/content/stations';
import music from '@/content/music.generated.json';
import { detune, getNow, play, preload, stop, subscribe, type Now } from '@/fm/player';
import { useRotation } from '@/fm/rotation';

type Song = (typeof music.dial)[keyof typeof music.dial];

export function Guide() {
  return (
    <section id="guide" className="guide">
      <h2>Programme guide</h2>
      <p className="lede">Everything I do, by frequency. Pick one and the receiver will tune to it.</p>
      <ol>
        {stations.slice(1).map((s) => (
          <li key={s.id}>
            <button type="button" className="tune" onClick={() => window.dispatchEvent(new CustomEvent('fm:tune', { detail: s.freq }))} aria-label={`Tune to ${s.name}`}>
              {s.freq.toFixed(1)}
              <small>Tune</small>
            </button>
            <div>
              <h3>{s.name}</h3>
              <p className="format">{s.format}</p>
            </div>
            <div className="body">
              <p>
                {s.body}
                {s.link && <> <a href={s.link.href}>{s.link.label}</a></>}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Shelf() {
  const [open, setOpen] = useState(discs[0].id);
  const [now, setNow] = useState<Now | null>(null);
  const disc = discs.find((d) => d.id === open)!;

  useEffect(() => subscribe(() => setNow(getNow())), []);

  useEffect(() => { if (disc.track) preload([disc.track.preview], { first: true }); }, [disc]);

  const playing = now?.owner === 'shelf' && now.id === disc.id;

  const toggle = () => {
    if (playing) { stop(); return; }
    if (disc.track) { play({ owner: 'shelf', id: disc.id, title: disc.track.title, artist: disc.artist, cover: disc.cover }, disc.track.preview); detune(0); }
  };

  return (
    <section id="shelf" className="shelf">
      <h2>The Shelf</h2>
      <p className="lede">I stream everything, but these eleven are the ones I actually own.</p>

      <div className="shelf-layout">
        <ul className="crate">
          {discs.map((d) => (
            <li key={d.id}>
              <button type="button" aria-pressed={open === d.id} aria-label={`${d.title} by ${d.artist}`} className={open === d.id ? 'open' : ''} onClick={() => setOpen(d.id)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {d.cover ? <img src={d.cover} alt="" width={300} height={300} loading="lazy" /> : <span className="blank">{d.title}</span>}
                {d.sticker && <span className="sticker">{d.sticker}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="deck">
          <div className="deck-art">
            <div className={`disc${playing ? ' spin' : ''}`} aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {disc.cover ? <img src={disc.cover} alt={`Cover of ${disc.title}`} width={600} height={600} /> : <span className="blank">{disc.title}</span>}
          </div>
          <div>
            <h3>{disc.title}</h3>
            <p className="deck-by">{disc.artist}</p>
            <p>{disc.note}</p>
            <div className="deck-actions">
              {disc.track && <button type="button" className="play" onClick={toggle}>{playing ? 'Stop' : `Play ${disc.track.title}`}</button>}
              {disc.link && <a href={disc.link}>Listen in full</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Rotation() {
  const tracks = useRotation();

  return (
    <section id="rotation" className="rotation">
      <h2>On rotation</h2>
      <p className="lede">What I&apos;ve had on lately. {listening.plays} plays and {listening.hours} hours so far, across {listening.artists} artists.</p>
      <ul className="wall">
        {tracks.slice(0, 12).map((t) => {
          const tile = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.cover} alt="" width={200} height={200} loading="lazy" />
              <b>{t.title}</b>
              <span>{t.artist}</span>
            </>
          );
          return <li key={t.preview}>{t.link ? <a href={t.link}>{tile}</a> : tile}</li>;
        })}
      </ul>
      <h3>On the dial</h3>
      <p className="lede">Thirteen stations, thirteen genres, and in each one the track I&apos;ve played most that can go out clean.</p>
      <ol className="dialist">
        {stations.map((s) => {
          const t = (music.dial as Record<string, Song>)[s.id];
          return t && (
            <li key={s.id}>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('fm:tune', { detail: s.freq }))} aria-label={`Tune to ${t.genre}`}>
                <b>{t.genre}</b>
                <span>{t.title}, {t.artist}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="lede">Most played, ever:</p>
      <ol className="heavy">
        {music.artists.slice(0, 6).map((a) => <li key={a.name}>{a.name} <small>{a.plays.toLocaleString('en-GB')}</small></li>)}
      </ol>
    </section>
  );
}

export function OffAir() {
  return (
    <section id="about" className="off-air">
      <h2>Off air</h2>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/fm/marcus-full.jpg" alt="Marcus, seen from behind, walking across a garden under a wide grey sky" width={1200} height={1600} loading="lazy" />
        <div className="prose">
          <p>
            I&apos;m Marcus. Ugandan, between London and Dundee, and in the final year of Computer Science (Data Science
            and AI) at the University of Dundee, graduating in 2027.
          </p>
          <p>
            I was Vice President of the Dundee University Computing Society from September 2025 to September 2026, where
            I ran a sold-out Quackathon 2026. In August 2024 I was a pension funds summer intern at Zamara in Kampala.
          </p>
          <p>When I&apos;m not building things I&apos;m go-karting, making something with my hands, or looking for music.</p>
        </div>
      </div>
    </section>
  );
}

/** Follows you down the page, so the music can always be stopped. */
export function NowBar() {
  const [now, setNow] = useState<Now | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => subscribe(() => setNow(getNow())), []);

  useEffect(() => {
    if (!now) return;
    const home = document.querySelector(now.owner === 'radio' ? '.receiver' : '#shelf');
    if (!home) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: .25 });
    io.observe(home);
    return () => io.disconnect();
  }, [now]);

  if (!now || hidden) return null;
  return (
    <aside className="nowbar" aria-label="Now playing">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {now.cover && <img src={now.cover} alt="" width={44} height={44} />}
      <a href="#main" aria-label={`${now.title} by ${now.artist}. Back to the dial`}>
        <b>{now.title}</b>
        <span>{now.artist}</span>
      </a>
      <button type="button" onClick={stop}>Stop</button>
    </aside>
  );
}

export function Sign() {
  return (
    <footer id="contact" className="sign">
      <h2>Get on air</h2>
      <p className="big-link"><a href="mailto:home@aspekts.dev">home@aspekts.dev</a></p>
      <ul>
        <li><a href="/assets/resume.pdf">CV</a></li>
        <li><a href="https://github.com/aspekts">GitHub</a></li>
        <li><a href="https://linkedin.com/in/mkamuntu">LinkedIn</a></li>
        <li><a href="https://stats.fm/buh">stats.fm</a></li>
        <li><a href="#main">Back to the dial</a></li>
      </ul>
      <p className="colophon">
        Every picture on the dial is encoded to FM and decoded back in your browser, with noise added to the signal as you
        tune away. Listening data from stats.fm, previews from Apple Music. Set in Dela Gothic One, Spline Sans and Doto.
      </p>
    </footer>
  );
}

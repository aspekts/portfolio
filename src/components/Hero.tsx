'use client';

import { useEffect, useRef, useState } from 'react';
import useScrollTo from '@/hooks/useScrollTo';
import MagneticWrapper from '@/components/MagneticWrapper';
import LanyardStatus from '@/components/LanyardStatus';

const stats = [
  { val: '5+', label: 'years building' },
  { val: '500K+', label: 'users served' },
  { val: '5', label: 'awards won' },
  { val: '40+', label: 'open source projects' },
];

const FULL_PRE_TEXT = '// marcus kamuntu · aspekts.dev';

const Hero = () => {
  const scrollTo = useScrollTo();
  const [show, setShow] = useState(false);
  const [preText, setPreText] = useState('');
  const [preTextDone, setPreTextDone] = useState(false);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Typewriter: runs after show = true
  useEffect(() => {
    if (!show) return;
    if (reducedMotion.current) {
      setPreText(FULL_PRE_TEXT);
      setPreTextDone(true);
      return;
    }
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const type = () => {
      i++;
      setPreText(FULL_PRE_TEXT.slice(0, i));
      if (i < FULL_PRE_TEXT.length) {
        timeout = setTimeout(type, 22);
      } else {
        setPreTextDone(true);
      }
    };
    timeout = setTimeout(type, 0);
    return () => clearTimeout(timeout);
  }, [show]);

  // Tightened: 60ms stagger intervals, 300ms total before stats
  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : (reducedMotion.current ? 'translateY(0)' : 'translateY(12px)'),
    transition: reducedMotion.current
      ? `opacity 1ms`
      : `opacity 480ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform 480ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  return (
    <section
      id="hero"
      className="relative min-h-[520px] flex flex-col justify-center border-b border-white/[0.06] overflow-hidden pt-[52px]"
    >
      {/* Orb background — kept intentionally subtle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-[200px] -right-[150px] w-[500px] h-[500px] rounded-full bg-signal opacity-[0.05]" />
        <div className="absolute -bottom-[100px] -left-[80px] w-[300px] h-[300px] rounded-full bg-signal-minus opacity-[0.04]" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full px-8 py-20">


        {/* Pre-text — typewriter reveals character by character */}
        <p className="font-mono text-[11px] text-signal tracking-[0.18em] mb-6 min-h-[1em]">
          {preText}
          {preTextDone && (
            <span className="cursor-blink ml-[1px] opacity-70">|</span>
          )}
        </p>

        {/* Display headline — Bricolage Grotesque, wide variant */}
        <div style={fadeUp(60)}>
          <h1
            className="font-display font-bold leading-[0.95] tracking-[-0.03em] text-white mb-3 fvs-wide"
            style={{ fontSize: 'clamp(42px, 6.5vw, 76px)' }}
          >
            I build things<br />
            most people<br />
            don&apos;t ship<span className="text-signal">.</span>
          </h1>
        </div>

        <div style={fadeUp(120)}>
          <p className="font-sans text-white/45 mb-8 mt-4 tracking-[-0.01em]" style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}>
            Founder · ML Engineer · Systems Builder
          </p>
        </div>

        <div style={fadeUp(180)}>
          <p className="font-sans text-[15px] text-white/55 max-w-[520px] leading-[1.75] mb-10">
            Third-year CS student at Dundee. Founder, ML engineer, and infrastructure obsessive by practice - I&apos;ve has been building real products for real people since age fifteen, and haven&apos;t stopped since.
          </p>
        </div>

        <div style={fadeUp(240)}>
          <div className="flex items-center gap-3 flex-wrap">
            <MagneticWrapper>
              <button
                onClick={() => scrollTo('projects')}
                className="inline-flex items-center gap-2 font-mono text-[12px] text-signal-plus border border-signal/40 rounded px-[22px] py-[11px] bg-signal/[0.06] hover:bg-signal/[0.12] active:bg-signal/[0.18] transition-colors duration-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
              >
                getProjects() →
              </button>
            </MagneticWrapper>
            <MagneticWrapper>
              <a
                href="/assets/resume.pdf"
                download
                className="inline-flex items-center gap-2 font-mono text-[12px] text-white/50 border border-white/[0.14] rounded px-[22px] py-[11px] hover:text-white/75 hover:border-white/25 active:text-white/90 active:border-white/35 transition-colors duration-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
              >
                downloadCV()
              </a>
            </MagneticWrapper>
          </div>
        </div>

        {/* Live presence — VSCode + Spotify via Lanyard WebSocket */}
        <LanyardStatus style={fadeUp(300)} className="mt-5" />

        {/* Stats bar — reduced animation delay */}
        <div
          style={fadeUp(340)}
          className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/[0.06]"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-[28px] text-white leading-none tracking-[-0.02em] fvs-normal">
                {s.val}
              </div>
              <div className="font-mono text-[10px] text-white/40 tracking-[0.1em] uppercase mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

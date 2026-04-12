'use client';

import { useEffect, useRef, useState } from 'react';

type CursorVariant = 'default' | 'hover' | 'project';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -300, y: -300 });
  const ringPosRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number | undefined>(undefined);
  const variantRef = useRef<CursorVariant>('default');
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = window.matchMedia('(hover: none)').matches;
    setIsTouch(touch);
    setMounted(true);
    if (touch) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerpFactor = reducedMotion ? 1 : 0.12;

    document.documentElement.classList.add('cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      let next: CursorVariant = 'default';
      if (target.closest('[data-cursor="project"]')) next = 'project';
      else if (target.closest('a, button, [role="button"]')) next = 'hover';

      if (next !== variantRef.current) {
        variantRef.current = next;
        setVariant(next);
      }
    };

    const tick = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * lerpFactor;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * lerpFactor;

      dotRef.current?.style.setProperty(
        'transform',
        `translate3d(calc(${posRef.current.x}px - 50%), calc(${posRef.current.y}px - 50%), 0)`
      );
      ringRef.current?.style.setProperty(
        'transform',
        `translate3d(calc(${ringPosRef.current.x}px - 50%), calc(${ringPosRef.current.y}px - 50%), 0)`
      );

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      document.documentElement.classList.remove('cursor-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!mounted || isTouch) return null;

  const isHover = variant === 'hover';
  const isProject = variant === 'project';

  return (
    <div aria-hidden="true">
      {/* Dot — tracks exactly, no lag */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-signal"
        style={{
          width: isHover || isProject ? '4px' : '6px',
          height: isHover || isProject ? '4px' : '6px',
          opacity: isProject ? 0 : 1,
          transition: 'width 200ms cubic-bezier(0.16,1,0.3,1), height 200ms cubic-bezier(0.16,1,0.3,1), opacity 150ms',
          willChange: 'transform',
        }}
      />
      {/* Ring — lagged, morphs on state change */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        style={{
          width: isProject ? '64px' : isHover ? '48px' : '36px',
          height: isProject ? '64px' : isHover ? '48px' : '36px',
          border: `1px solid ${
            isHover
              ? 'rgba(124,111,212,0.65)'
              : isProject
              ? 'rgba(124,111,212,0.45)'
              : 'rgba(124,111,212,0.28)'
          }`,
          backgroundColor: isProject ? 'rgba(124,111,212,0.06)' : 'transparent',
          transition:
            'width 220ms cubic-bezier(0.16,1,0.3,1), height 220ms cubic-bezier(0.16,1,0.3,1), border-color 180ms, background-color 180ms',
          willChange: 'transform',
        }}
      >
        {isProject && (
          <span className="font-mono text-[9px] text-signal/60 tracking-[0.1em] select-none whitespace-nowrap">
            view →
          </span>
        )}
      </div>
    </div>
  );
}

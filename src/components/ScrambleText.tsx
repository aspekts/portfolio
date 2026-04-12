'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Deliberately chosen: uppercase + symbols that look "data-like" without being illegible
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>[]{}|';

// Characters we never scramble — structural punctuation and separators
const PRESERVE = new Set([' ', '(', ')', '/', '·', '→', '.', '-', '_', "'", '"']);

interface ScrambleTextProps {
  children: string;
  className?: string;
}

/**
 * Renders text that scrambles on hover, then resolves left-to-right.
 * Screen-reader safe: aria-label preserves the real text at all times.
 */
export default function ScrambleText({ children, className }: ScrambleTextProps) {
  const [display, setDisplay] = useState(children);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number>(0);
  // ~380ms feels snappy but not frantic for nav-length strings
  const DURATION = 380;

  const scramble = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(children);
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const revealCount = Math.floor(progress * children.length);

      const result = children
        .split('')
        .map((char, i) => {
          if (PRESERVE.has(char)) return char;
          if (i < revealCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplay(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(children);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [children]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span className={className} aria-label={children} onMouseEnter={scramble}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

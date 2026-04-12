import { useCallback } from 'react';

/**
 * Returns onMouseMove and onMouseLeave handlers that apply a subtle 3-D
 * perspective tilt to the element they're attached to.
 *
 * @param maxDeg  Maximum rotation in degrees (default 5)
 */
export function useTilt(maxDeg = 5) {
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg)`;
      el.style.transition = 'transform 0ms';
    },
    [maxDeg]
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    el.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
  }, []);

  return { onMouseMove, onMouseLeave };
}

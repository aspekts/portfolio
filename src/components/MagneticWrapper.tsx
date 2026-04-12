'use client';

import { ReactNode, useRef } from 'react';

interface MagneticWrapperProps {
  children: ReactNode;
  /** How far the element shifts relative to cursor offset. 0.28 = 28% of offset distance. */
  strength?: number;
  className?: string;
}

/**
 * Wraps children and applies a subtle magnetic pull toward the cursor.
 * Respects prefers-reduced-motion: no translation when set.
 */
const MagneticWrapper = ({ children, strength = 0.28, className = '' }: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    ref.current.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    ref.current.style.transition = 'transform 0ms';
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
    ref.current.style.transition = 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)';
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;

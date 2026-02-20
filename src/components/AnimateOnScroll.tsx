'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
}

const AnimateOnScroll = ({ children, className = '' }: AnimateOnScrollProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Server and initial client render use the same values (no transform skip).
  // After hydration, reducedMotion resolves and animate target adjusts.
  const hidden = { opacity: 0, y: reducedMotion ? 0 : 50 };
  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? visible : hidden}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;

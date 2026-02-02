'use client';

import { ReactNode } from 'react';
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;

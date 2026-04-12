'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

interface SectionHeaderProps {
  num: string;
  title: string;
}

const SectionHeader = ({ num, title }: SectionHeaderProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  // Clip-path wipe from left → or simple opacity fade if reduced motion
  const textVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        visible: {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
    },
  };

  return (
    <div ref={ref} className="flex items-center gap-3 mb-10">
      {/* // prefix — signal, wipes in first */}
      <motion.span
        className="font-mono text-[11px] text-signal tracking-[0.12em] whitespace-nowrap"
        variants={textVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {num}
      </motion.span>

      {/* Divider — scaleX from left */}
      <motion.div
        className="flex-1 h-px bg-white/[0.06] origin-left"
        variants={lineVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      />

      {/* Section title — wipes in with slight delay */}
      <motion.span
        className="font-mono text-[11px] text-white/55 tracking-[0.12em] whitespace-nowrap"
        variants={textVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={
          prefersReducedMotion
            ? { duration: 0.3, delay: 0.05 }
            : { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.14 }
        }
      >
        {title}
      </motion.span>
    </div>
  );
};

export default SectionHeader;

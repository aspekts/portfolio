'use client';

import SectionHeader from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';
import { useTilt } from '@/hooks/useTilt';

const contactItems = [
  {
    icon: '@',
    label: 'email',
    value: 'home@aspekts.dev',
    href: 'mailto:home@aspekts.dev',
    highlight: false,
  },
  {
    icon: 'gh',
    label: 'github',
    value: '@aspekts',
    href: 'https://github.com/aspekts',
    highlight: false,
  },
  {
    icon: 'in',
    label: 'linkedin',
    value: 'Marcus Kamuntu',
    href: 'https://linkedin.com/in/mkamuntu',
    highlight: false,
  },
  {
    icon: 'cv',
    label: 'resume',
    value: 'downloadCV()',
    href: '/assets/resume.pdf',
    highlight: true,
    download: true,
  },
];

const ContactCard = ({ item }: { item: typeof contactItems[number] }) => {
  const { onMouseMove, onMouseLeave } = useTilt(4);

  return (
    <a
      href={item.href}
      download={item.download}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`flex items-center gap-3 p-4 rounded-[6px] border transition-colors duration-[220ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal group active:scale-[0.98] ${
        item.highlight
          ? 'border-signal/20 hover:border-signal/35'
          : 'border-white/[0.07] hover:border-white/[0.16]'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded flex items-center justify-center font-mono text-[12px] flex-shrink-0 border ${
          item.highlight
            ? 'bg-signal/[0.08] border-signal/20 text-signal'
            : 'bg-white/[0.04] border-white/[0.1] text-white/50'
        }`}
      >
        {item.icon}
      </div>
      <div>
        <p className="font-mono text-[10px] text-white/40 tracking-[0.1em] uppercase mb-[2px]">
          {item.label}
        </p>
        <p
          className={`font-mono text-[13px] transition-colors ${
            item.highlight
              ? 'text-signal/80 group-hover:text-signal'
              : 'text-white/55 group-hover:text-white/80'
          }`}
        >
          {item.value}
        </p>
      </div>
    </a>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="// 04" title="getInTouch()" />

        <div className="grid sm:grid-cols-2 gap-[10px] max-w-xl">
          {contactItems.map((item, index) => (
            <AnimateOnScroll key={item.label} delay={index * 60}>
              <ContactCard item={item} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;

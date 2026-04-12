'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import useScrollTo from '@/hooks/useScrollTo';
import ScrambleText from '@/components/ScrambleText';

const navItems = [
  { label: 'getAboutMe()', id: 'about' },
  { label: 'getProjects()', id: 'projects' },
  { label: 'getExperience()', id: 'experience' },
  { label: 'getContact()', id: 'contact' },
];

const Navigation = () => {
  const scrollTo = useScrollTo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const visibleSections = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });
        // Pick whichever visible section has the highest intersection ratio
        let best = '';
        let bestRatio = 0;
        visibleSections.forEach((ratio, id) => {
          if (ratio > bestRatio) { best = id; bestRatio = ratio; }
        });
        if (best) setActiveSection(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-52px 0px 0px 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    scrollTo(id);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-void border-b border-white/[0.06]"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-8 h-[52px] flex items-center justify-between">
        {/* Logo — white, not signal */}
        <span className="font-mono text-[13px] text-white/70 tracking-[0.05em]">aspekts</span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-mono text-[11px] tracking-[0.08em] transition-colors duration-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded ${
                activeSection === item.id
                  ? 'text-white/85'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <ScrambleText>{item.label}</ScrambleText>
            </button>
          ))}
        </div>

        {/* CTA — the one signal element in the nav */}
        <button
          onClick={() => handleNavClick('contact')}
          className="hidden md:inline-flex items-center font-mono text-[11px] text-signal border border-signal/40 rounded px-[14px] py-[5px] hover:bg-signal/10 active:bg-signal/[0.18] transition-colors duration-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
        >
          <ScrambleText>getInTouch()</ScrambleText>
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white/60 hover:text-white/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-b border-white/[0.06]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left font-mono text-[12px] text-white/50 hover:text-white/80 px-8 py-3 transition-colors border-b border-white/[0.04] last:border-0"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left font-mono text-[12px] text-signal px-8 py-3"
          >
            getInTouch()
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

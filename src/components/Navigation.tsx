'use client';

import { useState } from 'react';
import { Code2, User, Briefcase, GraduationCap, Mail, Menu, X } from 'lucide-react';
import useScrollTo from '@/hooks/useScrollTo';

const Navigation = () => {
  const scrollTo = useScrollTo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'getAboutMe()', icon: <User size={16} />, id: 'about' },
    { label: 'getProjects()', icon: <Code2 size={16} />, id: 'projects' },
    { label: 'getExperience()', icon: <Briefcase size={16} />, id: 'experience' },
    { label: 'getEducation()', icon: <GraduationCap size={16} />, id: 'education' },
    { label: 'getInTouch()', icon: <Mail size={16} />, id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    scrollTo(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-50" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <span className="text-purple-400 font-bold font-condiment">Aspekts</span>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-purple-400"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-mono flex items-center gap-2 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-base font-mono w-full text-left flex items-center gap-2 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

'use client';

import { GraduationCap, Calendar } from 'lucide-react';
import SectionTitle from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const education = {
  degree: 'BSc Computer Science with Industrial Placement',
  institution: 'University of Dundee',
  period: 'Sep 2024 - Present',
  details: [
    'Currently in 3rd Year',
    'Specialising in Data Science and AI',
    'Vice President of the Dundee University Computing Society',
    'Maintaining A4 (First Class) average'
  ]
};

const Education = () => {
  return (
    <section id="education" className="bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle symbol="#" title="Education" />
        </AnimateOnScroll>
        
        <AnimateOnScroll>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white text-balance">{education.degree}</h3>
            </div>
            <p className="text-purple-400 font-semibold mb-2">{education.institution}</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Calendar size={14} />
              <span>{education.period}</span>
            </div>
            <ul className="space-y-2 text-gray-300">
              {education.details.map((detail, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-purple-400">→</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default Education;

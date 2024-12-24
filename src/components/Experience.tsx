import { Calendar, MapPin } from 'lucide-react';
import SectionTitle from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const Experience = () => {
  const experiences = [
    {
      title: 'Founder and CEO',
      company: 'Yarn Development',
      period: 'Mar 2021 - Present',
      location: 'Hybrid',
      description: 'Yarn Development is a young, dynamic company that blends AI innovation with practical, user-friendly solutions across education, transportation, and analytics. It has great potential for growth and further specialization in the AI-driven SaaS market.',
      technologies: ['Node.js', 'Python', 'MongoDB', 'React', 'RESTful APIs']
    },
    {
      title: 'Beta Manager',
      company: 'Documatic',
      period: 'Jun 2022 - Sep 2022',
      location: 'Remote',
      description: 'Led the beta testing and feedback process for features like Doculog (automated changelog generation) and Codesearch (natural language code search). Collaborated with developers to refine functionality, enhance user experience, and prioritize improvements based on user feedback and testing insights.',
      technologies: ['Git', 'GitHub']
    }
  ];

  return (
    <section id="experience" className="bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle symbol="#" title="Experience" />
        </AnimateOnScroll>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <AnimateOnScroll key={index}>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <p className="text-purple-400 font-semibold mb-2">{exp.company}</p>
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {exp.location}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
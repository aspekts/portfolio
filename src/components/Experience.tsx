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
      description: 'Spearheading freelance full-stack solutions for clients. Implementing responsive UIs with React/Next.js and automating deployment pipelines using Vercel and CI/CD workflows.',
      technologies: ['Next.js', 'DevOps', 'PostgreSQL', 'CI/CD']
    },
    {
      title: 'Beta Manager',
      company: 'Rover (formerly Documatic)',
      period: 'Jun 2022 - Sep 2022',
      location: 'Remote',
      description: 'Led beta testing for AI-related developer tools, gathering insights to improve NLP-driven features like Codesearch. Collaborated with engineering teams to refine system usability based on user feedback.',
      technologies: ['Agile', 'Git', 'Product Management']
    },
    {
      title: 'Co-Founder and Lead Developer',
      company: 'Pollo Game Boat',
      period: 'Feb 2021 - Jun 2022',
      location: 'Remote',
      description: 'Designed and scaled a Discord bot with a simulated economy to 250,000+ active users. Migrated backend infrastructure from MySQL to MongoDB and refactored from Node.js to TypeScript for scalability.',
      technologies: ['TypeScript', 'MongoDB', 'Node.js', 'Scalability']
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
                <h3 className="text-xl font-bold text-white text-balance">{exp.title}</h3>
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
                <p className="text-gray-300 mb-4 text-pretty">{exp.description}</p>
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
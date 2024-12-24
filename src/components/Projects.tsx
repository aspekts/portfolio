import { Github, ExternalLink } from 'lucide-react';
import SectionTitle from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const Projects = () => {
  const projects = [
    {
      title: 'Optimizing Pathfinding for Autonomous Electric Vehicles in Urban Environments',
      description: 'Research project on creating a dynamic routing algorithm for autonomous electric vehicles.',
      tags: ['Python', 'Datasets', 'NetworkX', 'Matplotlib'],
      links: {
        github: 'https://github.com/aspekts/ai-project'
      }
    },
    {
      title: 'Poe.com Reverse-Engineered API',
      description: 'Self-hostable, reverse engineering of Quora\'s Poe API for free access to models such as GPT-4, Claude and more',
      tags: ['Python', 'FastAPI', 'Docker', 'RESTful APIs'],
      links: {
        github: 'https://github.com/aspekts/PoeAPI'
      }
    },
    {
      title: 'QGenie',
      description: 'Uses a pre-trained LLM to generate exam-style questions and answers for UK A Level subjects ',
      tags: ['Node.js', 'Express', 'EJS', 'Tailwind CSS'],
      links: {
        github: 'https://github.com/aspekts/QGenie',
        live: 'https://qgenie.co.uk'
      }
    }
  ];

  return (
    <section id="projects" className="bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle symbol="#" title="Projects" />
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <AnimateOnScroll key={index} className="h-full">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-full">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.links.github} className="text-gray-400 hover:text-white transition-colors">
                    <Github size={20} />
                  </a>
                  {project.links.live && (
                    <a href={project.links.live} className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
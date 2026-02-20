'use client';

import { Github, ExternalLink } from 'lucide-react';
import SectionTitle from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const projects: Array<{
  title: string;
  description: string;
  tags: string[];
  links: { github: string; live?: string };
}> = [
  {
    title: 'Distributed Task Scheduler (Quartz-Lite)',
    description: 'High-availability job orchestration engine engineered in Java. Implements strict OOP patterns and custom thread-pool management for fault-tolerant execution.',
    tags: ['Java', 'Concurrency', 'SQL', 'JUnit'],
    links: { github: 'https://github.com/aspekts/quartz-lite' }
  },
  {
    title: 'Sendix',
    description: 'AI-powered cold email outreach SaaS. Features a real-time analytics pipeline for tracking open rates and Stripe integration for subscription payments.',
    tags: ['React', 'Node.js', 'Stripe', 'Supabase'],
    links: { github: 'https://github.com/aspekts/sendix' }
  },
  {
    title: 'QGenie',
    description: 'AI-driven question generation system using pretrained LLMs. Features complex prompting strategies and data validation pipelines to generate exam-style content.',
    tags: ['Node.js', 'Express', 'LLMs', 'Tailwind'],
    links: { github: 'https://github.com/aspekts/QGenie', live: 'https://qgenie.co.uk' }
  },
  {
    title: 'Campus Companion',
    description: 'Winner of DUCS Quackathon 2025. A chat-based student onboarding assistant built with Next.js and RAG (Retrieval-Augmented Generation) for instant Q&A.',
    tags: ['Next.js', 'Hackathon Winner', 'AI'],
    links: { github: 'https://github.com/aspekts/campus-companion' }
  },
  {
    title: 'PoeAPI',
    description: "Reverse-engineered API wrapper for Quora's Poe.com. Enables the open-source community to build integrations on top of closed platforms like GPT-4.",
    tags: ['Python', 'FastAPI', 'Reverse Engineering'],
    links: { github: 'https://github.com/aspekts/PoeAPI' }
  },
  {
    title: 'Autonomous EV Pathfinding',
    description: 'Research project implementing dynamic graph-based routing algorithms (Dijkstra/A*) for autonomous vehicles under real-world constraints like traffic.',
    tags: ['Python', 'NetworkX', 'Algorithms'],
    links: { github: 'https://github.com/aspekts/ai-project' }
  }
];

const Projects = () => {
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
                <h3 className="text-xl font-bold text-white mb-3 text-balance">{project.title}</h3>
                <p className="text-gray-300 mb-4 text-pretty">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a 
                    href={project.links.github} 
                    className="text-gray-400 hover:text-white transition-[color]"
                    aria-label={`View ${project.title} on GitHub`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={20} />
                  </a>
                  {project.links.live && (
                    <a 
                      href={project.links.live} 
                      className="text-gray-400 hover:text-white transition-[color]"
                      aria-label={`View ${project.title} live demo`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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

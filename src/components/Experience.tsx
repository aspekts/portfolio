'use client';

import SectionHeader from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const timeline = [
  {
    year: '2025 — present',
    title: 'Founder & CEO — Sendix AI Ltd.',
    org: 'GovTech · Edinburgh / Remote',
    desc: 'Building compliance infrastructure for the UK SEND statutory system. Azure OpenAI and Wonde API for document parsing and EHCP generation. Three venture awards; 30+ school commercial waitlist. Incorporating; Scottish EDGE grant application submitted.',
    active: true,
  },
  {
    year: 'spring 2026 · ML Technical Lead',
    title: 'Industry Project — NCR Atleos',
    org: 'University of Dundee · Team 5',
    desc: 'Led the ML track for a university industry project sponsored by NCR Atleos. Built real-time ATM failure correlation across 7 log sources using Apache Kafka, with an Isolation Forest anomaly detection model and Laplace smoothing feedback loop. Deployed on Railway.',
    active: true,
  },
  {
    year: 'summer 2024',
    title: 'Analyst Intern — Zamara Uganda',
    org: 'Pension fund management · Kampala',
    desc: 'Data analysis and internal tooling for one of East Africa\'s largest pension fund managers. Worked on actuarial data pipelines and client-facing reporting infrastructure, gaining exposure to large-scale financial data systems.',
    active: true,
  },
  {
    year: 'jun–sep 2022',
    title: 'Beta Programme Lead — Documatic',
    org: 'AI developer tooling · Remote',
    desc: 'Led beta testing for an AI-powered developer tooling startup. Gathered and synthesised user insights on NLP-driven Codesearch features. Collaborated with engineering teams to iterate on usability and surface high-signal feedback from early adopters.',
    active: true,
  },
  {
    year: '2021 — present',
    title: 'Founder & CEO — Yarn Development',
    org: 'Digital product agency · Remote',
    desc: 'Freelance digital product agency founded at age fifteen. Client-facing Next.js and React work across SaaS, EdTech, and marketing verticals. Automated deployment pipelines with Vercel and CI/CD; ongoing client relationships across the UK.',
    active: false,
  },
];

const Experience = () => {
  return (
    <section id="experience" className="border-b border-white/[0.06] py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="// 03" title="getExperience()" />

        <div className="max-w-2xl">
          {timeline.map((entry, index) => (
            <AnimateOnScroll key={entry.title} delay={index * 60}>
              <div className="flex gap-4">
                {/* Spine — neutral, not signal */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-[3px] flex-shrink-0 transition-colors ${
                      entry.active
                        ? 'bg-white/60 border border-white/30'
                        : 'bg-transparent border border-white/25'
                    }`}
                  />
                  {index < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-white/[0.1] mt-[3px] min-h-[24px]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <p className="font-mono text-[10px] text-white/50 tracking-[0.1em] mb-[3px]">
                    {entry.year}
                  </p>
                  <p className="font-display font-semibold text-[14px] text-white leading-snug mb-[2px] fvs-normal">
                    {entry.title}
                  </p>
                  <p className="font-mono text-[11px] text-white/40 mb-3">
                    {entry.org}
                  </p>
                  <p className="font-sans text-[13px] text-white/50 leading-[1.75] max-w-[54ch]">
                    {entry.desc}
                  </p>
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

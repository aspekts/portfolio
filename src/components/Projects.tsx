'use client';

import { useState } from 'react';
import SectionHeader from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';
import ScrambleText from './ScrambleText';
import { useTilt } from '@/hooks/useTilt';

const otherProjects: Array<{
  num: string;
  title: string;
  desc: string;
  tags: string[];
}> = [
  {
    num: '02 · industry project',
    title: 'NCR Atleos — ATM Failure Correlation',
    desc: 'Real-time anomaly detection across 7 ATM log sources. Isolation Forest ML model with Laplace smoothing feedback loop. Deployed on Railway.',
    tags: ['kafka', 'isolation forest', 'python', 'railway'],
  },
  {
    num: '03 · distributed systems',
    title: ' Distributed Task Scheduler (Quartz-Lite)',
    desc: 'High-availability job orchestration engine engineered in Java. Implements strict OOP patterns and custom thread-pool management for fault-tolerant execution.',
    tags: ['java', 'distributed systems', 'thread management'],
  },
  {
    num: '04 · edtech',
    title: "Nicolaou's Maths",
    desc: 'EdTech app with Exam Builder, RAG feedback sheets, teacher/student dashboards. Synthetic question seeding for copyright-free content.',
    tags: ['next.js', 'supabase', 'rag'],
  },
  {
      num: '05 · full-stack web app',
      title: 'FluxFile - Universal File Converter',
      desc: 'A full-stack, enterprise-grade web app built with Next.js, BullMQ, and Docker workers that converts audio, video, documents, and images with real-time progress tracking, encrypted zero-knowledge storage, and Stripe-powered payments.',
      tags: ['next.js', 'bullmq', 'docker', 'stripe', 'encryption'],
  },
  {
    num: '06 · infrastructure',
    title: 'Self-Hosted Homelab',
    desc: 'Oracle VPS, TrueNAS, Tailscale tailnet, Docker media stack, Gitea. Nginx Proxy Manager subdomain routing.',
    tags: ['docker', 'tailscale', 'truenas', 'nginx'],
  },
];

const SendixCard = ({ modalOpen, onToggle }: { modalOpen: boolean; onToggle: () => void }) => {
  const { onMouseMove, onMouseLeave } = useTilt(2.5);
  return (
    <div
      data-cursor="project"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative border border-white/[0.12] rounded-lg p-7 mb-3 overflow-hidden hover:border-white/[0.18] transition-colors duration-[220ms]"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, #7C6FD4 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      <p className="font-mono text-[10px] text-white/40 tracking-[0.14em] uppercase mb-[10px]">
        flagship · govtech
      </p>
      <h3 className="font-display font-bold text-[20px] text-white tracking-[-0.01em] mb-[6px] fvs-normal">
        Sendix — SEND Compliance Engine
      </h3>
      <p className="font-sans text-[13px] text-white/50 leading-[1.65] mb-6 max-w-[56ch]">
        GovTech B2B SaaS automating EHCP (Education, Health and Care Plan) compliance
        workflows across UK local authorities and schools. Built on Azure OpenAI and the
        Wonde API.
      </p>

      {/* Stats strip */}
      <div className="flex gap-8 mb-6 py-4 border-y border-white/[0.06]">
        {[
          { val: '30+', label: 'school waitlist' },
          { val: '3', label: 'venture awards' },
          { val: '£7500+', label: 'funding raised' },
        ].map((s) => (
          <div key={s.label}>
            <div className="font-display font-bold text-[22px] text-white leading-none tracking-[-0.02em] fvs-normal">
              {s.val}
            </div>
            <div className="font-mono text-[10px] text-white/40 tracking-[0.08em] uppercase mt-[2px]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-[5px] mb-5">
        {['azure openai', 'wonde api', 'next.js', 'govtech', 'b2b saas', 'incorporating'].map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] text-white/40 border border-white/[0.1] rounded-[3px] px-2 py-[3px]"
          >
            {t}
          </span>
        ))}
      </div>

      <button
        onClick={onToggle}
        className="inline-flex items-center gap-[6px] font-mono text-[11px] text-signal border border-signal/30 rounded px-[14px] py-[7px] hover:bg-signal/10 active:bg-signal/[0.18] transition-colors duration-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
      >
        {modalOpen ? '← close case study' : 'read the case study →'}
      </button>
    </div>
  );
};

const OtherProjectCard = ({ project }: { project: typeof otherProjects[number] }) => {
  const { onMouseMove, onMouseLeave } = useTilt(4);
  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="border border-white/[0.07] rounded-[6px] p-5 h-full hover:border-white/[0.13] transition-colors duration-[220ms]"
    >
      <p className="font-mono text-[10px] text-white/45 mb-2">{project.num}</p>
      <h3 className="font-display font-semibold text-[15px] text-white mb-[6px] leading-snug fvs-normal">
        <ScrambleText>{project.title}</ScrambleText>
      </h3>
      <p className="font-sans text-[13px] text-white/50 leading-[1.65] mb-3">
        {project.desc}
      </p>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] text-white/35 border border-white/[0.09] rounded-[3px] px-2 py-[3px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="projects" className="border-b border-white/[0.06] py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="// 02" title="getProjects()" />

        <AnimateOnScroll delay={60}>
          <SendixCard modalOpen={modalOpen} onToggle={() => setModalOpen(!modalOpen)} />
        </AnimateOnScroll>

        {/* Case study — inline below card, no modal */}
        {modalOpen && (
          <AnimateOnScroll>
            <div className="bg-surface border border-white/[0.09] rounded-lg p-8 mb-3">
              <p className="font-mono text-[10px] text-white/40 tracking-[0.14em] uppercase mb-3">
                case study · sendix ai ltd.
              </p>
              <h3 className="font-display font-bold text-[22px] text-white tracking-[-0.02em] mb-2 fvs-normal">
                Sendix — SEND Compliance Engine
              </h3>
              <p className="font-sans text-[14px] text-white/55 leading-[1.8] mb-6 max-w-[60ch]">
                The UK EHCP process is statutorily mandated and chronically broken — missed deadlines,
                lost documents, zero automation. Sendix is the compliance infrastructure layer schools
                and local authorities are missing.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { val: '30+', label: 'schools waitlist' },
                  { val: '3', label: 'venture awards' },
                  { val: '£0', label: 'raised (bootstrapped)' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="border border-white/[0.08] rounded px-3 py-3"
                  >
                    <div className="font-display font-bold text-[20px] text-white leading-none tracking-[-0.02em] fvs-normal">
                      {s.val}
                    </div>
                    <div className="font-mono text-[10px] text-white/40 tracking-[0.08em] uppercase mt-[3px]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="font-mono text-[10px] text-white/40 tracking-[0.14em] uppercase mb-2">
                    the problem
                  </p>
                  {[
                    'Local authorities legally obligated to complete EHCPs within 20 weeks. Most miss it by months.',
                    'Fragmented tooling — Word docs, email threads, spreadsheets — across 30+ contributing professionals.',
                    'No existing product built natively for the statutory SEND workflow.',
                  ].map((point) => (
                    <div key={point} className="flex gap-2 items-start mb-[6px]">
                      <span className="text-white/30 flex-shrink-0 mt-[3px] text-[12px]">—</span>
                      <span className="font-sans text-[13px] text-white/55 leading-[1.7]">{point}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-mono text-[10px] text-white/40 tracking-[0.14em] uppercase mb-2">
                    the build
                  </p>
                  {[
                    'Azure OpenAI for document parsing, EHCP generation, and compliance gap detection.',
                    'Wonde API for secure school data integration without manual ingestion.',
                    'Incorporating as Sendix AI Ltd. Scottish EDGE grant application submitted.',
                  ].map((point) => (
                    <div key={point} className="flex gap-2 items-start mb-[6px]">
                      <span className="text-white/30 flex-shrink-0 mt-[3px] text-[12px]">—</span>
                      <span className="font-sans text-[13px] text-white/55 leading-[1.7]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-[5px] mt-5">
                {['azure openai', 'wonde api', 'next.js', 'supabase', 'govtech', 'b2b saas'].map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] text-white/40 border border-white/[0.1] rounded-[3px] px-2 py-[3px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* Other projects grid */}
        <div className="grid md:grid-cols-2 gap-[10px]">
          {otherProjects.map((project, index) => (
            <AnimateOnScroll key={project.title} delay={index * 60}>
              <OtherProjectCard project={project} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

'use client';

import SectionHeader from './SectionTitle';
import AnimateOnScroll from './AnimateOnScroll';

const stack = [
  'Next.js · React',
  'Python · scikit-learn',
  'Azure OpenAI',
  'Apache Kafka',
  'TypeScript',
  'Java 21',
  'Docker · Tailscale',
  'PostgreSQL',
];

const About = () => {
  return (
    <section id="about" className="border-b border-white/[0.06] py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader num="// 01" title="getAboutMe()" />

        <div className="grid md:grid-cols-2 gap-12">
          <AnimateOnScroll delay={60}>
            <div className="space-y-5 max-w-[54ch]">
              <p className="font-sans text-[14px] text-white/55 leading-[1.85]">
                I started <strong className="text-white/85 font-semibold">Yarn Development</strong> at
                fifteen (a freelance digital product agency) because I wanted to build real things
                for real people, not wait until I had a degree to do it.
              </p>
              <p className="font-sans text-[14px] text-white/55 leading-[1.85]">
                Today I&apos;m running <strong className="text-white/85 font-semibold">Sendix AI Ltd.</strong>,
                a GovTech SaaS targeting a broken statutory system. I also recently served as ML Technical Lead on an{' '}
                <strong className="text-white/85 font-semibold">NCR Atleos</strong> industry project
                building real-time ATM failure correlation — Kafka, Isolation Forest, live in production.
              </p>
              <p className="font-sans text-[14px] text-white/55 leading-[1.85]">
                I move across the stack: product strategy, systems architecture, ML engineering, and
                infrastructure. I self-host everything I build.
              </p>
              <p className="font-sans text-[14px] text-white/55 leading-[1.85]">
                Third-year BSc Computer Science at University of Dundee. Specialising in Data Science
                and AI. Vice President of Dundee University Computing Society (DUCS). First-class average.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={120}>
            <div>
              {/* Label — raised opacity for readability */}
              <p className="font-mono text-[10px] text-white/40 tracking-[0.15em] uppercase mb-3">
                current stack
              </p>
              <div className="grid grid-cols-2 gap-[6px]">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[11px] text-white/50 border border-white/[0.09] rounded-[3px] px-[10px] py-[6px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default About;

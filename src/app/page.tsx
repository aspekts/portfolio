import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  return (
    <div className="bg-void min-h-dvh">
      <CustomCursor />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-void focus:px-4 focus:py-2 focus:rounded font-mono text-sm"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer className="px-8 py-8 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-mono text-[11px] text-white/25">
            © {new Date().getFullYear()} Marcus Kamuntu
          </p>
          <p className="font-mono text-[11px] text-white/35">
            aspekts.dev · built with Next.js, Tailwind, and a lot of ☕
          </p>
        </div>
      </footer>
    </div>
  );
}

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import GridBackground from './components/GridBackground';

function App() {
  return (
    <div className="bg-gray-900 min-h-dvh">
      <a 
        href="#about" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <GridBackground />
      <Navigation />
      <main id="main-content">
        <Hero />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <footer className="bg-gray-900 py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Marcus Kamuntu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
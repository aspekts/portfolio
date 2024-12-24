import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import GridBackground from './components/GridBackground';
function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <GridBackground />
      <Navigation />
      <Hero />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </div>
  );
}

export default App;
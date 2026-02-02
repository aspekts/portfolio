'use client';

import Terminal3D from './Terminal3D';
import useScrollTo from '@/hooks/useScrollTo';
import useLanyard, { msToMinutesAndSeconds } from '@/hooks/useLanyard';
import { useEffect, useState } from 'react';

const Hero = () => {
  const scrollTo = useScrollTo();
  const { spotifyPresence, vscodePresence } = useLanyard();
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);

  useEffect(() => {
    if (spotifyPresence) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - (spotifyPresence.timestamp ?? 0);
        setElapsedTime(msToMinutesAndSeconds(elapsed));
      }, 800);

      return () => clearInterval(interval);
    }
  }, [spotifyPresence]);

  return (
    <section id="about" className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-20 md:py-0">
      <div className="max-w-3xl w-full">
        <Terminal3D>
          <div className="font-mono text-gray-300">
            <div className="bg-gray-700 p-2 rounded-t-md">
              <div className="flex items-center space-x-2">
                <div className="size-3 bg-red-500 rounded-full"></div>
                <div className="size-3 bg-yellow-500 rounded-full"></div>
                <div className="size-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 flex justify-center">~/src/ABOUT.md</div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-b-md">
              <p className="text-gray-400">{`/* Full Stack Developer | AI and Data Enthusiast */`}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4 text-balance">
                Marcus
                <br />
                Kamuntu<span className="text-purple-400">;</span>
              </h1>
              <p className="text-sm text-purple-400 mb-4">aka @aspekts</p>
              <p className="text-base md:text-lg text-gray-300 mb-6 text-pretty">
                3rd year Computer Science student with a strong foundation in <span className="text-purple-400">System Architecture</span> and Full Stack Development. 
                Founder of Yarn Development. Currently seeking a <span className="text-purple-400">Software Engineering Industrial Placement</span> to apply technical expertise in a production environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollTo('projects')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition-colors w-full sm:w-auto text-center"
                >
                  getProjects()
                </button>
                <button 
                  onClick={() => scrollTo('contact')}
                  className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-6 py-2 rounded-md transition-colors w-full sm:w-auto text-center"
                >
                  getInTouch()
                </button>
              </div>
              {spotifyPresence && (
                <div className="mt-6 bg-gray-900 p-4 rounded-md">
                  <div className="text-green-400">
                    <p>$ <span className="text-gray-300">Listening to:</span> <span className="text-purple-400">{spotifyPresence.song}</span> by <span className="text-purple-400">{spotifyPresence.artist}</span> | {elapsedTime} / {spotifyPresence.duration}</p>
                  </div>
                </div>
              )}
              {vscodePresence && (
                <div className="mt-2 bg-gray-900 p-4 rounded-md">
                  <div className="text-green-400">
                    <p>$ <span className="text-gray-300">Currently coding in:</span> <span className="text-purple-400">{vscodePresence.state}</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Terminal3D>
      </div>
    </section>
  );
};

export default Hero;

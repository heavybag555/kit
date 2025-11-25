'use client';

import { useEffect } from 'react';
import { DrumGrid } from '@/components/DrumGrid';
import { useStore } from '@/lib/store';
import { SOUND_LIBRARY } from '@/data/soundLibrary';
import { Shuffle } from 'lucide-react';

export default function PadsPage() {
  const { assignPad } = useStore();

  const loadRandomKit = () => {
    // Assign 16 random sounds
    const categories = Object.keys(SOUND_LIBRARY);
    for (let i = 0; i < 16; i++) {
      const category = categories[i % categories.length]; // rotate categories
      const sounds = SOUND_LIBRARY[category];
      if (sounds && sounds.length > 0) {
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        assignPad(i, randomSound);
      }
    }
  };

  // Load a kit on mount if empty
  useEffect(() => {
    loadRandomKit();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">DRUM KIT / pads</h1>
        <div className="flex gap-4 items-center">
          <button 
            onClick={loadRandomKit}
            className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-full transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle Kit
          </button>
          <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors">
            Back to Home
          </a>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6 bg-gray-50">
        <div className="w-full max-w-2xl">
           <DrumGrid />
           <p className="text-center text-gray-400 text-sm mt-8">
             Use keyboard keys (1-4, Q-R, A-F, Z-V) to play
           </p>
        </div>
      </main>
    </div>
  );
}


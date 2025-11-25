'use client';

import { SequencerGrid } from '@/components/SequencerGrid';
import { useStore } from '@/lib/store';

export default function SequencerPage() {
  const { setBpm, bpm } = useStore();

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">DRUM KIT / sequencer</h1>
        <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors">
          Back to Home
        </a>
      </header>

      <main className="p-6 bg-gray-50 min-h-[calc(100vh-73px)] flex flex-col items-center">
         <SequencerGrid />
         
         <div className="mt-8 w-full max-w-md">
            <label className="text-xs font-bold uppercase text-gray-400 block mb-2">BPM Control</label>
            <input 
              type="range" 
              min="60" 
              max="200" 
              value={bpm} 
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="text-center mt-2 font-mono">{bpm}</div>
         </div>
      </main>
    </div>
  );
}


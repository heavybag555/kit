'use client';

import { ParameterControls } from '@/components/ParameterControls';
import { SoundSelector } from '@/components/SoundSelector';
import { WaveformDisplay } from '@/components/WaveformDisplay';
import { useStore } from '@/lib/store';
import { ArrowRight, Download, Moon, Share, X } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const { selectedSound } = useStore();

  return (
    <div className="h-screen w-screen bg-white text-black font-sans overflow-hidden flex flex-col relative selection:bg-[#EFF94D] selection:text-black">
      {/* Top Nav */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-xl font-bold leading-tight tracking-tight">
            Breadcrumb®<br />
            Tester
          </h1>
        </div>

        <div className="pointer-events-auto flex gap-3">
            <button className="h-10 px-6 rounded-full border border-black bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Kit
            </button>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors">
            <Share className="w-4 h-4" />
          </button>
          <Link 
            href="/" 
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full">
        {/* Large Text Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
             <h1 className="text-[15vw] font-bold tracking-tighter text-center leading-none whitespace-nowrap px-10">
                {selectedSound ? selectedSound.name.replace(/\.[^/.]+$/, "") : 'select sound'}
            </h1>
        </div>
        
        {/* Waveform Overlay */}
        {selectedSound && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-20">
                 <WaveformDisplay className="w-3/4 h-[40vh] !bg-transparent" />
            </div>
        )}

        {/* Floating Parameters (Yellow Box) */}
        <div className="absolute bottom-24 md:bottom-32 z-20">
           <ParameterControls />
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end z-30 pointer-events-none">
         <div className="pointer-events-auto flex gap-2">
             <SoundSelector />
         </div>
         
         {/* Right side */}
         <div className="pointer-events-auto flex gap-2">
             <button className="bg-white border border-gray-200 hover:border-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
                Stylistic sets
             </button>
             <button className="bg-white border border-gray-200 hover:border-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
                Features
             </button>
         </div>
      </div>
      
      {/* Corner Accents from reference image */}
      <div className="absolute top-16 left-4 w-8 h-8 border-t border-l border-black/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-16 right-4 w-8 h-8 border-t border-r border-black/20 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-24 left-4 w-8 h-8 border-b border-l border-black/20 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-24 right-4 w-8 h-8 border-b border-r border-black/20 rounded-br-3xl pointer-events-none" />
    </div>
  );
}

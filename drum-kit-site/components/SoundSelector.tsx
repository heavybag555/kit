'use client';

import { useStore } from '@/lib/store';
import { SOUND_LIBRARY, Sound } from '@/data/soundLibrary';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { audioEngine } from '@/lib/audio/audioEngine';

const CATEGORIES = ['kicks', 'snares', 'hats', 'percs', 'vox', 'background'];

export function SoundSelector() {
  const { selectedCategory, setSelectedCategory, selectedSound, setSelectedSound, audioParams } = useStore();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLDivElement>(null);

  const sounds = SOUND_LIBRARY[selectedCategory] || [];

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (soundRef.current && !soundRef.current.contains(event.target as Node)) {
        setIsSoundOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const playSound = async (sound: Sound) => {
      try {
          await audioEngine.resume();
          const buffer = await audioEngine.loadSound(sound.path);
          audioEngine.playSound(buffer, audioParams);
      } catch (e) {
          console.error(e);
      }
  }

  return (
    <div className="flex gap-3 items-center">
      {/* Category Selector */}
      <div className="relative" ref={categoryRef}>
        <button 
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="bg-white border border-gray-200 hover:border-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md min-w-[100px] justify-between"
        >
          <span className="capitalize">{selectedCategory}</span>
          {isCategoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isCategoryOpen && (
          <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-100 rounded-xl shadow-xl p-1 min-w-[160px] overflow-hidden z-50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsCategoryOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm rounded-lg transition-colors capitalize",
                  selectedCategory === cat ? "bg-black text-white" : "hover:bg-gray-50 text-gray-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sound Selector */}
      <div className="relative" ref={soundRef}>
        <button 
          onClick={() => setIsSoundOpen(!isSoundOpen)}
          className="bg-white border border-gray-200 hover:border-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md min-w-[160px] justify-between"
        >
          <span className="truncate max-w-[120px]">{selectedSound?.name || 'Select Sound'}</span>
          {isSoundOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isSoundOpen && (
          <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-100 rounded-xl shadow-xl p-1 w-[240px] max-h-[300px] overflow-y-auto z-50">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => {
                  setSelectedSound(sound);
                  setIsSoundOpen(false);
                  playSound(sound);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm rounded-lg transition-colors truncate flex items-center justify-between group",
                  selectedSound?.id === sound.id ? "bg-black text-white" : "hover:bg-gray-50 text-gray-600"
                )}
              >
                <span>{sound.name}</span>
                <Play className={cn("w-3 h-3 opacity-0 group-hover:opacity-100", selectedSound?.id === sound.id && "text-white")} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


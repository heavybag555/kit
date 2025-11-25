'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { audioEngine } from '@/lib/audio/audioEngine';
import { cn } from '@/lib/utils';
import { Sound } from '@/data/soundLibrary';

const KEY_MAP = [
  '1', '2', '3', '4',
  'q', 'w', 'e', 'r',
  'a', 's', 'd', 'f',
  'z', 'x', 'c', 'v'
];

export function DrumGrid() {
  const { padAssignments, audioParams } = useStore();
  const [activePad, setActivePad] = useState<number | null>(null);

  const playPad = async (index: number) => {
    const sound = padAssignments[index];
    if (!sound) return;

    setActivePad(index);
    setTimeout(() => setActivePad(null), 100);

    try {
      await audioEngine.resume();
      const buffer = await audioEngine.loadSound(sound.path);
      audioEngine.playSound(buffer, audioParams);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const index = KEY_MAP.indexOf(e.key.toLowerCase());
      if (index !== -1) {
        playPad(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [padAssignments, audioParams]);

  return (
    <div className="grid grid-cols-4 gap-4 w-full max-w-2xl mx-auto aspect-square">
      {KEY_MAP.map((key, index) => {
        const sound = padAssignments[index];
        return (
          <button
            key={key}
            onMouseDown={() => playPad(index)}
            className={cn(
              "relative rounded-xl border-2 transition-all duration-75 flex flex-col items-center justify-center p-2",
              activePad === index
                ? "bg-black border-black text-white scale-95 shadow-inner"
                : "bg-white border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md",
              !sound && "opacity-50 bg-gray-50"
            )}
          >
            <span className={cn(
              "absolute top-2 left-3 text-xs font-bold uppercase",
              activePad === index ? "text-gray-400" : "text-gray-300"
            )}>
              {key}
            </span>
            
            <div className="text-center truncate w-full px-2">
              {sound ? (
                <span className="text-sm font-medium truncate block">
                  {sound.name}
                </span>
              ) : (
                <span className="text-xs text-gray-300">Empty</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}


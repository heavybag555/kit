'use client';

import { useStore } from '@/lib/store';
import { SOUND_LIBRARY, Sound } from '@/data/soundLibrary';
import { audioEngine } from '@/lib/audio/audioEngine';
import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';
import { useState } from 'react';

export function SoundList() {
  const { selectedCategory, selectedSound, setSelectedSound, audioParams } = useStore();
  const sounds = SOUND_LIBRARY[selectedCategory] || [];
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlay = async (e: React.MouseEvent, sound: Sound) => {
    e.stopPropagation();
    
    if (playingId === sound.id) {
      // Stop logic if we had a stop method, but for one-shots we usually just let them play or re-trigger.
      // Here we'll just re-trigger.
    }

    try {
      setPlayingId(sound.id);
      setSelectedSound(sound);
      
      // Resume context if needed
      await audioEngine.resume();
      
      const buffer = await audioEngine.loadSound(sound.path);
      audioEngine.playSound(buffer, audioParams);
      
      // Reset playing icon after a short delay (approx duration)
      // Ideally we'd track actual duration
      setTimeout(() => setPlayingId(null), 500); 
    } catch (err) {
      console.error('Error playing sound:', err);
      setPlayingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {sounds.map((sound) => (
        <div
          key={sound.id}
          onClick={() => setSelectedSound(sound)}
          className={cn(
            "group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
            selectedSound?.id === sound.id
              ? "border-black bg-gray-50"
              : "border-transparent hover:bg-gray-50 hover:border-gray-200"
          )}
        >
          <span className={cn(
            "font-medium truncate",
            selectedSound?.id === sound.id ? "text-black" : "text-gray-600"
          )}>
            {sound.name}
          </span>
          
          <button
            onClick={(e) => handlePlay(e, sound)}
            className={cn(
              "p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100",
              selectedSound?.id === sound.id ? "opacity-100 bg-black text-white" : "bg-gray-200 text-black"
            )}
          >
            {playingId === sound.id ? (
              <Play className="w-4 h-4 fill-current" /> // Visual feedback
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>
        </div>
      ))}
      
      {sounds.length === 0 && (
        <div className="text-gray-400 text-center py-10">
          No sounds found in this category.
        </div>
      )}
    </div>
  );
}


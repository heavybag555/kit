'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { audioEngine } from '@/lib/audio/audioEngine';
import { SOUND_LIBRARY } from '@/data/soundLibrary';
import { cn } from '@/lib/utils';
import { Play, Square, Pause } from 'lucide-react';

const STEPS = 16;
const TRACKS = ['kicks', 'snares', 'hats', 'percs'];

export function SequencerGrid() {
  const { 
    bpm, 
    isPlaying, 
    setIsPlaying, 
    sequencerSteps, 
    toggleStep, 
    currentStep, 
    setCurrentStep,
    sequencerTracks,
    setSequencerTrack,
    audioParams
  } = useStore();

  // Audio Scheduling Refs
  const nextNoteTime = useRef(0);
  const stepRef = useRef(0);
  const timerID = useRef<NodeJS.Timeout | null>(null);
  const scheduleAheadTime = 0.1; // seconds
  const lookahead = 25.0; // ms

  // Initialize Tracks
  useEffect(() => {
    TRACKS.forEach((cat, i) => {
      if (!sequencerTracks[i] && SOUND_LIBRARY[cat] && SOUND_LIBRARY[cat].length > 0) {
        setSequencerTrack(i, SOUND_LIBRARY[cat][0]);
      }
    });
  }, []);

  const nextNote = () => {
    const state = useStore.getState();
    const secondsPerBeat = 60.0 / state.bpm;
    nextNoteTime.current += 0.25 * secondsPerBeat; // 16th notes
    
    // Advance step ref
    const nextStep = (stepRef.current + 1) % 16;
    stepRef.current = nextStep;
    setCurrentStep(nextStep); // Sync to UI
  };

  const scheduleNote = (stepNumber: number, time: number) => {
    const state = useStore.getState();
    state.sequencerTracks.forEach((track, trackIdx) => {
      if (state.sequencerSteps[trackIdx][stepNumber] && track) {
        audioEngine.loadSound(track.path).then(buffer => {
            audioEngine.playSound(buffer, state.audioParams, time);
        });
      }
    });
  };

  const scheduler = () => {
    const context = audioEngine.getContext();
    if (!context) return;

    while (nextNoteTime.current < context.currentTime + scheduleAheadTime) {
      scheduleNote(stepRef.current, nextNoteTime.current);
      nextNote();
    }
    timerID.current = setTimeout(scheduler, lookahead);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerID.current) clearTimeout(timerID.current);
    } else {
      const context = audioEngine.getContext();
      if (context) {
        await audioEngine.resume();
        nextNoteTime.current = context.currentTime + 0.05;
        stepRef.current = 0;
        setCurrentStep(0);
        setIsPlaying(true);
        scheduler();
      }
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerID.current) clearTimeout(timerID.current);
      setIsPlaying(false);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">TEMPO</span>
            <span className="text-xl font-mono font-bold">{bpm} BPM</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sequencerTracks.map((track, trackIdx) => (
          <div key={trackIdx} className="flex items-center gap-4">
            <div className="w-32 text-right">
              <div className="text-xs font-bold uppercase text-gray-400">{TRACKS[trackIdx]}</div>
              <div className="text-sm font-medium truncate">{track?.name || 'Empty'}</div>
            </div>
            
            <div className="flex-1 grid grid-cols-16 gap-1">
              {Array.from({ length: STEPS }).map((_, stepIdx) => (
                <button
                  key={stepIdx}
                  onClick={() => toggleStep(trackIdx, stepIdx)}
                  className={cn(
                    "h-12 rounded-sm transition-all duration-100",
                    stepIdx % 4 === 0 ? "border-l-2 border-l-gray-300" : "",
                    sequencerSteps[trackIdx][stepIdx] 
                      ? "bg-black" 
                      : "bg-gray-100 hover:bg-gray-200",
                    isPlaying && currentStep === stepIdx && "ring-2 ring-blue-500 z-10"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


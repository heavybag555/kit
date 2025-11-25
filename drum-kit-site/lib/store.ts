import { create } from 'zustand';
import { AudioParams, DEFAULT_AUDIO_PARAMS } from './audio/types';
import { Sound } from '../data/soundLibrary';

interface AppState {
  selectedCategory: string;
  selectedSound: Sound | null;
  audioParams: AudioParams;
  isPlaying: boolean;
  padAssignments: Record<number, Sound | null>;
  
  // Sequencer
  bpm: number;
  sequencerSteps: boolean[][]; // [trackIndex][stepIndex]
  sequencerTracks: Sound[]; // [trackIndex] -> Sound
  currentStep: number;

  // Actions
  setSelectedCategory: (category: string) => void;
  setSelectedSound: (sound: Sound | null) => void;
  updateAudioParams: (params: Partial<AudioParams>) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  resetParams: () => void;
  assignPad: (padId: number, sound: Sound) => void;
  
  setBpm: (bpm: number) => void;
  toggleStep: (trackIdx: number, stepIdx: number) => void;
  setSequencerTrack: (trackIdx: number, sound: Sound) => void;
  setCurrentStep: (step: number) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedCategory: 'kicks',
  selectedSound: null,
  audioParams: DEFAULT_AUDIO_PARAMS,
  isPlaying: false,
  padAssignments: {},
  
  bpm: 120,
  sequencerSteps: Array(4).fill(Array(16).fill(false)),
  sequencerTracks: [], // initialized in component or default
  currentStep: 0,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedSound: (sound) => set({ selectedSound: sound }),
  updateAudioParams: (updates) => 
    set((state) => ({ 
      audioParams: { ...state.audioParams, ...updates } 
    })),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  resetParams: () => set({ audioParams: DEFAULT_AUDIO_PARAMS }),
  assignPad: (padId, sound) => 
    set((state) => ({
      padAssignments: { ...state.padAssignments, [padId]: sound }
    })),
    
  setBpm: (bpm) => set({ bpm }),
  toggleStep: (trackIdx, stepIdx) => set((state) => {
    const newSteps = state.sequencerSteps.map(row => [...row]);
    newSteps[trackIdx][stepIdx] = !newSteps[trackIdx][stepIdx];
    return { sequencerSteps: newSteps };
  }),
  setSequencerTrack: (trackIdx, sound) => set((state) => {
    const newTracks = [...state.sequencerTracks];
    newTracks[trackIdx] = sound;
    return { sequencerTracks: newTracks };
  }),
  setCurrentStep: (step) => set({ currentStep: step }),
}));


export interface ReverbParams {
  mix: number;      // 0 to 1
  decay: number;    // 0.1 to 10 seconds
  preDelay: number; // 0 to 0.1 seconds
}

export interface FilterParams {
  type: 'lowpass' | 'highpass' | 'bandpass';
  frequency: number; // 20 to 20000 Hz
  Q: number;         // 0 to 20
  gain?: number;
}

export interface DistortionParams {
  amount: number;   // 0 to 1 (or higher for extreme)
  oversample?: 'none' | '2x' | '4x';
}

export interface AudioParams {
  pitch: number;        // -24 to +24 semitones
  attack: number;       // 0 to 2 seconds
  decay: number;        // 0 to 5 seconds
  sustain: number;      // 0 to 1 (level)
  release: number;      // 0 to 5 seconds
  reverb: ReverbParams;
  filter: FilterParams;
  distortion: DistortionParams;
  gain: number;         // 0 to 2 (volume)
  pan: number;          // -1 to 1
}

export const DEFAULT_AUDIO_PARAMS: AudioParams = {
  pitch: 0,
  attack: 0.001,
  decay: 0.5,
  sustain: 1,
  release: 0.1,
  reverb: {
    mix: 0,
    decay: 1.5,
    preDelay: 0.01
  },
  filter: {
    type: 'lowpass',
    frequency: 20000,
    Q: 1
  },
  distortion: {
    amount: 0,
    oversample: 'none'
  },
  gain: 1,
  pan: 0
};


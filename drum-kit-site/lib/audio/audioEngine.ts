import { AudioParams, DEFAULT_AUDIO_PARAMS } from './types';

export class AudioEngine {
  private context: AudioContext | null = null;
  private impulseBuffer: AudioBuffer | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContextClass();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.generateImpulseResponse();
    }
  }

  public getContext(): AudioContext | null {
    return this.context;
  }

  public async resume() {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  public async loadSound(url: string): Promise<AudioBuffer> {
    // Use current context or create a temporary offline one if purely for loading (though decodeAudioData needs context)
    if (!this.context) {
       // Create temp context if main one missing (e.g. server side, though this runs client side)
       const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
       this.context = new AudioContextClass();
    }
    
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.context.decodeAudioData(arrayBuffer);
  }

  private generateImpulseResponse(ctx?: BaseAudioContext) {
    const context = ctx || this.context;
    if (!context) return null;

    const duration = 2.0;
    const decay = 2.0;
    const sampleRate = context.sampleRate;
    const length = sampleRate * duration;
    const impulse = context.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length; // normalized time
      const noise = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
      left[i] = noise;
      right[i] = noise;
    }

    if (!ctx) this.impulseBuffer = impulse;
    return impulse;
  }

  public playSound(buffer: AudioBuffer, params: AudioParams = DEFAULT_AUDIO_PARAMS, time: number = 0) {
    if (!this.context || !this.masterGain) return;

    const t = time || this.context.currentTime;
    this.buildGraph(this.context, this.masterGain, buffer, params, t);
  }

  public async exportProcessedSound(buffer: AudioBuffer, params: AudioParams): Promise<Blob> {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const OfflineContextClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    
    // Calculate duration
    const playbackRate = Math.pow(2, params.pitch / 12);
    const duration = (buffer.duration / playbackRate) + params.decay + 2.0; // +2s tail for reverb
    const sampleRate = 44100;
    
    const offlineCtx = new OfflineContextClass(2, duration * sampleRate, sampleRate);
    
    this.buildGraph(offlineCtx, offlineCtx.destination, buffer, params, 0);
    
    const renderedBuffer = await offlineCtx.startRendering();
    return this.bufferToWave(renderedBuffer, 0, renderedBuffer.length);
  }

  private buildGraph(
    context: BaseAudioContext, 
    destination: AudioNode, 
    buffer: AudioBuffer, 
    params: AudioParams, 
    startTime: number
  ) {
    // Source
    const source = context.createBufferSource();
    source.buffer = buffer;
    
    const playbackRate = Math.pow(2, params.pitch / 12);
    source.playbackRate.value = playbackRate;

    // Filter
    const filter = context.createBiquadFilter();
    filter.type = params.filter.type;
    filter.frequency.value = params.filter.frequency;
    filter.Q.value = params.filter.Q;

    // Distortion
    const distortion = context.createWaveShaper();
    if (params.distortion.amount > 0) {
      distortion.curve = this.makeDistortionCurve(params.distortion.amount * 100);
      distortion.oversample = params.distortion.oversample || 'none';
    }

    // Envelope
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(params.gain, startTime + params.attack);
    envelope.gain.exponentialRampToValueAtTime(params.sustain * params.gain, startTime + params.attack + params.decay);

    // Panner
    const panner = context.createStereoPanner();
    panner.pan.value = params.pan;

    // Reverb
    const reverbGain = context.createGain();
    reverbGain.gain.value = params.reverb.mix;
    
    const convolver = context.createConvolver();
    // We need to regenerate impulse for offline context or use the buffer? 
    // Buffer is transferable usually.
    // Or generate new one for offline context to be safe.
    const impulse = this.generateImpulseResponse(context);
    if (impulse) convolver.buffer = impulse;

    const dryGain = context.createGain();
    dryGain.gain.value = 1 - params.reverb.mix * 0.5;

    source.connect(filter);
    filter.connect(distortion);
    distortion.connect(envelope);
    envelope.connect(panner);
    
    panner.connect(dryGain);
    dryGain.connect(destination);

    panner.connect(reverbGain);
    reverbGain.connect(convolver);
    convolver.connect(destination);

    source.start(startTime);
  }

  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = i * 2 / n_samples - 1;
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Helper to convert AudioBuffer to WAV Blob
  private bufferToWave(abuffer: AudioBuffer, offset: number, len: number): Blob {
    let numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        pos = 0;
  
    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"
  
    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this writer)
  
    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length
  
    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));
  
    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // write 16-bit sample
        pos += 2;
      }
      offset++ // next source sample
    }
  
    // Helper functions
    function setUint16(data: any) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
  
    function setUint32(data: any) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  
    return new Blob([buffer], {type: "audio/wav"});
  }
}

export const audioEngine = new AudioEngine();

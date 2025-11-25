'use client';

import { useEffect, useRef, useState } from 'react';
import { audioEngine } from '@/lib/audio/audioEngine';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface WaveformDisplayProps {
  className?: string;
  color?: string;
}

export function WaveformDisplay({ className, color = '#000' }: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedSound, audioParams, isPlaying } = useStore();
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  
  useEffect(() => {
    let active = true;
    
    if (selectedSound) {
      audioEngine.loadSound(selectedSound.path)
        .then(buffer => {
          if (active) setAudioBuffer(buffer);
        })
        .catch(err => console.error('Failed to load sound for waveform:', err));
    } else {
      setAudioBuffer(null);
    }
    
    return () => { active = false; };
  }, [selectedSound]);

  useEffect(() => {
    drawWaveform();
    window.addEventListener('resize', drawWaveform);
    return () => window.removeEventListener('resize', drawWaveform);
  }, [audioBuffer, audioParams, color]); // Re-draw when params or color change

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Waveform
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = color;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      // Draw vertical bar
      // Rect approach for cleaner look
      const barHeight = Math.max(1, (max - min) * amp);
      const y = (height / 2) - (barHeight / 2);
      
      ctx.fillRect(i, y, 1, barHeight);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full h-64", className)}>
      {selectedSound ? (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-300 text-4xl font-light">
          select a sound
        </div>
      )}
    </div>
  );
}


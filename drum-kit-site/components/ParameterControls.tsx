'use client';

import { useStore } from '@/lib/store';
import { Slider } from './ui/slider';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ParameterControls() {
  const { audioParams, updateAudioParams, resetParams } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className={cn(
        "bg-[#EFF94D] rounded-2xl shadow-xl overflow-hidden", // Yellow background
        isExpanded ? "p-6 w-full max-w-2xl" : "p-4 w-[400px]"
      )}
    >
      <div className="flex justify-between items-center mb-4">
         <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isExpanded ? 'Less Controls' : 'Sound Controls'}
        </button>
        <button 
          onClick={resetParams}
          className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
          title="Reset Parameters"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
      
      <div className="space-y-3">
        {/* Always visible controls */}
        <Slider
          label="Pitch"
          value={audioParams.pitch}
          min={-12}
          max={12}
          step={1}
          onChange={(v) => updateAudioParams({ pitch: v })}
          formatValue={(v) => `${v > 0 ? '+' : ''}${v}`}
        />
        <Slider
          label="Filter"
          value={audioParams.filter.frequency}
          min={20}
          max={20000}
          step={100}
          onChange={(v) => updateAudioParams({ filter: { ...audioParams.filter, frequency: v } })}
          formatValue={(v) => `${Math.round(v)}`}
        />
        <Slider
            label="Decay"
            value={audioParams.decay}
            min={0}
            max={2.0}
            step={0.05}
            onChange={(v) => updateAudioParams({ decay: v })}
            formatValue={(v) => `${Math.round(v * 1000)}ms`}
          />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pt-3 border-t border-black/10"
            >
               <Slider
                label="Attack"
                value={audioParams.attack}
                min={0}
                max={0.5}
                step={0.01}
                onChange={(v) => updateAudioParams({ attack: v })}
                formatValue={(v) => `${Math.round(v * 1000)}ms`}
              />
              <Slider
                label="Gain"
                value={audioParams.gain}
                min={0}
                max={2}
                step={0.1}
                onChange={(v) => updateAudioParams({ gain: v })}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
              <Slider
                label="Resonance"
                value={audioParams.filter.Q}
                min={0}
                max={20}
                step={0.5}
                onChange={(v) => updateAudioParams({ filter: { ...audioParams.filter, Q: v } })}
              />
              <Slider
                label="Reverb"
                value={audioParams.reverb.mix}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => updateAudioParams({ reverb: { ...audioParams.reverb, mix: v } })}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
              <Slider
                label="Distort"
                value={audioParams.distortion.amount}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => updateAudioParams({ distortion: { ...audioParams.distortion, amount: v } })}
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

'use client';

import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange, 
  formatValue = (v) => v.toString(),
  className 
}: SliderProps) {
  return (
    <div className={cn("flex items-center gap-4 w-full", className)}>
      <label className="w-20 text-xs font-semibold uppercase tracking-wide text-black/70 truncate">
        {label}
      </label>
      <div className="relative flex-1 h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-full h-[1px] bg-black/20 rounded-full overflow-hidden">
           <div 
             className="h-full bg-black" 
             style={{ width: `${((value - min) / (max - min)) * 100}%` }}
           />
        </div>
        <div 
          className="absolute h-3 w-3 bg-black rounded-full pointer-events-none transform -translate-x-1/2 transition-transform duration-75 ease-out"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <span className="w-12 text-right text-xs font-mono text-black/70 tabular-nums">
        {formatValue(value)}
      </span>
    </div>
  );
}


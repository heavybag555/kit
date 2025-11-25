'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { audioEngine } from '@/lib/audio/audioEngine';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Download, Loader2, AlertTriangle } from 'lucide-react';
import { SOUND_LIBRARY } from '@/data/soundLibrary';

export default function ExportPage() {
  const { selectedSound, audioParams, padAssignments, selectedCategory } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportCurrentSound = async () => {
    if (!selectedSound) return;
    setIsProcessing(true);
    try {
      const buffer = await audioEngine.loadSound(selectedSound.path);
      const blob = await audioEngine.exportProcessedSound(buffer, audioParams);
      saveAs(blob, `${selectedSound.name}_processed.wav`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportPads = async () => {
    setIsProcessing(true);
    setProgress(0);
    const zip = new JSZip();
    const sounds = Object.values(padAssignments).filter(s => s !== null);
    
    if (sounds.length === 0) {
      alert("No sounds assigned to pads!");
      setIsProcessing(false);
      return;
    }

    try {
      let completed = 0;
      for (const sound of sounds) {
        if (!sound) continue;
        const buffer = await audioEngine.loadSound(sound.path);
        const blob = await audioEngine.exportProcessedSound(buffer, audioParams);
        zip.file(`${sound.name}_processed.wav`, blob);
        completed++;
        setProgress(Math.round((completed / sounds.length) * 100));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "drum_kit_pads.zip");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const exportCategory = async () => {
    const sounds = SOUND_LIBRARY[selectedCategory];
    if (!sounds || sounds.length === 0) return;
    
    const confirm = window.confirm(`This will process ${sounds.length} sounds. It may take a while. Continue?`);
    if (!confirm) return;

    setIsProcessing(true);
    setProgress(0);
    const zip = new JSZip();

    try {
      let completed = 0;
      for (const sound of sounds) {
        const buffer = await audioEngine.loadSound(sound.path);
        const blob = await audioEngine.exportProcessedSound(buffer, audioParams);
        zip.file(`${sound.name}_processed.wav`, blob);
        completed++;
        setProgress(Math.round((completed / sounds.length) * 100));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${selectedCategory}_kit.zip`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">DRUM KIT / export</h1>
        <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors">
          Back to Home
        </a>
      </header>

      <main className="p-8 bg-gray-50 min-h-[calc(100vh-73px)] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Export Your Kit</h2>
          
          <div className="space-y-6">
            {/* Current Sound */}
            <div className="p-4 border border-gray-200 rounded-lg hover:border-black transition-colors flex justify-between items-center">
              <div>
                <h3 className="font-bold">Current Sound</h3>
                <p className="text-sm text-gray-500">{selectedSound ? selectedSound.name : 'No sound selected'}</p>
              </div>
              <button 
                onClick={exportCurrentSound}
                disabled={!selectedSound || isProcessing}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                {isProcessing && !progress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export WAV
              </button>
            </div>

            {/* Pad Kit */}
            <div className="p-4 border border-gray-200 rounded-lg hover:border-black transition-colors flex justify-between items-center">
              <div>
                <h3 className="font-bold">Pad Kit</h3>
                <p className="text-sm text-gray-500">All sounds currently assigned to pads (ZIP)</p>
              </div>
              <button 
                onClick={exportPads}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md disabled:opacity-50 hover:bg-gray-800"
              >
                 {isProcessing && progress > 0 ? <span className="font-mono">{progress}%</span> : <Download className="w-4 h-4" />}
                Export ZIP
              </button>
            </div>

             {/* Category */}
             <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg hover:border-yellow-400 transition-colors flex justify-between items-center">
              <div>
                <h3 className="font-bold text-yellow-900 flex items-center gap-2">
                  Full {selectedCategory} Category
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </h3>
                <p className="text-sm text-yellow-700">Export all {SOUND_LIBRARY[selectedCategory]?.length || 0} sounds in this category. Processing heavy.</p>
              </div>
              <button 
                onClick={exportCategory}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-yellow-900 text-white px-4 py-2 rounded-md disabled:opacity-50 hover:bg-yellow-800"
              >
                 {isProcessing && progress > 0 ? <span className="font-mono">{progress}%</span> : <Download className="w-4 h-4" />}
                Export ZIP
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Note: All exports include the currently applied parameters (Pitch, Filter, FX).
            </p>
            {/* Placeholder for payment */}
            <div className="mt-4 text-center">
               <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                 FREE PREVIEW
               </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


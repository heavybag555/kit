import Link from 'next/link';
import { ArrowRight, Music, Grid, Sliders, Download } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center items-center text-center p-6 lg:p-24 border-b border-gray-100">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-black text-sm font-medium tracking-wide">
          NEW RELEASE v1.0
        </div>
        <h1 className="text-6xl lg:text-9xl font-bold tracking-tighter mb-8">
          DRUM KIT
        </h1>
        <p className="text-xl lg:text-2xl text-gray-500 max-w-2xl mb-12 font-light">
          An interactive sonic experience. Customize, play, and export studio-quality drum sounds directly in your browser.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/explore"
            className="group bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/pads"
            className="group bg-white border border-gray-200 text-black px-8 py-4 rounded-full text-lg font-bold hover:border-black transition-all flex items-center gap-2"
          >
            Play Pads
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <Link href="/explore" className="group p-12 hover:bg-gray-50 transition-colors">
          <Sliders className="w-10 h-10 mb-6 text-gray-400 group-hover:text-black transition-colors" />
          <h3 className="text-2xl font-bold mb-4">Customize</h3>
          <p className="text-gray-500">
            Adjust pitch, filter, envelope, and effects for every sound. Sculpt your perfect tone.
          </p>
        </Link>
        
        <Link href="/sequencer" className="group p-12 hover:bg-gray-50 transition-colors">
          <Grid className="w-10 h-10 mb-6 text-gray-400 group-hover:text-black transition-colors" />
          <h3 className="text-2xl font-bold mb-4">Sequence</h3>
          <p className="text-gray-500">
            Build patterns with the 16-step sequencer. Layer kicks, snares, and percussion.
          </p>
        </Link>

        <Link href="/export" className="group p-12 hover:bg-gray-50 transition-colors">
          <Download className="w-10 h-10 mb-6 text-gray-400 group-hover:text-black transition-colors" />
          <h3 className="text-2xl font-bold mb-4">Export</h3>
          <p className="text-gray-500">
            Download your processed sounds individually or as a full kit. Ready for your DAW.
          </p>
        </Link>
      </section>

      <footer className="p-12 text-center text-gray-400 text-sm">
        © 2024 Breadcrumb Studio. All sounds reserved.
      </footer>
    </main>
  );
}

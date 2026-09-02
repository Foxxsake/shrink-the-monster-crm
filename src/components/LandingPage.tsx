import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers } from 'lucide-react';
import { MonsterMascot } from './MonsterMascot';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onLaunchDemo,
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between selection:bg-[#FF5722] selection:text-white">
      {/* Top Navbar */}
      <header className="px-6 py-5 max-w-6xl mx-auto w-full flex items-center justify-between border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF5722] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-[#FF5722]/30 font-heading">
            S
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-tight font-heading">
              Shrink the Monster
            </span>
            <span className="text-[10px] text-[#00FF9D] font-mono tracking-wider uppercase font-bold">
              Micro-CRM for Service Businesses
            </span>
          </div>
        </div>

        <button
          onClick={onLaunchDemo}
          className="text-xs font-black uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-800 hover:border-[#FF5722] px-4 py-2 rounded-xl transition bg-neutral-900"
        >
          Instant Demo
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-8 sm:py-16 text-center my-auto flex flex-col items-center">
        {/* Cute Mascot */}
        <div className="mb-6">
          <MonsterMascot size="lg" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>No bloated menus. No $100/mo user seats.</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white leading-[1.1] mb-6 max-w-3xl">
          Your software is <span className="text-[#FF5722]">too big.</span>
        </h1>

        {/* Promise */}
        <p className="text-base sm:text-xl text-neutral-300 font-medium max-w-2xl leading-relaxed mb-8">
          “Tell us what you actually need. We remove everything else.”
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mb-12">
          <button
            onClick={onStartOnboarding}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-[#FF5722] hover:brightness-110 text-white font-black uppercase tracking-wider text-sm px-6 py-4 rounded-2xl shadow-xl shadow-[#FF5722]/30 active:scale-95 transition"
          >
            <span>Shrink My Software</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>

          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#141417] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-bold uppercase tracking-wider text-xs px-5 py-4 rounded-2xl transition"
          >
            <span>Explore Demo</span>
          </button>
        </div>

        {/* 3 Step Explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full mt-4">
          <div className="bg-[#141417] border border-neutral-800 rounded-2xl p-5 shadow-md">
            <div className="w-8 h-8 rounded-xl bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center font-black mb-3 text-sm font-heading border border-[#FF5722]/30">
              1
            </div>
            <h3 className="font-black text-white text-sm font-heading mb-1">Pick Your Trade</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              Select cleaning, gardening, photography, trades, or custom.
            </p>
          </div>

          <div className="bg-[#141417] border border-neutral-800 rounded-2xl p-5 shadow-md">
            <div className="w-8 h-8 rounded-xl bg-[#00FF9D]/20 text-[#00FF9D] flex items-center justify-center font-black mb-3 text-sm font-heading border border-[#00FF9D]/30">
              2
            </div>
            <h3 className="font-black text-white text-sm font-heading mb-1">Choose Only Tools You Use</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              Customers, Jobs, Tasks, Notes, Follow-ups, or Payments.
            </p>
          </div>

          <div className="bg-[#141417] border border-neutral-800 rounded-2xl p-5 shadow-md">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black mb-3 text-sm font-heading border border-indigo-500/30">
              3
            </div>
            <h3 className="font-black text-white text-sm font-heading mb-1">Use Your Terms</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">
              Rename "Customers" to "Clients", "Jobs" to "Cleans", or whatever fits.
            </p>
          </div>
        </div>

        {/* Comparison Box */}
        <div className="mt-10 bg-[#141417] border border-neutral-800 rounded-2xl p-6 text-left max-w-2xl w-full shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
            <Layers className="w-5 h-5 text-[#00FF9D]" />
            <h4 className="font-black text-white text-sm font-heading uppercase tracking-wider">Why Small Businesses Choose Shrink</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl">
              <span className="font-black text-rose-400 uppercase tracking-wider block mb-2">❌ Typical Complex CRM</span>
              <ul className="text-neutral-400 space-y-1.5 font-medium">
                <li>• 120+ unused navigation links</li>
                <li>• Complex deal pipelines & automations</li>
                <li>• £80+/user/month pricing tiers</li>
                <li>• Requires training & setup consultants</li>
              </ul>
            </div>

            <div className="bg-[#00FF9D]/10 border border-[#00FF9D]/20 p-4 rounded-xl">
              <span className="font-black text-[#00FF9D] uppercase tracking-wider block mb-2">✓ Shrink the Monster</span>
              <ul className="text-neutral-200 space-y-1.5 font-medium">
                <li>• 4-6 essential tools you picked</li>
                <li>• Fast mobile PWA on your phone</li>
                <li>• Uses your exact wording</li>
                <li>• Works offline on site</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-neutral-500 border-t border-neutral-900 font-medium">
        <p>© 2026 Shrink the Monster — Built mobile-first for UK service businesses.</p>
      </footer>
    </div>
  );
};

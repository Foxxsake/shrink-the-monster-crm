import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Users,
  CheckSquare,
  FileText,
  Clock,
  Receipt,
  Wrench,
  Trees,
  Camera,
  Dog,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { BUSINESS_PRESETS, DEFAULT_MODULES } from '../data';
import { BusinessPreset, ModuleConfig, ModuleId, WorkspaceConfig } from '../types';
import { MonsterMascot } from './MonsterMascot';

interface OnboardingFlowProps {
  onComplete: (config: WorkspaceConfig) => void;
  onCancel: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedPreset, setSelectedPreset] = useState<BusinessPreset>(BUSINESS_PRESETS[0]);
  const [businessName, setBusinessName] = useState<string>('Bright & Clean Services');
  const [replacingSoftware, setReplacingSoftware] = useState<string>('HubSpot & Jobber');
  const [accentColor, setAccentColor] = useState<string>('#4f46e5');

  // Selected module config state
  const [modules, setModules] = useState<ModuleConfig[]>(() => {
    return DEFAULT_MODULES.map((mod) => ({
      ...mod,
      enabled: selectedPreset.recommendedModules.includes(mod.id),
      label: selectedPreset.moduleLabels[mod.id] || mod.defaultLabel,
    }));
  });

  // Handle Preset Change in Step 1
  const handleSelectPreset = (preset: BusinessPreset) => {
    setSelectedPreset(preset);
    setBusinessName(preset.sampleName);
    setReplacingSoftware(preset.defaultSoftware);
    setModules(
      DEFAULT_MODULES.map((mod) => ({
        ...mod,
        enabled: preset.recommendedModules.includes(mod.id),
        label: preset.moduleLabels[mod.id] || mod.defaultLabel,
      }))
    );
  };

  // Toggle module enabled/disabled
  const handleToggleModule = (moduleId: ModuleId) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, enabled: !m.enabled } : m))
    );
  };

  // Update custom module label
  const handleUpdateLabel = (moduleId: ModuleId, newLabel: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, label: newLabel } : m))
    );
  };

  // Complete Onboarding
  const handleFinish = () => {
    const finalConfig: WorkspaceConfig = {
      businessName: businessName.trim() || selectedPreset.sampleName,
      businessType: selectedPreset.name,
      replaceSoftware: replacingSoftware,
      accentColor,
      modules,
      isConfigured: true,
      createdAt: new Date().toISOString(),
    };
    onComplete(finalConfig);
  };

  const enabledCount = modules.filter((m) => m.enabled).length;
  const removedCount = 100 - enabledCount * 2; // Magic moment metric: e.g. 90 unnecessary features removed

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-[#FF5722] selection:text-white">
      {/* Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-4 border-b border-neutral-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF5722] flex items-center justify-center font-black text-sm text-white font-heading shadow-md shadow-[#FF5722]/30">
            S
          </div>
          <span className="font-black text-sm text-white font-heading">Shrink Engine Setup</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#00FF9D] font-mono font-bold tracking-wider uppercase">
          <span>Step {step} of 5</span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-2xl mx-auto w-full my-auto py-6">
        {/* Step 1: Business Type */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 1: Your Business
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 tracking-tight">
                What type of business do you run?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                We'll pre-select only the essential modules for your trade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUSINESS_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-2xl text-left border transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#FF5722]/15 border-[#FF5722] text-white ring-2 ring-[#FF5722]/50 shadow-md'
                        : 'bg-[#141417] border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FF5722] shrink-0 font-bold">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white font-heading">{preset.name}</h3>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">e.g. {preset.sampleName}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                Your Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#141417] border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                placeholder="e.g. Bright & Clean Services"
              />
            </div>
          </div>
        )}

        {/* Step 2: Existing Software Being Simplified */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 2: Simplify Software
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 tracking-tight">
                What software are you replacing or shrinking?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                This helps us estimate how many unnecessary menus we strip away.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                'HubSpot & Jobber',
                'Salesforce & ClickUp',
                'Zoho Books & Monday.com',
                'Squeegee & WhatsApp',
                'Excel Spreadsheets & Paper Notes',
                'Custom / Other Heavy CRM',
              ].map((sw) => (
                <button
                  key={sw}
                  onClick={() => setReplacingSoftware(sw)}
                  className={`w-full p-3.5 rounded-xl text-left border text-sm transition flex items-center justify-between ${
                    replacingSoftware === sw
                      ? 'bg-[#FF5722]/15 border-[#FF5722] text-white font-black'
                      : 'bg-[#141417] border-neutral-800 text-neutral-300 hover:bg-neutral-800 font-medium'
                  }`}
                >
                  <span>{sw}</span>
                  {replacingSoftware === sw && (
                    <CheckCircle2 className="w-5 h-5 text-[#00FF9D]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Essential Module Selection */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 3: Essential Tools
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 tracking-tight">
                Select only the tools you actually need
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                Unchecked modules are stripped completely from your workspace.
              </p>
            </div>

            <div className="space-y-3">
              {modules.map((mod) => {
                return (
                  <label
                    key={mod.id}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                      mod.enabled
                        ? 'bg-[#FF5722]/10 border-[#FF5722]/80 text-white shadow-md'
                        : 'bg-[#141417] border-neutral-800 text-neutral-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={mod.enabled}
                      onChange={() => handleToggleModule(mod.id)}
                      className="mt-1 w-5 h-5 rounded border-neutral-700 text-[#FF5722] focus:ring-[#FF5722] bg-neutral-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{mod.label}</span>
                        <span className="text-[10px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800 uppercase tracking-wider font-bold">
                          {mod.defaultLabel}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">{mod.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Custom Terminology / Module Naming */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 4: Your Terminology
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 tracking-tight">
                Rename modules using your own terminology
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                Speak your trade's language. Example: Clients, Cleans, Shoots, Invoices.
              </p>
            </div>

            <div className="space-y-3.5 bg-[#141417] p-4 rounded-2xl border border-neutral-800">
              {modules
                .filter((m) => m.enabled)
                .map((mod) => (
                  <div key={mod.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider sm:w-36 shrink-0">
                      {mod.defaultLabel} is called:
                    </label>
                    <input
                      type="text"
                      value={mod.label}
                      onChange={(e) => handleUpdateLabel(mod.id, e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                ))}
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Workspace Accent Color
              </label>
              <div className="flex gap-3">
                {[
                  { name: 'Orange Accent', color: '#FF5722' },
                  { name: 'Monster Green', color: '#00FF9D' },
                  { name: 'Indigo', color: '#4f46e5' },
                  { name: 'Rose', color: '#e11d48' },
                  { name: 'Cyan', color: '#0891b2' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setAccentColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-9 h-9 rounded-full transition transform hover:scale-110 flex items-center justify-center ${
                      accentColor === c.color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A] scale-110' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Magic Moment & Preview */}
        {step === 5 && (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <MonsterMascot size="md" shrunk={true} />

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] text-xs font-black uppercase tracking-wider border border-[#00FF9D]/30">
                ✨ Magic Moment Complete!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
                {removedCount} unnecessary features removed.
              </h2>
              <p className="text-sm text-neutral-300 font-medium max-w-lg mx-auto">
                We shrank <strong className="text-white">{replacingSoftware}</strong> down to a clean, mobile-first workspace tailored specifically for <strong className="text-[#FF5722]">{businessName}</strong>.
              </p>
            </div>

            <div className="bg-[#141417] border border-neutral-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 shadow-lg">
              <h4 className="text-xs font-black uppercase text-[#00FF9D] tracking-wider font-heading">
                Generated Workspace Modules
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {modules
                  .filter((m) => m.enabled)
                  .map((m) => (
                    <div key={m.id} className="flex items-center gap-2 text-neutral-200 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />
                      <span className="truncate">{m.label}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation Buttons */}
      <footer className="max-w-2xl mx-auto w-full flex items-center justify-between pt-4 border-t border-neutral-900">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="text-neutral-500 hover:text-neutral-300 text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
        )}

        {step < 5 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 bg-[#FF5722] hover:brightness-110 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-lg shadow-[#FF5722]/30"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 bg-[#00FF9D] hover:brightness-110 text-black text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-lg shadow-[#00FF9D]/30 animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Launch Workspace</span>
          </button>
        )}
      </footer>
    </div>
  );
};

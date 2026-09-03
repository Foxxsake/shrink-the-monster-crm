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
import { calculateClutterPercentage } from '../utils/onboarding';
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
  const [customBusinessType, setCustomBusinessType] = useState<string>('');
  
  const [replacingSoftware, setReplacingSoftware] = useState<string[]>(['HubSpot']);
  const [customReplacingSoftware, setCustomReplacingSoftware] = useState<string>('');
  
  const [unwantedTools, setUnwantedTools] = useState<string[]>([]);
  
  const [accentColor, setAccentColor] = useState<string>('#FF5722');

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
    
    // Parse preset default software to multi-select initial state
    const parsed = preset.defaultSoftware.split(' & ').map(s => s.trim());
    setReplacingSoftware(parsed);
    
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
    let finalSoftware = [...replacingSoftware];
    if (finalSoftware.includes('Other') && customReplacingSoftware.trim()) {
      finalSoftware = finalSoftware.filter(s => s !== 'Other');
      finalSoftware.push(customReplacingSoftware.trim());
    }

    const finalConfig: WorkspaceConfig = {
      businessName: businessName.trim() || selectedPreset.sampleName,
      businessType: selectedPreset.id === 'other' && customBusinessType.trim() ? customBusinessType.trim() : selectedPreset.name,
      replaceSoftware: finalSoftware,
      accentColor,
      modules,
      isConfigured: true,
      createdAt: new Date().toISOString(),
    };
    onComplete(finalConfig);
  };

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
          <span>Step {step} of 6</span>
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
                
                // Map string icon name to component
                let Icon = Briefcase;
                switch (preset.icon) {
                  case 'Sparkles': Icon = Sparkles; break;
                  case 'Trees': Icon = Trees; break;
                  case 'Sun': Icon = Sun; break;
                  case 'Camera': Icon = Camera; break;
                  case 'Dog': Icon = Dog; break;
                  case 'Wrench': Icon = Wrench; break;
                  case 'Users': Icon = Users; break;
                  default: Icon = Briefcase; break;
                }

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
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white font-heading">{preset.name}</h3>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">e.g. {preset.sampleName}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedPreset.id === 'other' && (
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Business Type
                </label>
                <input
                  type="text"
                  value={customBusinessType}
                  onChange={(e) => setCustomBusinessType(e.target.value)}
                  className="w-full bg-[#141417] border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  placeholder="e.g. Personal Trainer"
                />
              </div>
            )}

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
                Select all the tools you currently use. This helps us tailor your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'HubSpot',
                'Salesforce',
                'Zoho CRM',
                'Jobber',
                'ServiceM8',
                'Tradify',
                'Squeegee',
                'Monday.com',
                'ClickUp',
                'QuickBooks',
                'Xero',
                'Excel / Google Sheets',
                'WhatsApp / paper notes',
                'Other',
              ].map((sw) => {
                const isSelected = replacingSoftware.includes(sw);
                return (
                  <button
                    key={sw}
                    onClick={() => {
                      setReplacingSoftware(prev => 
                        prev.includes(sw) ? prev.filter(item => item !== sw) : [...prev, sw]
                      );
                    }}
                    className={`w-full p-3.5 rounded-xl text-left border text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FF5722]/15 border-[#FF5722] text-white font-black'
                        : 'bg-[#141417] border-neutral-800 text-neutral-300 hover:bg-neutral-800 font-medium'
                    }`}
                  >
                    <span>{sw}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#00FF9D]" />
                    )}
                  </button>
                );
              })}
            </div>

            {replacingSoftware.includes('Other') && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Other Software
                </label>
                <input
                  type="text"
                  value={customReplacingSoftware}
                  onChange={(e) => setCustomReplacingSoftware(e.target.value)}
                  className="w-full bg-[#141417] border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  placeholder="e.g. Custom CRM"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Unwanted Tools */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 3: Unwanted Clutter
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 tracking-tight">
                What do you currently ignore or wish you could remove?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                Select the heavy corporate features you never actually use.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Marketing campaigns',
                'Email automation',
                'Sales pipelines',
                'Lead scoring',
                'Social media tools',
                'Complex reports',
                'Forecasting',
                'Inventory',
                'HR tools',
                'Knowledge base',
                'Integrations',
                'AI assistant',
                'Advanced forms',
                'Timesheets',
                'Expenses',
                'Contracts',
                'Team chat',
                'Custom dashboards',
              ].map((tool) => {
                const isSelected = unwantedTools.includes(tool);
                return (
                  <button
                    key={tool}
                    onClick={() => {
                      setUnwantedTools(prev => 
                        prev.includes(tool) ? prev.filter(item => item !== tool) : [...prev, tool]
                      );
                    }}
                    className={`w-full p-2.5 rounded-xl text-left border text-xs sm:text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FF5722]/15 border-[#FF5722] text-white font-bold'
                        : 'bg-[#141417] border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <span>{tool}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#00FF9D] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Essential Module Selection */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 4: Essential Tools
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
                  <button
                    key={mod.id}
                    onClick={() => handleToggleModule(mod.id)}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border text-left transition ${
                      mod.enabled
                        ? 'bg-[#FF5722]/10 border-[#FF5722]/80 text-white shadow-md'
                        : 'bg-[#141417] border-neutral-800 text-neutral-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${mod.enabled ? 'bg-[#FF5722] border-[#FF5722]' : 'bg-neutral-900 border-neutral-700'}`}>
                      {mod.enabled && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{mod.label}</span>
                        <span className="text-[10px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800 uppercase tracking-wider font-bold">
                          {mod.defaultLabel}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">{mod.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm font-bold text-[#00FF9D]">
                {modules.filter(m => m.enabled).length} tools kept &middot; {unwantedTools.length} unwanted tools removed
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Custom Terminology / Module Naming */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
                Step 5: Your Terminology
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 tracking-tight">
                Rename modules using your own terminology
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                Speak your trade's language. Example: Clients, Cleans, Shoots, Invoices.
              </p>
            </div>

            <div className="space-y-4 bg-[#141417] p-4 rounded-2xl border border-neutral-800">
              {modules
                .filter((m) => m.enabled)
                .map((mod) => {
                  let suggestions: string[] = [];
                  switch(mod.id) {
                    case 'customers': suggestions = ['Customers', 'Clients', 'Members', 'Contacts', 'Pet Parents', 'Homeowners']; break;
                    case 'jobs': suggestions = ['Jobs', 'Visits', 'Appointments', 'Bookings', 'Projects', 'Callouts', 'Cleans', 'Sessions']; break;
                    case 'tasks': suggestions = ['Tasks', 'Checklists', 'Actions', 'To-dos']; break;
                    case 'followups': suggestions = ['Follow-ups', 'Reminders', 'Re-bookings', 'Callbacks']; break;
                    case 'payments': suggestions = ['Payments', 'Invoices', 'Collections', 'Balances']; break;
                  }

                  return (
                    <div key={mod.id} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                      {suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:ml-38">
                          {suggestions.map(sug => (
                            <button
                              key={sug}
                              onClick={() => handleUpdateLabel(mod.id, sug)}
                              className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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

        {/* Step 6: Magic Moment & Preview */}
        {step === 6 && (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <MonsterMascot size="lg" stage="shrinking" unwantedCount={unwantedTools.length} />

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00FF9D]/15 text-[#00FF9D] text-xs font-black uppercase tracking-wider border border-[#00FF9D]/30">
                ✨ Magic Moment Complete!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
                {unwantedTools.length === 0 ? `Your workspace contains only the ${modules.filter(m => m.enabled).length} tools you selected.` : `${unwantedTools.length} unwanted tools removed from your workspace`}
              </h2>
              <p className="text-sm text-neutral-300 font-medium max-w-lg mx-auto">
                {unwantedTools.length > 0 && (
                  <span className="block mb-2 font-bold text-lg text-[#FF5722]">
                    Your workspace is {calculateClutterPercentage(unwantedTools.length, modules.filter(m => m.enabled).length)}% smaller based on your choices.
                  </span>
                )}
                We shrank <strong className="text-white">{replacingSoftware.join(', ')}</strong> down to a clean, mobile-first workspace tailored specifically for <strong className="text-[#FF5722]">{businessName}</strong>.
              </p>
            </div>
            
            {unwantedTools.length > 0 && (
              <details className="bg-[#141417] border border-neutral-800 rounded-xl p-3 text-left max-w-md mx-auto shadow-lg cursor-pointer marker:text-[#FF5722]">
                <summary className="text-xs font-bold uppercase text-neutral-400 tracking-wider focus:outline-none">
                  What disappeared? ({unwantedTools.length})
                </summary>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-500">
                  {unwantedTools.map(t => (
                    <li key={t} className="line-through decoration-[#FF5722]/50">{t}</li>
                  ))}
                </ul>
              </details>
            )}

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

        {step < 6 ? (
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

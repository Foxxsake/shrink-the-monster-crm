import React, { useState } from 'react';
import { Settings, RefreshCw, Trash2, Sparkles, Shield, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { ModuleId, WorkspaceConfig } from '../../types';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface SettingsViewProps {
  config: WorkspaceConfig;
  onUpdateConfig: (config: WorkspaceConfig) => void;
  onResetWorkspace: () => void;
  onReRunOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  onResetWorkspace,
  onReRunOnboarding,
}) => {
  const isOnline = useOnlineStatus();
  const [businessName, setBusinessName] = useState(config.businessName);
  const [accentColor, setAccentColor] = useState(config.accentColor || '#4f46e5');
  const [modules, setModules] = useState(config.modules);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleModule = (id: ModuleId) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleUpdateLabel = (id: ModuleId, newLabel: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, label: newLabel } : m))
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      businessName: businessName.trim() || 'My Business',
      accentColor,
      modules,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">Workspace Settings</h2>
        <p className="text-xs text-neutral-400 font-medium">
          Customize your business name, accent color, active modules, and terminology.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00FF9D]" />
          <span>Settings saved to local storage!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Business Info Section */}
        <div className="bg-[#141417] rounded-2xl border border-neutral-800 p-5 shadow-md space-y-4">
          <h3 className="font-black text-white text-sm font-heading border-b border-neutral-800 pb-2">
            Business & Visual Style
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Accent Color</label>
            <div className="flex gap-3">
              {[
                { name: 'Orange Accent', color: '#FF5722' },
                { name: 'Monster Green', color: '#00FF9D' },
                { name: 'Indigo', color: '#4f46e5' },
                { name: 'Rose', color: '#e11d48' },
                { name: 'Cyan', color: '#0891b2' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.color}
                  onClick={() => setAccentColor(c.color)}
                  style={{ backgroundColor: c.color }}
                  className={`w-9 h-9 rounded-full transition transform hover:scale-105 flex items-center justify-center ${
                    accentColor === c.color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141417] scale-105' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enabled Modules & Custom Terminology */}
        <div className="bg-[#141417] rounded-2xl border border-neutral-800 p-5 shadow-md space-y-4">
          <h3 className="font-black text-white text-sm font-heading border-b border-neutral-800 pb-2">
            Enabled Modules & Naming
          </h3>

          <div className="space-y-3">
            {modules.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={m.enabled}
                    onChange={() => handleToggleModule(m.id)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#FF5722] focus:ring-[#FF5722]"
                  />
                  <div>
                    <span className="text-xs font-black text-white">{m.defaultLabel}</span>
                    <p className="text-[11px] text-neutral-400 font-medium">{m.description}</p>
                  </div>
                </div>

                {m.enabled && (
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <span className="text-xs text-neutral-400 font-medium shrink-0">Display Label:</span>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => handleUpdateLabel(m.id, e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722] max-w-[130px]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Settings CTA */}
        <button
          type="submit"
          style={{ backgroundColor: accentColor || '#FF5722' }}
          className="w-full py-3 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition"
        >
          Save Workspace Preferences
        </button>
      </form>

      {/* Advanced / System Status */}
      <div className="bg-[#141417] rounded-2xl border border-neutral-800 p-5 shadow-md space-y-4">
        <h3 className="font-black text-white text-sm font-heading border-b border-neutral-800 pb-2">
          System & Storage Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">Network Connection:</span>
            <span className={`font-bold flex items-center gap-1 ${isOnline ? 'text-[#00FF9D]' : 'text-amber-400'}`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400">Storage Engine:</span>
            <span className="font-bold text-white">Local Browser Storage</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onReRunOnboarding}
            className="flex-1 py-2.5 bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722] font-black uppercase tracking-wider text-xs rounded-xl hover:bg-[#FF5722]/20 transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Re-run Shrink Engine Setup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset workspace to default demo data?')) {
                onResetWorkspace();
              }
            }}
            className="flex-1 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-black uppercase tracking-wider text-xs rounded-xl hover:bg-rose-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Workspace Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

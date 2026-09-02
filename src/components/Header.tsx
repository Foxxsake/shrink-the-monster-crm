import React, { useState } from 'react';
import { Plus, Settings, Download, WifiOff } from 'lucide-react';
import { WorkspaceConfig, ViewTab } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  config: WorkspaceConfig;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenQuickAdd: () => void;
  onResetWorkspace?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  activeTab,
  setActiveTab,
  onOpenQuickAdd,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#121214]/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 sm:px-6">
      {!isOnline && (
        <div className="mb-2 -mx-4 -mt-3 px-4 py-1.5 bg-[#FF5722] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Offline Mode — Saved locally on device</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: App Brand & Business Name */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 text-left group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md transition-transform group-hover:scale-105 shrink-0 border border-white/20"
              style={{ backgroundColor: config.accentColor || '#FF5722' }}
            >
              S
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-white text-base sm:text-lg leading-tight truncate tracking-tight font-heading">
                {config.businessName || 'My Business'}
              </h1>
              <p className="text-[11px] font-semibold text-[#00FF9D] uppercase tracking-wider truncate hidden sm:block">
                Powered by Shrink Engine
              </p>
            </div>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            style={{ backgroundColor: config.accentColor || '#FF5722' }}
            className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition tracking-wide uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden xs:inline">Quick Add</span>
          </button>

          {/* PWA Install Actions (hidden when running standalone) */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition"
              title="Install App to Home Screen"
            >
              <Download className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span className="hidden xs:inline">Install</span>
            </button>
          )}

          {!isInstalled && isIOS && !isInstallable && (
            <button
              onClick={() => setShowIOSPrompt(true)}
              className="flex items-center gap-1.5 text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition"
              title="Install on iPhone / iPad"
            >
              <Download className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span className="hidden xs:inline">Install iOS</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 sm:p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 border transition ${
              activeTab === 'settings' ? 'bg-neutral-800 text-[#FF5722] border-[#FF5722]/50' : 'border-transparent'
            }`}
            title="Workspace Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* iOS Install Prompt Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18181B] border border-neutral-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white mb-2 font-heading">Install on iPhone / iPad</h3>
            <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
              1. Tap the <strong className="text-white">Share</strong> icon in Safari.<br />
              2. Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSPrompt(false)}
              className="w-full py-2.5 bg-[#FF5722] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

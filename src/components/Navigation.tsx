import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  FileText,
  Clock,
  Receipt,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ModuleConfig, ViewTab, WorkspaceConfig } from '../types';

interface NavigationProps {
  config: WorkspaceConfig;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onOpenOnboarding: () => void;
}

export const getModuleIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName.toLowerCase()) {
    case 'users':
      return <Users className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'checksquare':
      return <CheckSquare className={className} />;
    case 'filetext':
      return <FileText className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'receipt':
      return <Receipt className={className} />;
    default:
      return <Briefcase className={className} />;
  }
};

export const Navigation: React.FC<NavigationProps> = ({
  config,
  activeTab,
  setActiveTab,
  onOpenOnboarding,
}) => {
  const enabledModules = config.modules.filter((m) => m.enabled);

  return (
    <>
      {/* Desktop Sidebar (md:flex) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#121214] border-r border-neutral-800 min-h-[calc(100vh-65px)] p-4 shrink-0">
        <div className="space-y-1.5">
          {/* Dashboard Item */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition border ${
              activeTab === 'dashboard'
                ? 'bg-neutral-800 text-white border-[#FF5722]'
                : 'text-neutral-400 border-transparent hover:bg-neutral-800/60 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 shrink-0 ${activeTab === 'dashboard' ? 'text-[#FF5722]' : ''}`} />
            <span>Dashboard</span>
          </button>

          {/* Enabled Modules */}
          {enabledModules.map((module: ModuleConfig) => {
            const isActive = activeTab === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition border ${
                  isActive
                    ? 'bg-neutral-800 text-white border-[#FF5722]'
                    : 'text-neutral-400 border-transparent hover:bg-neutral-800/60 hover:text-white'
                }`}
              >
                {getModuleIcon(module.iconName, `w-5 h-5 shrink-0 ${isActive ? 'text-[#FF5722]' : ''}`)}
                <span className="truncate">{module.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider & Settings / Shrink Engine CTA */}
        <div className="mt-auto pt-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition border ${
              activeTab === 'settings'
                ? 'bg-neutral-800 text-white border-[#FF5722]'
                : 'text-neutral-400 border-transparent hover:bg-neutral-800/60 hover:text-white'
            }`}
          >
            <Settings className={`w-5 h-5 shrink-0 ${activeTab === 'settings' ? 'text-[#FF5722]' : ''}`} />
            <span>Settings</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-[#00FF9D] bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 transition border border-[#00FF9D]/30 mt-2 uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 shrink-0 text-[#00FF9D]" />
            <span>Re-run Shrink Engine</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121214]/95 backdrop-blur-md border-t border-neutral-800 px-2 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Dashboard Icon */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition ${
              activeTab === 'dashboard' ? 'text-[#FF5722] font-extrabold' : 'text-neutral-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight truncate max-w-[56px]">Overview</span>
          </button>

          {/* Enabled Modules (Max 4 displayed on mobile bar, rest accessible via Settings/More) */}
          {enabledModules.slice(0, 4).map((module) => {
            const isActive = activeTab === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition ${
                  isActive ? 'text-[#FF5722] font-extrabold' : 'text-neutral-400'
                }`}
              >
                {getModuleIcon(module.iconName, 'w-5 h-5 mb-0.5')}
                <span className="text-[10px] uppercase font-bold tracking-wider leading-tight truncate max-w-[56px]">{module.label}</span>
              </button>
            );
          })}

          {/* Settings Tab / Overflow */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-xl transition ${
              activeTab === 'settings' ? 'text-[#FF5722] font-extrabold' : 'text-neutral-400'
            }`}
          >
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-tight truncate max-w-[56px]">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
};

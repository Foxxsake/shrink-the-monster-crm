import React from 'react';
import {
  Users,
  Briefcase,
  CheckSquare,
  Clock,
  Receipt,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Customer, FollowUp, Job, ModuleId, Payment, Task, ViewTab, WorkspaceConfig } from '../../types';
import { calculateDashboardMetrics } from '../../utils/metrics';

interface DashboardViewProps {
  config: WorkspaceConfig;
  customers: Customer[];
  jobs: Job[];
  tasks: Task[];
  followUps: FollowUp[];
  payments: Payment[];
  setActiveTab: (tab: ViewTab) => void;
  onOpenQuickAdd: () => void;
  onToggleFollowUp: (id: string) => void;
  onToggleTask: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  config,
  customers,
  jobs,
  tasks,
  followUps,
  payments,
  setActiveTab,
  onOpenQuickAdd,
  onToggleFollowUp,
  onToggleTask,
}) => {
  const getLabel = (id: ModuleId, fallback: string) => {
    const mod = config.modules.find((m) => m.id === id);
    return mod?.enabled ? mod.label : fallback;
  };

  const isModuleEnabled = (id: ModuleId) => {
    return config.modules.find((m) => m.id === id)?.enabled ?? false;
  };

  // Metrics calculations
  const metrics = calculateDashboardMetrics(customers, jobs, tasks, followUps, payments);
  const activeCustomers = metrics.activeCustomersCount;
  const pendingJobs = jobs.filter((j) => j.status === 'scheduled' || j.status === 'in_progress');
  const pendingFollowUps = followUps.filter((f) => !f.completed);
  const unpaidPayments = payments.filter((p) => p.status === 'pending' || p.status === 'overdue');
  const totalOutstanding = metrics.totalOutstandingAmount;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-white/10"
        style={{
          background: `linear-gradient(135deg, ${config.accentColor || '#FF5722'} 0%, #18181B 100%)`,
        }}
      >
        <div>
          <span className="inline-block px-3 py-1 rounded-lg bg-black/40 text-[11px] font-black uppercase tracking-widest text-[#00FF9D] mb-3 border border-[#00FF9D]/30">
            Workspace Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Welcome back to {config.businessName}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-1.5 max-w-xl leading-relaxed">
            Your tailored mobile workspace has <strong className="text-white font-bold">{config.modules.filter((m) => m.enabled).length} active modules</strong> enabled.
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="w-full sm:w-auto bg-white text-black font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:bg-neutral-100 active:scale-95 transition flex items-center justify-center gap-2 shrink-0 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-[#FF5722] stroke-[3]" />
          <span>Quick Add Item</span>
        </button>
      </div>

      {/* Dynamic Summary Cards (Only for Enabled Modules) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {isModuleEnabled('customers') && (
          <button
            onClick={() => setActiveTab('customers')}
            className="bg-[#141417] p-4 sm:p-5 rounded-2xl border border-neutral-800 shadow-md hover:border-[#FF5722]/60 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">
                {getLabel('customers', 'Customers')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#00FF9D] flex items-center justify-center group-hover:scale-110 transition border border-neutral-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-heading">{activeCustomers}</div>
            <span className="text-[10px] text-[#00FF9D] font-extrabold uppercase tracking-wider">Active accounts</span>
          </button>
        )}

        {isModuleEnabled('jobs') && (
          <button
            onClick={() => setActiveTab('jobs')}
            className="bg-[#141417] p-4 sm:p-5 rounded-2xl border border-neutral-800 shadow-md hover:border-[#FF5722]/60 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">
                {getLabel('jobs', 'Jobs')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#00FF9D] flex items-center justify-center group-hover:scale-110 transition border border-neutral-700">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-heading">{pendingJobs.length}</div>
            <span className="text-[10px] text-[#00FF9D] font-extrabold uppercase tracking-wider">Scheduled visits</span>
          </button>
        )}

        {isModuleEnabled('followups') && (
          <button
            onClick={() => setActiveTab('followups')}
            className="bg-[#141417] p-4 sm:p-5 rounded-2xl border border-neutral-800 shadow-md hover:border-[#FF5722]/60 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">
                {getLabel('followups', 'Follow-ups')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#FF5722] flex items-center justify-center group-hover:scale-110 transition border border-neutral-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-heading">{pendingFollowUps.length}</div>
            <span className="text-[10px] text-[#FF5722] font-extrabold uppercase tracking-wider">Action items due</span>
          </button>
        )}

        {isModuleEnabled('payments') && (
          <button
            onClick={() => setActiveTab('payments')}
            className="bg-[#141417] p-4 sm:p-5 rounded-2xl border border-neutral-800 shadow-md hover:border-[#FF5722]/60 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">
                {getLabel('payments', 'Payments')}
              </span>
              <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#FF5722] flex items-center justify-center group-hover:scale-110 transition border border-neutral-700">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-heading font-mono-num">£{totalOutstanding}</div>
            <span className="text-[10px] text-[#FF5722] font-extrabold uppercase tracking-wider">{unpaidPayments.length} outstanding</span>
          </button>
        )}
      </div>

      {/* Main Grid: Scheduled Jobs & Pending Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Follow-ups Section */}
        {isModuleEnabled('followups') && (
          <div className="bg-[#141417] rounded-2xl border border-neutral-800 p-5 sm:p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#FF5722] flex items-center justify-center border border-neutral-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-white text-base font-heading">
                    Pending {getLabel('followups', 'Follow-ups')}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('followups')}
                  className="text-xs font-extrabold text-[#00FF9D] hover:underline flex items-center gap-1 group uppercase tracking-wider"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {pendingFollowUps.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs bg-neutral-900/50 rounded-xl border border-dashed border-neutral-800">
                  No pending follow-ups! All caught up.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingFollowUps.slice(0, 4).map((fol) => {
                    const cust = customers.find((c) => c.id === fol.customerId);
                    return (
                      <div
                        key={fol.id}
                        className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-between gap-3 hover:border-neutral-700 transition"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-white truncate">
                            {fol.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                            <span className="font-bold text-neutral-200">{cust?.name || 'Client'}</span>
                            <span>•</span>
                            <span>Due: {fol.dueDate}</span>
                          </div>
                        </div>

                        {/* Interactive Done Button */}
                        <button
                          onClick={() => onToggleFollowUp(fol.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#00FF9D] text-black font-black text-[11px] hover:brightness-110 active:scale-95 transition shrink-0 flex items-center gap-1 shadow-md uppercase tracking-wider"
                          title="Mark Done"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Done</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scheduled Jobs Section */}
        {isModuleEnabled('jobs') && (
          <div className="bg-[#141417] rounded-2xl border border-neutral-800 p-5 sm:p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#00FF9D] flex items-center justify-center border border-neutral-700">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-white text-base font-heading">
                    Upcoming {getLabel('jobs', 'Jobs')}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-extrabold text-[#00FF9D] hover:underline flex items-center gap-1 group uppercase tracking-wider"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {pendingJobs.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs bg-neutral-900/50 rounded-xl border border-dashed border-neutral-800">
                  No upcoming jobs scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingJobs.slice(0, 4).map((job) => {
                    const cust = customers.find((c) => c.id === job.customerId);
                    return (
                      <div
                        key={job.id}
                        className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-between gap-3 hover:border-neutral-700 transition"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-white truncate">
                            {job.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            {cust?.name || 'Client'} • {job.date}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-white block font-mono-num">
                            £{job.amount || 0}
                          </span>
                          <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30">
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Outstanding Payments Section */}
      {isModuleEnabled('payments') && unpaidPayments.length > 0 && (
        <div className="bg-[#141417] rounded-2xl border border-neutral-800 p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-800 text-[#FF5722] flex items-center justify-center border border-neutral-700">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="font-black text-white text-base font-heading">
                Outstanding {getLabel('payments', 'Payments')}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-extrabold text-[#00FF9D] hover:underline flex items-center gap-1 group uppercase tracking-wider"
            >
              <span>Manage Invoices</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unpaidPayments.slice(0, 4).map((pay) => {
              const cust = customers.find((c) => c.id === pay.customerId);
              return (
                <div
                  key={pay.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-neutral-500 block font-bold">
                      {pay.invoiceNumber}
                    </span>
                    <h4 className="text-xs font-black text-white truncate mt-0.5">
                      {cust?.name || 'Client'}
                    </h4>
                    <span className="text-[11px] text-neutral-400">Due: {pay.dueDate}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-white block font-mono-num">
                      £{pay.amount}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                        pay.status === 'overdue'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

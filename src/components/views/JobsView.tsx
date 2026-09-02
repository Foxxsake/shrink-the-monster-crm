import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Calendar,
  DollarSign,
  User,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Customer, Job, WorkspaceConfig } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface JobsViewProps {
  config: WorkspaceConfig;
  jobs: Job[];
  customers: Customer[];
  onAddJob: (job: Job) => void;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  config,
  jobs,
  customers,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
}) => {
  const customLabel = config.modules.find((m) => m.id === 'jobs')?.label || 'Jobs';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    customerId: customers[0]?.id || '',
    status: 'scheduled' as Job['status'],
    date: new Date().toISOString().split('T')[0],
    amount: '150',
    notes: '',
  });

  const filteredJobs = jobs.filter((job) => {
    const cust = customers.find((c) => c.id === job.customerId);
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust && cust.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      customerId: customers[0]?.id || '',
      status: 'scheduled',
      date: new Date().toISOString().split('T')[0],
      amount: '150',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      customerId: job.customerId,
      status: job.status,
      date: job.date,
      amount: (job.amount || 0).toString(),
      notes: job.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingJob) {
      onUpdateJob({
        ...editingJob,
        title: formData.title.trim(),
        customerId: formData.customerId,
        status: formData.status,
        date: formData.date,
        amount: parseFloat(formData.amount) || 0,
        notes: formData.notes.trim(),
      });
    } else {
      onAddJob({
        id: `job-${Date.now()}`,
        title: formData.title.trim(),
        customerId: formData.customerId,
        status: formData.status,
        date: formData.date,
        amount: parseFloat(formData.amount) || 0,
        notes: formData.notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickCycleStatus = (job: Job) => {
    const nextStatus: Record<Job['status'], Job['status']> = {
      scheduled: 'in_progress',
      in_progress: 'completed',
      completed: 'scheduled',
      cancelled: 'scheduled',
    };
    onUpdateJob({ ...job, status: nextStatus[job.status] });
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">{customLabel}</h2>
          <p className="text-xs text-neutral-400 font-medium">{jobs.length} total visits/jobs scheduled</p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{ backgroundColor: config.accentColor || '#FF5722' }}
          className="text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shrink-0 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New {customLabel.slice(0, -1)}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-[#141417] p-3 rounded-2xl border border-neutral-800 shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${customLabel.toLowerCase()} by title or client...`}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-neutral-900 border border-neutral-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shrink-0"
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="py-12 text-center bg-[#141417] rounded-2xl border border-neutral-800 text-neutral-500 text-xs font-medium">
            No {customLabel.toLowerCase()} match your filter.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const cust = customers.find((c) => c.id === job.customerId);

            return (
              <div
                key={job.id}
                className="bg-[#141417] rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-md hover:border-neutral-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-white text-sm sm:text-base font-heading">{job.title}</h3>
                    <button
                      onClick={() => handleQuickCycleStatus(job)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition border ${
                        job.status === 'completed'
                          ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/30'
                          : job.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30'
                      }`}
                    >
                      {job.status.replace('_', ' ')}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                    <span className="flex items-center gap-1 font-bold text-neutral-200">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{cust?.name || 'Client'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{job.date}</span>
                    </span>
                  </div>

                  {job.notes && (
                    <p className="text-xs text-neutral-300 mt-2 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 font-medium">
                      {job.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <span className="text-base font-black text-white font-mono-num">
                    £{job.amount || 0}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(job.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] rounded-2xl w-full max-w-md shadow-2xl border border-neutral-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#121214]">
              <h3 className="font-black text-white text-base font-heading">
                {editingJob ? `Edit ${customLabel.slice(0, -1)}` : `Add ${customLabel.slice(0, -1)}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Garden Maintenance Visit"
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Client *</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Amount (£)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#FF5722] hover:brightness-110 rounded-xl shadow-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        title={`Delete ${customLabel.slice(0, -1)}?`}
        message="Are you sure you want to remove this job record?"
        onConfirm={() => {
          if (deletingId) {
            onDeleteJob(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

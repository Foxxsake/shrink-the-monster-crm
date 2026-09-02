import React, { useState } from 'react';
import { Clock, Plus, CheckCircle2, Phone, Mail, Users, Edit2, Trash2, X } from 'lucide-react';
import { Customer, FollowUp, WorkspaceConfig } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface FollowUpsViewProps {
  config: WorkspaceConfig;
  followUps: FollowUp[];
  customers: Customer[];
  onAddFollowUp: (followUp: FollowUp) => void;
  onUpdateFollowUp: (followUp: FollowUp) => void;
  onDeleteFollowUp: (id: string) => void;
  onToggleFollowUp: (id: string) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  config,
  followUps,
  customers,
  onAddFollowUp,
  onUpdateFollowUp,
  onDeleteFollowUp,
  onToggleFollowUp,
}) => {
  const customLabel = config.modules.find((m) => m.id === 'followups')?.label || 'Follow-ups';

  const [filter, setFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    customerId: customers[0]?.id || '',
    dueDate: new Date().toISOString().split('T')[0],
    channel: 'phone' as FollowUp['channel'],
    notes: '',
  });

  const filteredFollowUps = followUps.filter((f) => {
    if (filter === 'pending') return !f.completed;
    if (filter === 'completed') return f.completed;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingFollowUp(null);
    setFormData({
      title: '',
      customerId: customers[0]?.id || '',
      dueDate: new Date().toISOString().split('T')[0],
      channel: 'phone',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fol: FollowUp) => {
    setEditingFollowUp(fol);
    setFormData({
      title: fol.title,
      customerId: fol.customerId,
      dueDate: fol.dueDate,
      channel: fol.channel || 'phone',
      notes: fol.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingFollowUp) {
      onUpdateFollowUp({
        ...editingFollowUp,
        title: formData.title.trim(),
        customerId: formData.customerId,
        dueDate: formData.dueDate,
        channel: formData.channel,
        notes: formData.notes.trim(),
      });
    } else {
      onAddFollowUp({
        id: `fol-${Date.now()}`,
        title: formData.title.trim(),
        customerId: formData.customerId,
        dueDate: formData.dueDate,
        completed: false,
        channel: formData.channel,
        notes: formData.notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">{customLabel}</h2>
          <p className="text-xs text-neutral-400 font-medium">
            {followUps.filter((f) => !f.completed).length} pending re-bookings and follow-ups
          </p>
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

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-[#141417] border border-neutral-800 rounded-xl max-w-md">
        {(['pending', 'completed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
              filter === f ? 'bg-[#FF5722] text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredFollowUps.length === 0 ? (
          <div className="py-12 text-center bg-[#141417] rounded-2xl border border-neutral-800 text-neutral-500 text-xs font-medium">
            No {customLabel.toLowerCase()} found.
          </div>
        ) : (
          filteredFollowUps.map((fol) => {
            const cust = customers.find((c) => c.id === fol.customerId);

            return (
              <div
                key={fol.id}
                className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  fol.completed
                    ? 'bg-neutral-900/50 border-neutral-800/60 opacity-60'
                    : 'bg-[#141417] border-neutral-800 shadow-md hover:border-neutral-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-black text-sm sm:text-base font-heading ${
                        fol.completed ? 'line-through text-neutral-500' : 'text-white'
                      }`}
                    >
                      {fol.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {fol.channel || 'phone'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 font-medium">
                    <strong className="text-white">{cust?.name || 'Client'}</strong> • Due: {fol.dueDate}
                  </p>

                  {fol.notes && (
                    <p className="text-xs text-neutral-300 mt-2 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 font-medium">
                      {fol.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <button
                    onClick={() => onToggleFollowUp(fol.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-md ${
                      fol.completed
                        ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        : 'bg-[#00FF9D] text-black hover:brightness-110 active:scale-95'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>{fol.completed ? 'Done' : 'Mark Done'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(fol)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(fol.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
                {editingFollowUp ? 'Edit Follow-up' : 'Add Follow-up'}
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
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Action Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Confirm quote with Sarah"
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
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">In Person / Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
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

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        title="Delete Follow-up?"
        message="Are you sure you want to delete this item?"
        onConfirm={() => {
          if (deletingId) {
            onDeleteFollowUp(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

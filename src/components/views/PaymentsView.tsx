import React, { useState } from 'react';
import { Receipt, Search, Plus, DollarSign, Calendar, User, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Customer, Payment, WorkspaceConfig } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface PaymentsViewProps {
  config: WorkspaceConfig;
  payments: Payment[];
  customers: Customer[];
  onAddPayment: (payment: Payment) => void;
  onUpdatePayment: (payment: Payment) => void;
  onDeletePayment: (id: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  config,
  payments,
  customers,
  onAddPayment,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const customLabel = config.modules.find((m) => m.id === 'payments')?.label || 'Payments';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    amount: '150',
    status: 'pending' as Payment['status'],
    dueDate: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
  });

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((a, b) => a + b.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((a, b) => a + b.amount, 0);

  const filteredPayments = payments.filter((pay) => {
    const cust = customers.find((c) => c.id === pay.customerId);
    const matchesSearch =
      pay.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust && cust.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || pay.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingPayment(null);
    setFormData({
      customerId: customers[0]?.id || '',
      amount: '150',
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pay: Payment) => {
    setEditingPayment(pay);
    setFormData({
      customerId: pay.customerId,
      amount: pay.amount.toString(),
      status: pay.status,
      dueDate: pay.dueDate,
      invoiceNumber: pay.invoiceNumber,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) return;

    if (editingPayment) {
      onUpdatePayment({
        ...editingPayment,
        customerId: formData.customerId,
        amount: parseFloat(formData.amount) || 0,
        status: formData.status,
        dueDate: formData.dueDate,
        invoiceNumber: formData.invoiceNumber,
        paidDate: formData.status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
      });
    } else {
      onAddPayment({
        id: `pay-${Date.now()}`,
        customerId: formData.customerId,
        amount: parseFloat(formData.amount) || 0,
        status: formData.status,
        dueDate: formData.dueDate,
        invoiceNumber: formData.invoiceNumber,
        paidDate: formData.status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickCycleStatus = (pay: Payment) => {
    const nextStatus: Record<Payment['status'], Payment['status']> = {
      pending: 'paid',
      paid: 'overdue',
      overdue: 'pending',
    };
    const newStatus = nextStatus[pay.status];
    onUpdatePayment({
      ...pay,
      status: newStatus,
      paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">{customLabel}</h2>
          <p className="text-xs text-neutral-400 font-medium">Track invoices, collections, and paid balances</p>
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

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141417] border border-neutral-800 p-3.5 sm:p-4 rounded-2xl shadow-md">
          <span className="text-[10px] font-black uppercase text-[#00FF9D] tracking-wider block">Total Received</span>
          <span className="text-lg sm:text-2xl font-black font-heading text-white mt-1 block">£{totalPaid}</span>
        </div>

        <div className="bg-[#141417] border border-neutral-800 p-3.5 sm:p-4 rounded-2xl shadow-md">
          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">Pending</span>
          <span className="text-lg sm:text-2xl font-black font-heading text-white mt-1 block">£{totalPending}</span>
        </div>

        <div className="bg-[#141417] border border-neutral-800 p-3.5 sm:p-4 rounded-2xl shadow-md">
          <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider block">Overdue</span>
          <span className="text-lg sm:text-2xl font-black font-heading text-white mt-1 block">£{totalOverdue}</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-[#141417] p-3 rounded-2xl border border-neutral-800 shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${customLabel.toLowerCase()} by invoice number or client...`}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-neutral-900 border border-neutral-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shrink-0"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="py-12 text-center bg-[#141417] rounded-2xl border border-neutral-800 text-neutral-500 text-xs font-medium">
            No payments found.
          </div>
        ) : (
          filteredPayments.map((pay) => {
            const cust = customers.find((c) => c.id === pay.customerId);

            return (
              <div
                key={pay.id}
                className="bg-[#141417] rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-md hover:border-neutral-700 transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded">
                      {pay.invoiceNumber}
                    </span>
                    <h3 className="font-black text-white text-sm sm:text-base font-heading truncate">
                      {cust?.name || 'Client'}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-400 font-medium">
                    Due: {pay.dueDate} {pay.paidDate && `• Paid on ${pay.paidDate}`}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black font-heading text-white block">
                      £{pay.amount}
                    </span>
                    <button
                      onClick={() => handleQuickCycleStatus(pay)}
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider transition border ${
                        pay.status === 'paid'
                          ? 'bg-[#00FF9D]/10 text-[#00FF9D] border-[#00FF9D]/30'
                          : pay.status === 'overdue'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                      title="Click to cycle status"
                    >
                      {pay.status}
                    </button>
                  </div>

                  <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
                    <button
                      onClick={() => handleOpenEdit(pay)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(pay.id)}
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
                {editingPayment ? 'Edit Payment' : 'Add Payment Record'}
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
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722] font-mono"
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
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Amount (£) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        title="Delete Payment Record?"
        message="Are you sure you want to delete this payment?"
        onConfirm={() => {
          if (deletingId) {
            onDeletePayment(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Building,
  Tag,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  Briefcase,
  Clock,
  FileText,
} from 'lucide-react';
import { Customer, FollowUp, Job, Note, Payment, WorkspaceConfig } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface CustomersViewProps {
  config: WorkspaceConfig;
  customers: Customer[];
  jobs: Job[];
  notes: Note[];
  followUps: FollowUp[];
  payments: Payment[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  config,
  customers,
  jobs,
  notes,
  followUps,
  payments,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const customLabel = config.modules.find((m) => m.id === 'customers')?.label || 'Customers';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'lead' | 'inactive'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Detail View State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    status: 'active' | 'lead' | 'inactive';
    tags: string;
    notes: string;
  }>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'active',
    tags: '',
    notes: '',
  });

  // Filtered List
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'active',
      tags: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      company: customer.company || '',
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      tags: customer.tags ? customer.tags.join(', ') : '',
      notes: customer.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedTags = formData.tags
      ? formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        tags: parsedTags,
        notes: formData.notes.trim(),
      });
    } else {
      onAddCustomer({
        id: `cust-${Date.now()}`,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        tags: parsedTags,
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString().split('T')[0],
      });
    }

    setIsModalOpen(false);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">{customLabel}</h2>
          <p className="text-xs text-neutral-400 font-medium">
            {customers.length} total client records in local workspace
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

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-[#141417] p-3 rounded-2xl border border-neutral-800 shadow-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${customLabel.toLowerCase()} by name, phone, email...`}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>

        {/* Real Status Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          >
            <option value="all">All Statuses ({customers.length})</option>
            <option value="active">Active</option>
            <option value="lead">Leads</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#141417] rounded-2xl border border-neutral-800 text-neutral-500 text-xs font-medium">
            No {customLabel.toLowerCase()} match your search filter.
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const custJobs = jobs.filter((j) => j.customerId === cust.id);
            const custNotes = notes.filter((n) => n.customerId === cust.id);

            return (
              <div
                key={cust.id}
                className="bg-[#141417] rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-md hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-black text-white text-sm sm:text-base font-heading">{cust.name}</h3>
                      {cust.company && (
                        <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5 font-medium">
                          <Building className="w-3 h-3 text-neutral-500" />
                          <span>{cust.company}</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        cust.status === 'active'
                          ? 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/30'
                          : cust.status === 'lead'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-neutral-300 mb-3 font-medium">
                    {cust.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <a href={`tel:${cust.phone}`} className="hover:text-[#00FF9D] font-mono-num">
                          {cust.phone}
                        </a>
                      </div>
                    )}
                    {cust.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <a href={`mailto:${cust.email}`} className="hover:text-[#00FF9D] truncate">
                          {cust.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {cust.tags && cust.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cust.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="text-[#00FF9D] font-black hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
                  >
                    <span>View History ({custJobs.length} jobs)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cust)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(cust.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete"
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

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-700 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#121214]">
              <div>
                <h3 className="font-black text-white text-base font-heading">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-400 font-medium">{selectedCustomer.company || 'Client Profile'}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Linked Jobs */}
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00FF9D]" />
                  <span>Linked Jobs ({jobs.filter((j) => j.customerId === selectedCustomer.id).length})</span>
                </h4>
                <div className="space-y-2">
                  {jobs
                    .filter((j) => j.customerId === selectedCustomer.id)
                    .map((j) => (
                      <div key={j.id} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex justify-between">
                        <div>
                          <span className="font-black text-white">{j.title}</span>
                          <span className="block text-neutral-400 mt-0.5">{j.date}</span>
                        </div>
                        <span className="font-black text-white font-mono-num">£{j.amount || 0}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Linked Notes */}
              <div>
                <h4 className="text-xs font-black uppercase text-neutral-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>Site Notes</span>
                </h4>
                {selectedCustomer.notes ? (
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-200">
                    {selectedCustomer.notes}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">No notes recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] rounded-2xl w-full max-w-md shadow-2xl border border-neutral-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#121214]">
              <h3 className="font-black text-white text-base font-heading">
                {editingCustomer ? `Edit ${customLabel.slice(0, -1)}` : `Add ${customLabel.slice(0, -1)}`}
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
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    <option value="active">Active</option>
                    <option value="lead">Lead</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Company / Property</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. Weekly, Commercial"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        title={`Delete ${customLabel.slice(0, -1)}?`}
        message="Are you sure you want to delete this record from your local workspace?"
        onConfirm={() => {
          if (deletingId) {
            onDeleteCustomer(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

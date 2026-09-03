import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Users, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { Customer, FollowUp, Job, ModuleId, Note, Payment, Task, WorkspaceConfig } from '../types';
import { generateInvoiceNumber } from '../utils/invoice';
import { getEnabledModules, selectValidModule } from '../utils/config';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WorkspaceConfig;
  customers: Customer[];
  jobs: Job[];
  onAddCustomer: (customer: Customer) => void;
  onAddJob: (job: Job) => void;
  onAddTask: (task: Task) => void;
  onAddNote: (note: Note) => void;
  onAddFollowUp: (followUp: FollowUp) => void;
  onAddPayment: (payment: Payment) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  config,
  customers,
  jobs,
  onAddCustomer,
  onAddJob,
  onAddTask,
  onAddNote,
  onAddFollowUp,
  onAddPayment,
}) => {
  const enabledModules = useMemo(
    () => getEnabledModules(config.modules),
    [config.modules]
  );

  const [activeType, setActiveType] = useState<ModuleId>(
    selectValidModule(enabledModules)
  );

  // Form States
  // Customer Form
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCompany, setCustCompany] = useState('');

  // Job Form
  const [jobTitle, setJobTitle] = useState('');
  const [jobCustId, setJobCustId] = useState(customers[0]?.id || '');
  const [jobDate, setJobDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobStartTime, setJobStartTime] = useState('09:00');
  const [jobStatus, setJobStatus] = useState<Job['status']>('scheduled');
  const [jobAmount, setJobAmount] = useState<string>('150');

  // Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCustId, setNoteCustId] = useState(customers[0]?.id || '');

  // Follow-up Form
  const [folTitle, setFolTitle] = useState('');
  const [folCustId, setFolCustId] = useState(customers[0]?.id || '');
  const [folDate, setFolDate] = useState(new Date().toISOString().split('T')[0]);

  // Payment Form
  const [payCustId, setPayCustId] = useState(customers[0]?.id || '');
  const [payAmount, setPayAmount] = useState('150');
  const [payStatus, setPayStatus] = useState<'paid' | 'pending' | 'overdue'>('pending');
  const [payDueDate, setPayDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Ensure activeType is always an enabled module if config changes
  useEffect(() => {
    setActiveType((current) => selectValidModule(enabledModules, current));
  }, [enabledModules]);

  // Sync selected customer IDs when customer list updates
  useEffect(() => {
    const firstCustId = customers[0]?.id || '';
    if (jobCustId && !customers.some((c) => c.id === jobCustId)) setJobCustId(firstCustId);
    if (noteCustId && !customers.some((c) => c.id === noteCustId)) setNoteCustId(firstCustId);
    if (folCustId && !customers.some((c) => c.id === folCustId)) setFolCustId(firstCustId);
    if (payCustId && !customers.some((c) => c.id === payCustId)) setPayCustId(firstCustId);
  }, [customers, jobCustId, noteCustId, folCustId, payCustId]);

  const prevIsOpen = useRef(isOpen);

  // Reset form fields whenever the modal opens from a closed state
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setCustName('');
      setCustEmail('');
      setCustPhone('');
      setCustCompany('');

      setJobTitle('');
      setJobAmount('150');
      setJobDate(new Date().toISOString().split('T')[0]);
      setJobStartTime('09:00');
      setJobStatus('scheduled');

      setTaskTitle('');
      setTaskPriority('medium');

      setNoteTitle('');
      setNoteContent('');

      setFolTitle('');
      setFolDate(new Date().toISOString().split('T')[0]);

      setPayAmount('150');
      setPayStatus('pending');
      setPayDueDate(new Date().toISOString().split('T')[0]);

      const firstCustId = customers[0]?.id || '';
      setJobCustId(firstCustId);
      setNoteCustId(firstCustId);
      setFolCustId(firstCustId);
      setPayCustId(firstCustId);

      setActiveType(selectValidModule(enabledModules));
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, customers, enabledModules]);

  // If modal is not open, all hooks have executed; return null now safely
  if (!isOpen) return null;

  const requiresCustomer =
    activeType === 'jobs' || activeType === 'followups' || activeType === 'payments';
  const hasNoCustomers = customers.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'customers') {
      if (!custName.trim()) return;
      onAddCustomer({
        id: `cust-${Date.now()}`,
        name: custName.trim(),
        email: custEmail.trim(), // Stores empty string if blank
        phone: custPhone.trim(), // Stores empty string if blank
        company: custCompany.trim(),
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      });
    } else if (activeType === 'jobs') {
      if (!jobTitle.trim() || !jobCustId) return;
      onAddJob({
        id: `job-${Date.now()}`,
        title: jobTitle.trim(),
        customerId: jobCustId,
        status: jobStatus,
        date: jobDate,
        startTime: jobStartTime,
        amount: parseFloat(jobAmount) || 0,
      });
    } else if (activeType === 'tasks') {
      if (!taskTitle.trim()) return;
      onAddTask({
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        completed: false,
        priority: taskPriority,
        dueDate: new Date().toISOString().split('T')[0],
      });
    } else if (activeType === 'notes') {
      if (!noteTitle.trim()) return;
      onAddNote({
        id: `note-${Date.now()}`,
        title: noteTitle.trim(),
        content: noteContent.trim(),
        customerId: noteCustId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else if (activeType === 'followups') {
      if (!folTitle.trim() || !folCustId) return;
      onAddFollowUp({
        id: `fol-${Date.now()}`,
        title: folTitle.trim(),
        customerId: folCustId,
        dueDate: folDate,
        completed: false,
        channel: 'phone',
      });
    } else if (activeType === 'payments') {
      if (!payCustId) return;
      onAddPayment({
        id: `pay-${Date.now()}`,
        customerId: payCustId,
        amount: parseFloat(payAmount) || 0,
        status: payStatus,
        dueDate: payDueDate,
        invoiceNumber: generateInvoiceNumber(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#18181B] rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-700 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#121214]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF5722]/20 text-[#FF5722] border border-[#FF5722]/30 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <h3 className="font-black text-white text-base font-heading">Quick Add Item</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Pills */}
        <div className="px-5 pt-4 pb-2 flex gap-1.5 overflow-x-auto border-b border-neutral-800 no-scrollbar bg-[#121214]/50">
          {enabledModules.map((m) => {
            const isSelected = activeType === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveType(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF5722] text-white shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Validation Notice when no customers exist for dependent items */}
          {requiresCustomer && hasNoCustomers ? (
            <div className="bg-[#FF5722]/10 border border-[#FF5722]/40 rounded-xl p-4 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[#FF5722] mx-auto" />
              <div>
                <h4 className="font-black text-white text-sm font-heading mb-1">
                  Client Required
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                  Please add at least one client before creating a job, follow-up, or payment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveType('customers')}
                className="inline-flex items-center gap-1.5 bg-[#FF5722] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition shadow-md"
              >
                <Users className="w-4 h-4" />
                <span>Add a Client First</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {activeType === 'customers' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="text"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="07700 900123"
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="sarah@example.co.uk"
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Company / Property (Optional)
                    </label>
                    <input
                      type="text"
                      value={custCompany}
                      onChange={(e) => setCustCompany(e.target.value)}
                      placeholder="e.g. The Oakwood Bistro"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                </>
              )}

              {activeType === 'jobs' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Weekly Commercial Clean"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Client *
                      </label>
                      <select
                        value={jobCustId}
                        onChange={(e) => setJobCustId(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      >
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Status
                      </label>
                      <select
                        value={jobStatus}
                        onChange={(e) => setJobStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={jobDate}
                        onChange={(e) => setJobDate(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={jobStartTime}
                        onChange={(e) => setJobStartTime(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Amount (£)
                      </label>
                      <input
                        type="number"
                        value={jobAmount}
                        onChange={(e) => setJobAmount(e.target.value)}
                        placeholder="150"
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeType === 'tasks' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Order extra microfiber cloths"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTaskPriority(p)}
                          className={`flex-1 py-2 text-xs font-black rounded-lg uppercase tracking-wider transition ${
                            taskPriority === p
                              ? p === 'high'
                                ? 'bg-rose-600 text-white'
                                : p === 'medium'
                                ? 'bg-amber-500 text-white'
                                : 'bg-[#00FF9D] text-black'
                              : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeType === 'notes' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Note Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="e.g. Access & Alarm Code"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Client Link (Optional)
                    </label>
                    <select
                      value={noteCustId}
                      onChange={(e) => setNoteCustId(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    >
                      <option value="">-- General Note --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Note Content
                    </label>
                    <textarea
                      rows={3}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write site notes, gate instructions, or preferences..."
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                </>
              )}

              {activeType === 'followups' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Follow-up Action *
                    </label>
                    <input
                      type="text"
                      required
                      value={folTitle}
                      onChange={(e) => setFolTitle(e.target.value)}
                      placeholder="e.g. Call to confirm monthly re-booking"
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Client *
                      </label>
                      <select
                        value={folCustId}
                        onChange={(e) => setFolCustId(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      >
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={folDate}
                        onChange={(e) => setFolDate(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeType === 'payments' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Client *
                    </label>
                    <select
                      value={payCustId}
                      onChange={(e) => setPayCustId(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
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
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Amount (£) *
                      </label>
                      <input
                        type="number"
                        required
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                        Status
                      </label>
                      <select
                        value={payStatus}
                        onChange={(e) => setPayStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={payDueDate}
                      onChange={(e) => setPayDueDate(e.target.value)}
                      className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Submit Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={requiresCustomer && hasNoCustomers}
              className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#FF5722] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition shadow-md shadow-[#FF5722]/20"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


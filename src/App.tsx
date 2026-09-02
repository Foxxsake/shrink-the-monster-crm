import React, { useState } from 'react';
import {
  DEFAULT_WORKSPACE,
  INITIAL_CUSTOMERS,
  INITIAL_FOLLOWUPS,
  INITIAL_JOBS,
  INITIAL_NOTES,
  INITIAL_PAYMENTS,
  INITIAL_TASKS,
} from './data';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Customer, FollowUp, Job, Note, Payment, Task, ViewTab, WorkspaceConfig } from './types';

import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Navigation } from './components/Navigation';
import { OnboardingFlow } from './components/OnboardingFlow';
import { QuickAddModal } from './components/QuickAddModal';

import { CustomersView } from './components/views/CustomersView';
import { DashboardView } from './components/views/DashboardView';
import { FollowUpsView } from './components/views/FollowUpsView';
import { JobsView } from './components/views/JobsView';
import { NotesView } from './components/views/NotesView';
import { PaymentsView } from './components/views/PaymentsView';
import { SettingsView } from './components/views/SettingsView';
import { TasksView } from './components/views/TasksView';

export default function App() {
  // Local storage state
  const [config, setConfig, resetConfig] = useLocalStorage<WorkspaceConfig>(
    'shrink_workspace_config',
    DEFAULT_WORKSPACE
  );
  const [customers, setCustomers, resetCustomers] = useLocalStorage<Customer[]>(
    'shrink_customers',
    INITIAL_CUSTOMERS
  );
  const [jobs, setJobs, resetJobs] = useLocalStorage<Job[]>('shrink_jobs', INITIAL_JOBS);
  const [tasks, setTasks, resetTasks] = useLocalStorage<Task[]>('shrink_tasks', INITIAL_TASKS);
  const [notes, setNotes, resetNotes] = useLocalStorage<Note[]>('shrink_notes', INITIAL_NOTES);
  const [followUps, setFollowUps, resetFollowUps] = useLocalStorage<FollowUp[]>(
    'shrink_followups',
    INITIAL_FOLLOWUPS
  );
  const [payments, setPayments, resetPayments] = useLocalStorage<Payment[]>(
    'shrink_payments',
    INITIAL_PAYMENTS
  );

  // App mode & active tab
  const [appMode, setAppMode] = useState<'landing' | 'onboarding' | 'workspace'>(
    config.isConfigured ? 'workspace' : 'landing'
  );
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Handlers
  const handleCompleteOnboarding = (newConfig: WorkspaceConfig) => {
    setConfig(newConfig);
    setAppMode('workspace');
    setActiveTab('dashboard');
  };

  const handleLaunchDemo = () => {
    setConfig({ ...DEFAULT_WORKSPACE, isConfigured: true });
    setAppMode('workspace');
    setActiveTab('dashboard');
  };

  const handleResetWorkspace = () => {
    resetConfig();
    resetCustomers();
    resetJobs();
    resetTasks();
    resetNotes();
    resetFollowUps();
    resetPayments();
    setAppMode('landing');
  };

  // CRUD Handlers
  const handleAddCustomer = (cust: Customer) => setCustomers((prev) => [cust, ...prev]);
  const handleUpdateCustomer = (cust: Customer) =>
    setCustomers((prev) => prev.map((c) => (c.id === cust.id ? cust : c)));
  const handleDeleteCustomer = (id: string) =>
    setCustomers((prev) => prev.filter((c) => c.id !== id));

  const handleAddJob = (job: Job) => setJobs((prev) => [job, ...prev]);
  const handleUpdateJob = (job: Job) =>
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
  const handleDeleteJob = (id: string) => setJobs((prev) => prev.filter((j) => j.id !== id));

  const handleAddTask = (task: Task) => setTasks((prev) => [task, ...prev]);
  const handleUpdateTask = (task: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  const handleDeleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleToggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const handleAddNote = (note: Note) => setNotes((prev) => [note, ...prev]);
  const handleUpdateNote = (note: Note) =>
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  const handleDeleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const handleAddFollowUp = (fol: FollowUp) => setFollowUps((prev) => [fol, ...prev]);
  const handleUpdateFollowUp = (fol: FollowUp) =>
    setFollowUps((prev) => prev.map((f) => (f.id === fol.id ? fol : f)));
  const handleDeleteFollowUp = (id: string) =>
    setFollowUps((prev) => prev.filter((f) => f.id !== id));
  const handleToggleFollowUp = (id: string) =>
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );

  const handleAddPayment = (pay: Payment) => setPayments((prev) => [pay, ...prev]);
  const handleUpdatePayment = (pay: Payment) =>
    setPayments((prev) => prev.map((p) => (p.id === pay.id ? pay : p)));
  const handleDeletePayment = (id: string) => setPayments((prev) => prev.filter((p) => p.id !== id));

  // Render Mode Pages
  if (appMode === 'landing') {
    return (
      <LandingPage
        onStartOnboarding={() => setAppMode('onboarding')}
        onLaunchDemo={handleLaunchDemo}
      />
    );
  }

  if (appMode === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={handleCompleteOnboarding}
        onCancel={() => setAppMode('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Navigation Sidebar / Mobile Bar */}
        <Navigation
          config={config}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenOnboarding={() => setAppMode('onboarding')}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              config={config}
              customers={customers}
              jobs={jobs}
              tasks={tasks}
              followUps={followUps}
              payments={payments}
              setActiveTab={setActiveTab}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onToggleFollowUp={handleToggleFollowUp}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              config={config}
              customers={customers}
              jobs={jobs}
              notes={notes}
              followUps={followUps}
              payments={payments}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === 'jobs' && (
            <JobsView
              config={config}
              jobs={jobs}
              customers={customers}
              onAddJob={handleAddJob}
              onUpdateJob={handleUpdateJob}
              onDeleteJob={handleDeleteJob}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              config={config}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              config={config}
              notes={notes}
              customers={customers}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'followups' && (
            <FollowUpsView
              config={config}
              followUps={followUps}
              customers={customers}
              onAddFollowUp={handleAddFollowUp}
              onUpdateFollowUp={handleUpdateFollowUp}
              onDeleteFollowUp={handleDeleteFollowUp}
              onToggleFollowUp={handleToggleFollowUp}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              config={config}
              payments={payments}
              customers={customers}
              onAddPayment={handleAddPayment}
              onUpdatePayment={handleUpdatePayment}
              onDeletePayment={handleDeletePayment}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              config={config}
              onUpdateConfig={setConfig}
              onResetWorkspace={handleResetWorkspace}
              onReRunOnboarding={() => setAppMode('onboarding')}
            />
          )}
        </main>
      </div>

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        config={config}
        customers={customers}
        jobs={jobs}
        onAddCustomer={handleAddCustomer}
        onAddJob={handleAddJob}
        onAddTask={handleAddTask}
        onAddNote={handleAddNote}
        onAddFollowUp={handleAddFollowUp}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
}

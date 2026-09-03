export type ModuleId = 'customers' | 'jobs' | 'tasks' | 'notes' | 'followups' | 'payments';

export interface ModuleConfig {
  id: ModuleId;
  enabled: boolean;
  label: string;
  defaultLabel: string;
  iconName: string;
  description: string;
}

export interface WorkspaceConfig {
  businessName: string;
  businessType: string;
  replaceSoftware: string | string[];
  accentColor: string; // hex color e.g., '#4f46e5'
  modules: ModuleConfig[];
  isConfigured: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: 'active' | 'lead' | 'inactive';
  tags?: string[];
  notes?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  customerId: string;
  jobType?: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  date: string; // YYYY-MM-DD
  startTime?: string;
  estimatedDuration?: string;
  address?: string;
  assignedPerson?: string;
  amount?: number;
  recurrence?: 'one-off' | 'weekly' | 'fortnightly' | 'monthly';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  jobId?: string;
  customerId?: string;
  dueDate?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  customerId?: string;
  jobId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  customerId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  channel?: 'phone' | 'email' | 'meeting';
}

export interface Payment {
  id: string;
  customerId: string;
  jobId?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string; // YYYY-MM-DD
  paidDate?: string;
  invoiceNumber: string;
}

export interface BusinessPreset {
  id: string;
  name: string;
  icon: string;
  defaultSoftware: string;
  recommendedModules: ModuleId[];
  moduleLabels: Record<ModuleId, string>;
  sampleName: string;
}

export type ViewTab = 'dashboard' | ModuleId | 'settings';

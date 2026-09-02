import { Customer, FollowUp, Job, Payment, Task } from '../types';

export interface DashboardMetrics {
  activeCustomersCount: number;
  pendingJobsCount: number;
  pendingTasksCount: number;
  pendingFollowUpsCount: number;
  unpaidPaymentsCount: number;
  totalOutstandingAmount: number;
}

export function calculateDashboardMetrics(
  customers: Customer[],
  jobs: Job[],
  tasks: Task[],
  followUps: FollowUp[],
  payments: Payment[]
): DashboardMetrics {
  const activeCustomersCount = customers.filter((c) => c.status === 'active').length;
  const pendingJobsCount = jobs.filter((j) => j.status === 'scheduled' || j.status === 'in_progress').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const pendingFollowUpsCount = followUps.filter((f) => !f.completed).length;

  const unpaidPayments = payments.filter((p) => p.status === 'pending' || p.status === 'overdue');
  const unpaidPaymentsCount = unpaidPayments.length;
  const totalOutstandingAmount = unpaidPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return {
    activeCustomersCount,
    pendingJobsCount,
    pendingTasksCount,
    pendingFollowUpsCount,
    unpaidPaymentsCount,
    totalOutstandingAmount,
  };
}

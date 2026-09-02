import { describe, expect, it } from 'vitest';
import { Customer, FollowUp, Job, Payment, Task } from '../types';
import { calculateDashboardMetrics } from './metrics';

describe('calculateDashboardMetrics', () => {
  const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Alice', email: '', phone: '', status: 'active', createdAt: '2026-01-01' },
    { id: 'c2', name: 'Bob', email: '', phone: '', status: 'lead', createdAt: '2026-01-02' },
    { id: 'c3', name: 'Charlie', email: '', phone: '', status: 'active', createdAt: '2026-01-03' },
    { id: 'c4', name: 'David', email: '', phone: '', status: 'inactive', createdAt: '2026-01-04' },
  ];

  const mockJobs: Job[] = [
    { id: 'j1', title: 'Clean 1', customerId: 'c1', status: 'scheduled', date: '2026-09-03', amount: 100 },
    { id: 'j2', title: 'Clean 2', customerId: 'c2', status: 'in_progress', date: '2026-09-03', amount: 150 },
    { id: 'j3', title: 'Clean 3', customerId: 'c3', status: 'completed', date: '2026-09-01', amount: 200 },
    { id: 'j4', title: 'Clean 4', customerId: 'c4', status: 'cancelled', date: '2026-09-01', amount: 80 },
  ];

  const mockTasks: Task[] = [
    { id: 't1', title: 'Task 1', completed: false, priority: 'high' },
    { id: 't2', title: 'Task 2', completed: true, priority: 'medium' },
    { id: 't3', title: 'Task 3', completed: false, priority: 'low' },
  ];

  const mockFollowUps: FollowUp[] = [
    { id: 'f1', customerId: 'c1', title: 'Follow 1', dueDate: '2026-09-05', completed: false },
    { id: 'f2', customerId: 'c2', title: 'Follow 2', dueDate: '2026-09-02', completed: true },
  ];

  const mockPayments: Payment[] = [
    { id: 'p1', customerId: 'c1', amount: 250, status: 'paid', dueDate: '2026-08-30', invoiceNumber: 'INV-1' },
    { id: 'p2', customerId: 'c2', amount: 150, status: 'pending', dueDate: '2026-09-10', invoiceNumber: 'INV-2' },
    { id: 'p3', customerId: 'c3', amount: 200, status: 'overdue', dueDate: '2026-08-20', invoiceNumber: 'INV-3' },
  ];

  it('calculates active customers correctly', () => {
    const metrics = calculateDashboardMetrics(mockCustomers, [], [], [], []);
    expect(metrics.activeCustomersCount).toBe(2);
  });

  it('calculates pending jobs correctly', () => {
    const metrics = calculateDashboardMetrics([], mockJobs, [], [], []);
    expect(metrics.pendingJobsCount).toBe(2); // scheduled + in_progress
  });

  it('calculates pending tasks and follow-ups correctly', () => {
    const metrics = calculateDashboardMetrics([], [], mockTasks, mockFollowUps, []);
    expect(metrics.pendingTasksCount).toBe(2);
    expect(metrics.pendingFollowUpsCount).toBe(1);
  });

  it('calculates unpaid payments count and total outstanding amount', () => {
    const metrics = calculateDashboardMetrics([], [], [], [], mockPayments);
    expect(metrics.unpaidPaymentsCount).toBe(2); // pending (150) + overdue (200)
    expect(metrics.totalOutstandingAmount).toBe(350);
  });
});

import { Job } from '../types';

export function sortJobsByDate(jobs: Job[]): Job[] {
  return [...jobs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function filterJobs(jobs: Job[], statusFilter: string): Job[] {
  if (statusFilter === 'all') return jobs;
  return jobs.filter(job => job.status === statusFilter);
}

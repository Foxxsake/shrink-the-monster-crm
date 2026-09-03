import { describe, expect, it } from 'vitest';
import { Job } from '../types';
import { sortJobsByDate, filterJobs } from './jobs';

describe('Job record handling', () => {
  const mockJobs: Job[] = [
    { id: '1', title: 'Job B', customerId: 'c1', status: 'completed', date: '2026-09-02' },
    { id: '2', title: 'Job C', customerId: 'c1', status: 'scheduled', date: '2026-09-03' },
    { id: '3', title: 'Job A', customerId: 'c2', status: 'scheduled', date: '2026-09-01' },
  ];

  it('sorts jobs by upcoming date', () => {
    const sorted = sortJobsByDate(mockJobs);
    expect(sorted[0].id).toBe('3'); // 09-01
    expect(sorted[1].id).toBe('1'); // 09-02
    expect(sorted[2].id).toBe('2'); // 09-03
  });

  it('filters jobs by status', () => {
    const scheduled = filterJobs(mockJobs, 'scheduled');
    expect(scheduled.length).toBe(2);
    expect(scheduled.every(j => j.status === 'scheduled')).toBe(true);

    const completed = filterJobs(mockJobs, 'completed');
    expect(completed.length).toBe(1);
    expect(completed[0].status).toBe('completed');
  });

  it('returns all jobs when filter is all', () => {
    expect(filterJobs(mockJobs, 'all').length).toBe(3);
  });
});

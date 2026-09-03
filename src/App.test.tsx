import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import App from './App';
import { INITIAL_CUSTOMERS, INITIAL_JOBS, INITIAL_TASKS, INITIAL_NOTES, INITIAL_FOLLOWUPS, INITIAL_PAYMENTS } from './data';

describe('App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('Shrink My Software opens onboarding, Cancel returns to landing', () => {
    render(<App />);
    expect(screen.getByText('Shrink My Software')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Shrink My Software'));
    expect(screen.getByText('What type of business do you run?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Shrink My Software')).toBeInTheDocument();
  });

  it('Quick Add opens, closes, reopens without hook errors', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Explore Demo'));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Quick Add'));
    expect(screen.getByLabelText('Close')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Quick Add'));
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('Reset workspace clears data and demo launch restores it', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Explore Demo'));
    
    // Go to Settings - use title
    fireEvent.click(screen.getByTitle('Workspace Settings'));
    
    // Click Reset
    const resetBtn = await screen.findByText('Reset All Workspace Data');
    fireEvent.click(resetBtn);
    
    // Should show confirm modal
    expect(await screen.findByText('Reset Entire Workspace?')).toBeInTheDocument();
    
    // Cancel Reset
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Reset Entire Workspace?')).not.toBeInTheDocument();
    });
    
    // Cancelling preserves data
    const customersJson = window.localStorage.getItem('shrink_customers');
    expect(customersJson).not.toBe('[]');
    expect(JSON.parse(customersJson!)).toHaveLength(INITIAL_CUSTOMERS.length);
    
    // Confirm Reset
    fireEvent.click(screen.getByText('Reset All Workspace Data'));
    const confirmBtn = await screen.findByText('Reset Data');
    fireEvent.click(confirmBtn);
    
    // Should be back to landing
    expect(await screen.findByText('Shrink My Software')).toBeInTheDocument();
    
    // Verify LocalStorage was cleared
    await waitFor(() => {
      expect(window.localStorage.getItem('shrink_customers')).toBe('[]');
      expect(window.localStorage.getItem('shrink_jobs')).toBe('[]');
      expect(window.localStorage.getItem('shrink_tasks')).toBe('[]');
      expect(window.localStorage.getItem('shrink_notes')).toBe('[]');
      expect(window.localStorage.getItem('shrink_followups')).toBe('[]');
      expect(window.localStorage.getItem('shrink_payments')).toBe('[]');
      
      const configJson = window.localStorage.getItem('shrink_workspace_config');
      expect(configJson).toBeTruthy();
      expect(JSON.parse(configJson!).isConfigured).toBe(false);
    });
    
    // Relaunch demo
    fireEvent.click(screen.getByText('Instant Demo'));
    
    // Should be on dashboard with restored demo data
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    
    // Verify restored demo records
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem('shrink_customers')!)).toHaveLength(INITIAL_CUSTOMERS.length);
      expect(JSON.parse(window.localStorage.getItem('shrink_jobs')!)).toHaveLength(INITIAL_JOBS.length);
      expect(JSON.parse(window.localStorage.getItem('shrink_tasks')!)).toHaveLength(INITIAL_TASKS.length);
      expect(JSON.parse(window.localStorage.getItem('shrink_notes')!)).toHaveLength(INITIAL_NOTES.length);
      expect(JSON.parse(window.localStorage.getItem('shrink_followups')!)).toHaveLength(INITIAL_FOLLOWUPS.length);
      expect(JSON.parse(window.localStorage.getItem('shrink_payments')!)).toHaveLength(INITIAL_PAYMENTS.length);
    });
  });
});

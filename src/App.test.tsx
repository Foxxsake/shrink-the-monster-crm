import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import App from './App';

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
    
    // Confirm Reset
    fireEvent.click(screen.getByText('Reset All Workspace Data'));
    const confirmBtn = await screen.findByText('Reset Data');
    fireEvent.click(confirmBtn);
    
    // Should be back to landing
    expect(await screen.findByText('Shrink My Software')).toBeInTheDocument();
    
    // Relaunch demo
    fireEvent.click(screen.getByText('Instant Demo'));
    
    // Should be on dashboard with restored demo data
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });
});

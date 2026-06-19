import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from '../components/ExportButton';
import type { OptimizedEvent } from '../types';

// Mock download so no real file is created during tests
jest.mock('../utils/download', () => ({
  downloadFile: jest.fn(),
  generateFilename: jest.fn(() => 'optimized-calendar-20240101.ics'),
}));

function makeEvent(uid: string): OptimizedEvent {
  const start = new Date('2024-01-01T09:00:00Z');
  const end = new Date('2024-01-01T10:00:00Z');
  return { uid, summary: 'Event', start, end, newStart: start, newEnd: end, cognitiveLoad: 'medium', moved: false };
}

describe('ExportButton', () => {
  it('renders the export button', () => {
    render(<ExportButton events={[makeEvent('e1')]} isProcessing={false} disabled={false} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('is disabled when no events', () => {
    render(<ExportButton events={[]} isProcessing={false} disabled={false} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled();
  });

  it('is disabled when isProcessing', () => {
    render(<ExportButton events={[makeEvent('e1')]} isProcessing={true} disabled={false} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ExportButton events={[makeEvent('e1')]} isProcessing={false} disabled={true} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled();
  });

  it('shows success state after click', async () => {
    const user = userEvent.setup();
    render(<ExportButton events={[makeEvent('e1')]} isProcessing={false} disabled={false} />);
    await user.click(screen.getByRole('button', { name: /export/i }));
    expect(screen.getByText(/downloaded/i)).toBeInTheDocument();
  });

  it('shows processing label when isProcessing', () => {
    render(<ExportButton events={[makeEvent('e1')]} isProcessing={true} disabled={false} />);
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Minimal valid ICS with one timed event in range (9 AM–10 AM)
const VALID_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Test//Test//EN',
  'BEGIN:VEVENT',
  'UID:integration-test-uid@test',
  'SUMMARY:Strategy meeting',
  'DTSTART:20240101T090000',
  'DTEND:20240101T100000',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

function makeICSFile(content: string, name = 'calendar.ics'): File {
  return new File([content], name, { type: 'text/calendar' });
}

describe('App integration', () => {
  it('renders the heading and subtitle', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /turtlerocket time twister/i })).toBeInTheDocument();
    // subtitle + instructions list both contain "set your energy levels" — use getAllByText
    expect(screen.getAllByText(/set your energy levels/i).length).toBeGreaterThan(0);
  });

  it('renders 12 energy blocks on mount', () => {
    render(<App />);
    const energySection = screen.getByRole('region', { name: /energy levels/i });
    expect(within(energySection).getAllByRole('listitem')).toHaveLength(12);
  });

  it('cycling an energy block updates its label', async () => {
    const user = userEvent.setup();
    render(<App />);
    const energySection = screen.getByRole('region', { name: /energy levels/i });
    const blocks = within(energySection).getAllByRole('listitem');
    await user.click(blocks[0]); // medium → high
    expect(blocks[0]).toHaveAttribute('aria-label', expect.stringContaining('high'));
  });

  it('reset button restores all blocks to medium', async () => {
    const user = userEvent.setup();
    render(<App />);
    const energySection = screen.getByRole('region', { name: /energy levels/i });
    const blocks = within(energySection).getAllByRole('listitem');
    await user.click(blocks[0]); // cycle to high
    await user.click(screen.getByRole('button', { name: /reset to default/i }));
    blocks.forEach((b) => expect(b).toHaveAttribute('aria-label', expect.stringContaining('medium')));
  });

  it('shows error for non-ICS file upload', async () => {
    render(<App />);
    const input = document.getElementById('ics-input') as HTMLInputElement;
    const txtFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    // fireEvent bypasses userEvent's accept-attribute filtering so validation runs in App
    fireEvent.change(input, { target: { files: [txtFile] } });
    expect(await screen.findByRole('alert')).toHaveTextContent(/valid .ics/i);
  });

  it('parses a valid ICS file and shows results', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = document.getElementById('ics-input') as HTMLInputElement;
    await user.upload(input, makeICSFile(VALID_ICS));
    // 'Strategy meeting' appears in both ScheduleDisplay and ScheduleComparison
    await waitFor(() => expect(screen.queryAllByText('Strategy meeting').length).toBeGreaterThan(0));
    expect(screen.getByText('Original Schedule')).toBeInTheDocument();
    expect(screen.getByText('Optimized Schedule')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('clear button removes results from view', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = document.getElementById('ics-input') as HTMLInputElement;
    await user.upload(input, makeICSFile(VALID_ICS));
    await waitFor(() => expect(screen.queryAllByText('Strategy meeting').length).toBeGreaterThan(0));
    await user.click(screen.getByRole('button', { name: /remove file/i }));
    expect(screen.queryByText('Strategy meeting')).not.toBeInTheDocument();
    expect(screen.queryByText('Original Schedule')).not.toBeInTheDocument();
  });

  it('export button is disabled before file upload', () => {
    render(<App />);
    // No export button visible before upload
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument();
  });
});

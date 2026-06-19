import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScheduleComparison } from '../components/ScheduleComparison';
import type { OptimizedEvent } from '../types';

function makeOptimized(
  uid: string,
  summary: string,
  origHour: number,
  newHour: number,
): OptimizedEvent {
  const start = new Date(`2024-01-01T${String(origHour).padStart(2, '0')}:00:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const newStart = new Date(`2024-01-01T${String(newHour).padStart(2, '0')}:00:00`);
  const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);
  return {
    uid, summary, start, end, newStart, newEnd,
    cognitiveLoad: 'heavy',
    moved: origHour !== newHour,
  };
}

describe('ScheduleComparison', () => {
  it('renders a row for each event', () => {
    const events = [
      makeOptimized('e1', 'Meeting', 10, 8),
      makeOptimized('e2', 'Lunch', 12, 12),
    ];
    render(<ScheduleComparison events={events} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows moved count in summary', () => {
    const events = [
      makeOptimized('e1', 'Meeting', 10, 8),
      makeOptimized('e2', 'Lunch', 12, 12),
    ];
    render(<ScheduleComparison events={events} />);
    expect(screen.getByLabelText(/optimization summary/i)).toHaveTextContent('1 event moved');
  });

  it('shows ↑ arrow for events moved earlier', () => {
    const events = [makeOptimized('e1', 'Review', 14, 8)]; // moved earlier
    render(<ScheduleComparison events={events} />);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('shows ↓ arrow for events moved later', () => {
    const events = [makeOptimized('e1', 'Standup', 8, 14)]; // moved later
    render(<ScheduleComparison events={events} />);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('shows → arrow for unmoved events', () => {
    const events = [makeOptimized('e1', 'Standup', 9, 9)];
    render(<ScheduleComparison events={events} />);
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('shows time difference label for moved events', () => {
    const events = [makeOptimized('e1', 'Meeting', 14, 8)]; // 6h earlier
    render(<ScheduleComparison events={events} />);
    expect(screen.getByText(/6h earlier/i)).toBeInTheDocument();
  });

  it('shows "0 events moved" when nothing moved', () => {
    const events = [makeOptimized('e1', 'Meeting', 9, 9)];
    render(<ScheduleComparison events={events} />);
    expect(screen.getByLabelText(/optimization summary/i)).toHaveTextContent('0 events moved');
  });

  it('renders empty list without crashing', () => {
    render(<ScheduleComparison events={[]} />);
    expect(screen.getByText('0 events moved')).toBeInTheDocument();
  });
});

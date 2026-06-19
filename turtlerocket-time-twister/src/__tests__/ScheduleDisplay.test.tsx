import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScheduleDisplay } from '../components/ScheduleDisplay';
import type { CalendarEvent, ClassifiedEvent, EnergyLevel } from '../types';

function makeEvent(uid: string, summary: string, startHour: number, endHour: number): CalendarEvent {
  return {
    uid,
    summary,
    start: new Date(`2024-01-01T${String(startHour).padStart(2, '0')}:00:00`),
    end: new Date(`2024-01-01T${String(endHour).padStart(2, '0')}:00:00`),
  };
}

function makeClassified(uid: string, summary: string, startHour: number, endHour: number): ClassifiedEvent {
  return { ...makeEvent(uid, summary, startHour, endHour), cognitiveLoad: 'heavy' };
}

describe('ScheduleDisplay', () => {
  it('renders a title when provided', () => {
    render(<ScheduleDisplay events={[]} title="Original Schedule" />);
    expect(screen.getByText('Original Schedule')).toBeInTheDocument();
  });

  it('shows empty state message when no events', () => {
    render(<ScheduleDisplay events={[]} />);
    expect(screen.getByText(/no events to display/i)).toBeInTheDocument();
  });

  it('renders an event block for each event', () => {
    const events = [
      makeEvent('e1', 'Morning Meeting', 9, 10),
      makeEvent('e2', 'Lunch', 12, 13),
    ];
    render(<ScheduleDisplay events={events} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('shows event title', () => {
    const events = [makeEvent('e1', 'Sprint Review', 10, 11)];
    render(<ScheduleDisplay events={events} />);
    expect(screen.getByText('Sprint Review')).toBeInTheDocument();
  });

  it('aria-label includes event name and time', () => {
    const events = [makeEvent('e1', 'Standup', 9, 10)];
    render(<ScheduleDisplay events={events} />);
    expect(screen.getByLabelText(/standup at 09:00/i)).toBeInTheDocument();
  });

  it('renders ClassifiedEvent without error', () => {
    const events = [makeClassified('e1', 'Review session', 10, 11)];
    render(<ScheduleDisplay events={events} />);
    expect(screen.getByText('Review session')).toBeInTheDocument();
  });

  it('renders energy level backgrounds when showEnergyLevels is true', () => {
    const energyLevels: EnergyLevel[] = Array(12).fill('high') as EnergyLevel[];
    const { container } = render(
      <ScheduleDisplay events={[]} showEnergyLevels energyLevels={energyLevels} />
    );
    // 12 energy bg divs should be present (aria-hidden)
    const bgs = container.querySelectorAll('[aria-hidden="true"]');
    expect(bgs.length).toBeGreaterThan(0);
  });
});

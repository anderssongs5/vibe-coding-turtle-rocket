import type { CalendarEvent, ClassifiedEvent, OptimizedEvent, EnergyLevel } from '../types';

let _counter = 0;

export function resetFactoryCounter(): void {
  _counter = 0;
}

export function makeDate(hour: number, minute = 0): Date {
  return new Date(2024, 0, 15, hour, minute, 0, 0);
}

export function makeCalendarEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  const uid = `test-event-${++_counter}@factories`;
  const start = overrides.start ?? makeDate(9);
  const end = overrides.end ?? new Date(start.getTime() + 60 * 60 * 1000);
  return {
    uid: overrides.uid ?? uid,
    summary: overrides.summary ?? 'Test Event',
    start,
    end,
  };
}

export function makeClassifiedEvent(overrides: Partial<ClassifiedEvent> = {}): ClassifiedEvent {
  const base = makeCalendarEvent(overrides);
  return {
    ...base,
    cognitiveLoad: overrides.cognitiveLoad ?? 'medium',
  };
}

export function makeOptimizedEvent(overrides: Partial<OptimizedEvent> = {}): OptimizedEvent {
  const base = makeClassifiedEvent(overrides as Partial<ClassifiedEvent>);
  return {
    ...base,
    newStart: overrides.newStart ?? base.start,
    newEnd: overrides.newEnd ?? base.end,
    moved: overrides.moved ?? false,
  };
}

export function makeEnergyLevels(fill: EnergyLevel = 'medium'): EnergyLevel[] {
  return Array.from({ length: 12 }, () => fill);
}

export function makeICSContent(
  events: { summary: string; uid: string; dtstart: string; dtend: string }[]
): string {
  const vevents = events
    .map((e) =>
      [
        'BEGIN:VEVENT',
        `UID:${e.uid}`,
        `SUMMARY:${e.summary}`,
        `DTSTART:${e.dtstart}`,
        `DTEND:${e.dtend}`,
        'END:VEVENT',
      ].join('\r\n')
    )
    .join('\r\n');
  const body = vevents ? `${vevents}\r\n` : '';
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Test//Test//EN\r\n${body}END:VCALENDAR`;
}

export function makeLargeICSContent(count: number): string {
  const events = Array.from({ length: count }, (_, i) => {
    const hour = 8 + (i % 12);
    const hh = String(hour).padStart(2, '0');
    const day = String(15 + (Math.floor(i / 12) % 16)).padStart(2, '0');
    return {
      summary: `Event ${i}`,
      uid: `perf-event-${i}@test`,
      dtstart: `202401${day}T${hh}0000`,
      dtend: `202401${day}T${hh}3000`,
    };
  });
  return makeICSContent(events);
}

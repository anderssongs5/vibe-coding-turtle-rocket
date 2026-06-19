import { parseICSFile } from '../utils/icsParser';

function makeICS(events: string[]): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

function makeVEvent(opts: {
  uid?: string;
  summary?: string;
  dtstart?: string;
  dtend?: string;
}): string {
  return [
    'BEGIN:VEVENT',
    `UID:${opts.uid ?? 'test-uid@test'}`,
    `SUMMARY:${opts.summary ?? 'Test Event'}`,
    `DTSTART:${opts.dtstart ?? '20240101T090000'}`,
    `DTEND:${opts.dtend ?? '20240101T100000'}`,
    'END:VEVENT',
  ].join('\r\n');
}

describe('parseICSFile', () => {
  it('parses a single valid event', () => {
    const ics = makeICS([makeVEvent({ summary: 'Morning Meeting' })]);
    const events = parseICSFile(ics);
    expect(events).toHaveLength(1);
    expect(events[0].summary).toBe('Morning Meeting');
    expect(events[0].uid).toBe('test-uid@test');
  });

  it('parses multiple events', () => {
    const ics = makeICS([
      makeVEvent({ uid: 'uid-1', summary: 'Event A', dtstart: '20240101T090000', dtend: '20240101T100000' }),
      makeVEvent({ uid: 'uid-2', summary: 'Event B', dtstart: '20240101T140000', dtend: '20240101T150000' }),
    ]);
    const events = parseICSFile(ics);
    expect(events).toHaveLength(2);
    expect(events[0].summary).toBe('Event A');
    expect(events[1].summary).toBe('Event B');
  });

  it('returns Date objects for start and end', () => {
    const ics = makeICS([makeVEvent({ dtstart: '20240101T100000', dtend: '20240101T110000' })]);
    const [event] = parseICSFile(ics);
    expect(event.start).toBeInstanceOf(Date);
    expect(event.end).toBeInstanceOf(Date);
  });

  it('filters out all-day events', () => {
    const allDay = [
      'BEGIN:VEVENT',
      'UID:allday@test',
      'SUMMARY:All Day Event',
      'DTSTART;VALUE=DATE:20240101',
      'DTEND;VALUE=DATE:20240102',
      'END:VEVENT',
    ].join('\r\n');
    const ics = makeICS([allDay]);
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  it('filters out events starting before 8 AM', () => {
    const ics = makeICS([makeVEvent({ dtstart: '20240101T070000', dtend: '20240101T080000' })]);
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  it('filters out events starting at or after 8 PM (20:00)', () => {
    const ics = makeICS([makeVEvent({ dtstart: '20240101T200000', dtend: '20240101T210000' })]);
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  it('includes events starting exactly at 8 AM', () => {
    const ics = makeICS([makeVEvent({ dtstart: '20240101T080000', dtend: '20240101T090000' })]);
    expect(parseICSFile(ics)).toHaveLength(1);
  });

  it('includes events starting at 19:00', () => {
    const ics = makeICS([makeVEvent({ dtstart: '20240101T190000', dtend: '20240101T200000' })]);
    expect(parseICSFile(ics)).toHaveLength(1);
  });

  it('throws on malformed ICS content', () => {
    expect(() => parseICSFile('this is not ics')).toThrow();
  });

  it('returns empty array for calendar with no events', () => {
    const ics = makeICS([]);
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  it('uses (No title) for missing SUMMARY', () => {
    const noSummary = [
      'BEGIN:VEVENT',
      'UID:nosummary@test',
      'DTSTART:20240101T090000',
      'DTEND:20240101T100000',
      'END:VEVENT',
    ].join('\r\n');
    const ics = makeICS([noSummary]);
    const events = parseICSFile(ics);
    expect(events[0].summary).toBe('(No title)');
  });
});

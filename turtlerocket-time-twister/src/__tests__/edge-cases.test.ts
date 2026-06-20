import { parseICSFile } from '../utils/icsParser';
import { classifyEvents } from '../utils/classifier';
import { optimizeSchedule } from '../utils/optimizer';
import { buildICSFile } from '../utils/icsBuilder';
import {
  makeCalendarEvent,
  makeClassifiedEvent,
  makeOptimizedEvent,
  makeEnergyLevels,
  makeICSContent,
  resetFactoryCounter,
} from '../test-utils/factories';

beforeEach(() => resetFactoryCounter());

// ── icsParser edge cases ──────────────────────────────────────────────────────

describe('parseICSFile edge cases', () => {
  test('returns empty array for VCALENDAR with no events', () => {
    const ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Test//EN\r\nEND:VCALENDAR';
    expect(parseICSFile(ics)).toEqual([]);
  });

  test('filters out all-day events (VALUE=DATE format)', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Test//EN',
      'BEGIN:VEVENT',
      'UID:allday-1@test',
      'SUMMARY:Vacation',
      'DTSTART;VALUE=DATE:20240115',
      'DTEND;VALUE=DATE:20240116',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  test('filters events starting before 8 AM', () => {
    const ics = makeICSContent([
      { summary: 'Early meeting', uid: 'early-1', dtstart: '20240115T070000', dtend: '20240115T080000' },
    ]);
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  test('filters events starting at or after 8 PM (hour >= 20)', () => {
    const ics = makeICSContent([
      { summary: 'Late event', uid: 'late-1', dtstart: '20240115T200000', dtend: '20240115T210000' },
    ]);
    expect(parseICSFile(ics)).toHaveLength(0);
  });

  test('includes events starting at exactly 8 AM', () => {
    const ics = makeICSContent([
      { summary: 'Morning start', uid: 'am8-1', dtstart: '20240115T080000', dtend: '20240115T090000' },
    ]);
    const events = parseICSFile(ics);
    expect(events).toHaveLength(1);
    expect(events[0].start.getHours()).toBe(8);
  });

  test('includes events starting at 7 PM (hour 19)', () => {
    const ics = makeICSContent([
      { summary: 'Evening sync', uid: 'pm7-1', dtstart: '20240115T190000', dtend: '20240115T193000' },
    ]);
    const events = parseICSFile(ics);
    expect(events).toHaveLength(1);
    expect(events[0].start.getHours()).toBe(19);
  });

  test('uses (No title) for events with missing SUMMARY', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Test//EN',
      'BEGIN:VEVENT',
      'UID:notitle-1@test',
      'DTSTART:20240115T090000',
      'DTEND:20240115T100000',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const events = parseICSFile(ics);
    expect(events[0].summary).toBe('(No title)');
  });

  test('handles multiple events in a single file', () => {
    const ics = makeICSContent([
      { summary: 'Event A', uid: 'multi-1', dtstart: '20240115T090000', dtend: '20240115T100000' },
      { summary: 'Event B', uid: 'multi-2', dtstart: '20240115T140000', dtend: '20240115T150000' },
      { summary: 'Event C', uid: 'multi-3', dtstart: '20240115T160000', dtend: '20240115T170000' },
    ]);
    expect(parseICSFile(ics)).toHaveLength(3);
  });

  test('throws on malformed ICS content', () => {
    expect(() => parseICSFile('not valid ics at all')).toThrow();
  });
});

// ── classifyEvents edge cases ─────────────────────────────────────────────────

describe('classifyEvents edge cases', () => {
  test('returns empty array for empty input', () => {
    expect(classifyEvents([])).toEqual([]);
  });

  test('defaults to medium for unrecognised summary', () => {
    const [result] = classifyEvents([makeCalendarEvent({ summary: 'xyz totally unknown event' })]);
    expect(result.cognitiveLoad).toBe('medium');
  });

  test('empty string summary defaults to medium', () => {
    const [result] = classifyEvents([makeCalendarEvent({ summary: '' })]);
    expect(result.cognitiveLoad).toBe('medium');
  });

  test('heavy keyword beats light keyword in the same summary', () => {
    // "lunch" is light, "meeting" is heavy — heavy wins
    const [result] = classifyEvents([makeCalendarEvent({ summary: 'lunch meeting' })]);
    expect(result.cognitiveLoad).toBe('heavy');
  });

  test('partial word matching: "meetings" matches heavy keyword "meeting"', () => {
    const [result] = classifyEvents([makeCalendarEvent({ summary: 'weekly meetings recap' })]);
    expect(result.cognitiveLoad).toBe('heavy');
  });

  test('case-insensitive matching: "LUNCH" matches light keyword "lunch"', () => {
    const [result] = classifyEvents([makeCalendarEvent({ summary: 'LUNCH BREAK' })]);
    expect(result.cognitiveLoad).toBe('light');
  });

  test('preserves all original event fields', () => {
    const event = makeCalendarEvent({ summary: 'Strategy session' });
    const [classified] = classifyEvents([event]);
    expect(classified.uid).toBe(event.uid);
    expect(classified.start).toBe(event.start);
    expect(classified.end).toBe(event.end);
  });
});

// ── optimizeSchedule edge cases ───────────────────────────────────────────────

describe('optimizeSchedule edge cases', () => {
  test('returns empty array for empty input', () => {
    expect(optimizeSchedule([], makeEnergyLevels('medium'))).toEqual([]);
  });

  test('all-high energy: heavy event is assigned a slot', () => {
    const events = [
      makeClassifiedEvent({
        cognitiveLoad: 'heavy',
        start: new Date(2024, 0, 15, 9),
        end: new Date(2024, 0, 15, 10),
      }),
    ];
    const [result] = optimizeSchedule(events, makeEnergyLevels('high'));
    expect(result.cognitiveLoad).toBe('heavy');
    expect(result.newStart.getHours()).toBeGreaterThanOrEqual(8);
    expect(result.newStart.getHours()).toBeLessThan(20);
  });

  test('all-low energy: light event is assigned a slot', () => {
    const events = [
      makeClassifiedEvent({
        cognitiveLoad: 'light',
        start: new Date(2024, 0, 15, 9),
        end: new Date(2024, 0, 15, 10),
      }),
    ];
    const [result] = optimizeSchedule(events, makeEnergyLevels('low'));
    expect(result.cognitiveLoad).toBe('light');
    expect(result.newStart.getHours()).toBeGreaterThanOrEqual(8);
  });

  test('preserves event duration after optimization', () => {
    const start = new Date(2024, 0, 15, 9, 0);
    const end = new Date(2024, 0, 15, 11, 0); // 2-hour event
    const events = [makeClassifiedEvent({ cognitiveLoad: 'heavy', start, end })];
    const [optimized] = optimizeSchedule(events, makeEnergyLevels('high'));
    const duration = optimized.newEnd.getTime() - optimized.newStart.getTime();
    expect(duration).toBe(2 * 60 * 60 * 1000);
  });

  test('more events than available slots: all events are returned', () => {
    const events = Array.from({ length: 15 }, () =>
      makeClassifiedEvent({
        cognitiveLoad: 'heavy',
        start: new Date(2024, 0, 15, 9),
        end: new Date(2024, 0, 15, 10),
      })
    );
    const result = optimizeSchedule(events, makeEnergyLevels('high'));
    expect(result).toHaveLength(15);
  });

  test('optimized event has moved property set', () => {
    const events = [
      makeClassifiedEvent({
        cognitiveLoad: 'heavy',
        start: new Date(2024, 0, 15, 9),
        end: new Date(2024, 0, 15, 10),
      }),
    ];
    const result = optimizeSchedule(events, makeEnergyLevels('high'));
    expect(result[0]).toHaveProperty('moved');
  });

  test('out-of-range event passes through with newStart = original start', () => {
    const start = new Date(2024, 0, 15, 21, 0); // 9 PM — outside window
    const end = new Date(2024, 0, 15, 22, 0);
    const events = [makeClassifiedEvent({ cognitiveLoad: 'heavy', start, end })];
    const [result] = optimizeSchedule(events, makeEnergyLevels('high'));
    expect(result.newStart.getTime()).toBe(start.getTime());
    expect(result.moved).toBe(false);
  });
});

// ── buildICSFile edge cases ───────────────────────────────────────────────────

describe('buildICSFile edge cases', () => {
  test('produces valid ICS envelope with no events', () => {
    const ics = buildICSFile([]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  test('escapes commas in SUMMARY', () => {
    const event = makeOptimizedEvent({ summary: 'Meeting, review, planning', moved: false });
    const ics = buildICSFile([event]);
    expect(ics).toContain('Meeting\\, review\\, planning');
  });

  test('escapes semicolons in SUMMARY', () => {
    const event = makeOptimizedEvent({ summary: 'Event; follow-up', moved: false });
    const ics = buildICSFile([event]);
    expect(ics).toContain('Event\\; follow-up');
  });

  test('escapes backslashes in SUMMARY', () => {
    const event = makeOptimizedEvent({ summary: 'Path\\to\\file', moved: false });
    const ics = buildICSFile([event]);
    expect(ics).toContain('Path\\\\to\\\\file');
  });

  test('adds X-TURTLEROCKET-OPTIMIZED:TRUE only for moved events', () => {
    const moved = makeOptimizedEvent({ moved: true });
    const notMoved = makeOptimizedEvent({ moved: false });
    const ics = buildICSFile([moved, notMoved]);
    const count = (ics.match(/X-TURTLEROCKET-OPTIMIZED:TRUE/g) ?? []).length;
    expect(count).toBe(1);
  });

  test('preserves original UID in output', () => {
    const event = makeOptimizedEvent({ uid: 'my-unique-uid@domain.com', moved: false });
    const ics = buildICSFile([event]);
    expect(ics).toContain('UID:my-unique-uid@domain.com');
  });
});

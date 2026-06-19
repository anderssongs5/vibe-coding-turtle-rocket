import { buildICSFile } from '../utils/icsBuilder';
import type { OptimizedEvent } from '../types';

function makeEvent(
  uid: string,
  summary: string,
  startHour: number,
  moved = false,
): OptimizedEvent {
  const newStart = new Date(`2024-01-01T${String(startHour).padStart(2, '0')}:00:00Z`);
  const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);
  return {
    uid, summary,
    start: newStart, end: newEnd,
    newStart, newEnd, moved,
    cognitiveLoad: 'medium',
  };
}

describe('buildICSFile', () => {
  it('starts with BEGIN:VCALENDAR and ends with END:VCALENDAR', () => {
    const ics = buildICSFile([makeEvent('uid1', 'Meeting', 9)]);
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  });

  it('includes VERSION:2.0 and PRODID', () => {
    const ics = buildICSFile([]);
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:');
  });

  it('includes CALSCALE:GREGORIAN', () => {
    const ics = buildICSFile([]);
    expect(ics).toContain('CALSCALE:GREGORIAN');
  });

  it('generates a VEVENT for each event', () => {
    const ics = buildICSFile([
      makeEvent('uid1', 'Meeting', 9),
      makeEvent('uid2', 'Lunch', 12),
    ]);
    const matches = ics.match(/BEGIN:VEVENT/g) ?? [];
    expect(matches).toHaveLength(2);
  });

  it('preserves the original UID', () => {
    const ics = buildICSFile([makeEvent('my-unique-uid@test', 'Event', 10)]);
    expect(ics).toContain('UID:my-unique-uid@test');
  });

  it('uses newStart/newEnd for DTSTART/DTEND', () => {
    const ics = buildICSFile([makeEvent('uid1', 'Event', 9)]);
    expect(ics).toContain('DTSTART:20240101T090000Z');
    expect(ics).toContain('DTEND:20240101T100000Z');
  });

  it('adds X-TURTLEROCKET-OPTIMIZED:TRUE only for moved events', () => {
    const ics = buildICSFile([
      makeEvent('uid1', 'Moved', 9, true),
      makeEvent('uid2', 'Stayed', 10, false),
    ]);
    const count = (ics.match(/X-TURTLEROCKET-OPTIMIZED:TRUE/g) ?? []).length;
    expect(count).toBe(1);
  });

  it('escapes backslashes in summary', () => {
    const ics = buildICSFile([makeEvent('uid1', 'Path\\To\\File', 9)]);
    expect(ics).toContain('SUMMARY:Path\\\\To\\\\File');
  });

  it('escapes semicolons in summary', () => {
    const ics = buildICSFile([makeEvent('uid1', 'A;B', 9)]);
    expect(ics).toContain('SUMMARY:A\\;B');
  });

  it('folds lines longer than 75 characters', () => {
    const longSummary = 'A'.repeat(100);
    const ics = buildICSFile([makeEvent('uid1', longSummary, 9)]);
    const lines = ics.split('\r\n');
    lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(75));
  });

  it('uses CRLF line endings', () => {
    const ics = buildICSFile([makeEvent('uid1', 'Event', 9)]);
    expect(ics).toContain('\r\n');
  });

  it('returns valid ICS for empty event list', () => {
    const ics = buildICSFile([]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});

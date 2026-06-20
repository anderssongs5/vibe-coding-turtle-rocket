import { parseICSFile } from '../utils/icsParser';
import { classifyEvents } from '../utils/classifier';
import { optimizeSchedule } from '../utils/optimizer';
import { buildICSFile } from '../utils/icsBuilder';
import { makeLargeICSContent, makeEnergyLevels, resetFactoryCounter } from '../test-utils/factories';
import type { ClassifiedEvent } from '../types';

beforeEach(() => resetFactoryCounter());

function makeLargeClassifiedEvents(count: number): ClassifiedEvent[] {
  const loads = ['heavy', 'medium', 'light'] as const;
  return Array.from({ length: count }, (_, i) => ({
    uid: `perf-event-${i}@test`,
    summary: `Event ${i}`,
    start: new Date(2024, 0, 15, 8 + (i % 12), 0),
    end: new Date(2024, 0, 15, 8 + (i % 12), 30),
    cognitiveLoad: loads[i % 3],
  }));
}

test('parses 1000 events in under 1 second', () => {
  const ics = makeLargeICSContent(1000);
  const start = Date.now();
  const events = parseICSFile(ics);
  const elapsed = Date.now() - start;
  expect(events.length).toBeGreaterThan(0);
  expect(elapsed).toBeLessThan(1000);
});

test('classifies 1000 events in under 500ms', () => {
  const events = makeLargeClassifiedEvents(1000).map(({ cognitiveLoad: _cl, ...e }) => e);
  const start = Date.now();
  const classified = classifyEvents(events);
  const elapsed = Date.now() - start;
  expect(classified).toHaveLength(1000);
  expect(elapsed).toBeLessThan(500);
});

test('optimizes 1000 classified events in under 500ms', () => {
  const events = makeLargeClassifiedEvents(1000);
  const energyLevels = makeEnergyLevels('medium');
  const start = Date.now();
  const optimized = optimizeSchedule(events, energyLevels);
  const elapsed = Date.now() - start;
  expect(optimized).toHaveLength(1000);
  expect(elapsed).toBeLessThan(500);
});

test('builds ICS from 100 optimized events in under 1 second', () => {
  const events = makeLargeClassifiedEvents(100).map((e) => ({
    ...e,
    newStart: e.start,
    newEnd: e.end,
    moved: false,
  }));
  const start = Date.now();
  const ics = buildICSFile(events);
  const elapsed = Date.now() - start;
  expect(ics).toContain('BEGIN:VCALENDAR');
  expect(ics).toContain('END:VCALENDAR');
  expect(elapsed).toBeLessThan(1000);
});

test('full pipeline: parse → classify → optimize → build ICS in under 2 seconds', () => {
  const ics = makeLargeICSContent(500);
  const start = Date.now();
  const parsed = parseICSFile(ics);
  const classified = classifyEvents(parsed);
  const optimized = optimizeSchedule(classified, makeEnergyLevels('medium'));
  const output = buildICSFile(optimized);
  const elapsed = Date.now() - start;
  expect(output).toContain('BEGIN:VCALENDAR');
  expect(elapsed).toBeLessThan(2000);
});

import { optimizeSchedule } from '../utils/optimizer';
import type { ClassifiedEvent, EnergyLevel } from '../types';

function makeEvent(
  uid: string,
  summary: string,
  startHour: number,
  durationHours: number,
  cognitiveLoad: 'heavy' | 'medium' | 'light',
): ClassifiedEvent {
  const start = new Date(`2024-01-01T${String(startHour).padStart(2, '0')}:00:00`);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return { uid, summary, start, end, cognitiveLoad };
}

function allHigh(): EnergyLevel[] {
  return Array(12).fill('high') as EnergyLevel[];
}

function allLow(): EnergyLevel[] {
  return Array(12).fill('low') as EnergyLevel[];
}

function mixed(): EnergyLevel[] {
  // hours 8–11 high, 12–15 medium, 16–19 low
  return [
    'high', 'high', 'high', 'high',
    'medium', 'medium', 'medium', 'medium',
    'low', 'low', 'low', 'low',
  ] as EnergyLevel[];
}

describe('optimizeSchedule', () => {
  it('returns OptimizedEvent for every input event', () => {
    const events = [makeEvent('e1', 'Meeting', 9, 1, 'heavy')];
    const result = optimizeSchedule(events, allHigh());
    expect(result).toHaveLength(1);
    expect(result[0].uid).toBe('e1');
  });

  it('places heavy event in a high-energy slot', () => {
    const events = [makeEvent('e1', 'Review', 16, 1, 'heavy')]; // starts in low slot
    const result = optimizeSchedule(events, mixed());
    expect(result[0].newStart.getHours()).toBeLessThanOrEqual(11); // hours 8–11 are high
  });

  it('places light event in a low-energy slot', () => {
    const events = [makeEvent('e1', 'Lunch', 9, 1, 'light')]; // starts in high slot
    const result = optimizeSchedule(events, mixed());
    expect(result[0].newStart.getHours()).toBeGreaterThanOrEqual(16); // hours 16–19 are low
  });

  it('preserves event duration', () => {
    const events = [makeEvent('e1', 'Planning', 9, 2, 'heavy')];
    const result = optimizeSchedule(events, allHigh());
    const dur = result[0].newEnd.getTime() - result[0].newStart.getTime();
    expect(dur).toBe(2 * 60 * 60 * 1000);
  });

  it('marks moved events with moved=true', () => {
    const events = [makeEvent('e1', 'Review', 16, 1, 'heavy')]; // 16 is low, should move
    const result = optimizeSchedule(events, mixed());
    expect(result[0].moved).toBe(true);
  });

  it('marks unmoved events with moved=false', () => {
    const events = [makeEvent('e1', 'Review', 8, 1, 'heavy')]; // 8 is high → stays
    const result = optimizeSchedule(events, mixed());
    expect(result[0].moved).toBe(false);
  });

  it('out-of-range events pass through unchanged', () => {
    const event = makeEvent('e1', 'Early call', 6, 1, 'heavy');
    const result = optimizeSchedule([event], mixed());
    expect(result[0].newStart.getHours()).toBe(6);
    expect(result[0].moved).toBe(false);
  });

  it('returns empty array for empty input', () => {
    expect(optimizeSchedule([], allHigh())).toEqual([]);
  });

  it('handles no suitable energy slots gracefully (falls back)', () => {
    const events = [makeEvent('e1', 'Meeting', 9, 1, 'heavy')];
    // All low — no high slots, should still assign something
    const result = optimizeSchedule(events, allLow());
    expect(result[0].newStart).toBeDefined();
  });

  it('no two events are assigned the same hour slot', () => {
    const events = [
      makeEvent('e1', 'Meeting A', 8, 1, 'heavy'),
      makeEvent('e2', 'Meeting B', 9, 1, 'heavy'),
    ];
    const result = optimizeSchedule(events, allHigh());
    const hours = result.map((e) => e.newStart.getHours());
    expect(new Set(hours).size).toBe(hours.length);
  });
});

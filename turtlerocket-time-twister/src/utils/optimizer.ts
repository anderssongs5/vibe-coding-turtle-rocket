import type { ClassifiedEvent, OptimizedEvent, EnergyLevel } from '../types';
import type { CognitiveLoad } from '../types/classification';
import { createTimeSlotMap, getAvailableSlots, isInRange } from './timeSlotMapper';

const LOAD_ORDER: CognitiveLoad[] = ['heavy', 'medium', 'light'];
const LOAD_TO_ENERGY: Record<CognitiveLoad, EnergyLevel> = {
  heavy: 'high',
  medium: 'medium',
  light: 'low',
};

function setHour(date: Date, hour: number): Date {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function durationMs(event: ClassifiedEvent): number {
  return event.end.getTime() - event.start.getTime();
}

export function optimizeSchedule(
  events: ClassifiedEvent[],
  energyLevels: EnergyLevel[],
): OptimizedEvent[] {
  const slotMap = createTimeSlotMap(energyLevels);

  // Events outside range pass through unchanged
  const inRange = events.filter((e) => isInRange(e.start.getHours()));
  const outOfRange = events.filter((e) => !isInRange(e.start.getHours()));

  // Build a pool of available slots (each hour used at most once)
  const usedSlots = new Set<number>();

  function pickSlot(load: CognitiveLoad): number | null {
    const preferredEnergy = LOAD_TO_ENERGY[load];
    const preferred = getAvailableSlots(slotMap, preferredEnergy).filter((h) => !usedSlots.has(h));
    if (preferred.length > 0) return preferred[0];
    // Fallback: any unused slot
    const any = getAvailableSlots(slotMap, 'high')
      .concat(getAvailableSlots(slotMap, 'medium'))
      .concat(getAvailableSlots(slotMap, 'low'))
      .filter((h) => !usedSlots.has(h));
    return any.length > 0 ? any[0] : null;
  }

  // Sort by cognitive load priority, preserve original order within group
  const sorted = [...inRange].sort(
    (a, b) => LOAD_ORDER.indexOf(a.cognitiveLoad) - LOAD_ORDER.indexOf(b.cognitiveLoad),
  );

  const optimized: OptimizedEvent[] = sorted.map((event) => {
    const slot = pickSlot(event.cognitiveLoad);
    if (slot === null) {
      return { ...event, newStart: event.start, newEnd: event.end, moved: false };
    }
    usedSlots.add(slot);
    const newStart = setHour(event.start, slot);
    const newEnd = new Date(newStart.getTime() + durationMs(event));
    const moved = slot !== event.start.getHours();
    return { ...event, newStart, newEnd, moved };
  });

  const passThrough: OptimizedEvent[] = outOfRange.map((e) => ({
    ...e,
    newStart: e.start,
    newEnd: e.end,
    moved: false,
  }));

  return [...optimized, ...passThrough];
}

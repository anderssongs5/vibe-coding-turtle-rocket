import type { EnergyLevel } from '../types/energy';

export type TimeSlotMap = Map<number, EnergyLevel>; // hour (8–19) → energy level

const MIN_HOUR = 8;
const MAX_HOUR = 19;

export function createTimeSlotMap(energyLevels: EnergyLevel[]): TimeSlotMap {
  const map: TimeSlotMap = new Map();
  for (let i = 0; i < energyLevels.length; i++) {
    map.set(MIN_HOUR + i, energyLevels[i]);
  }
  return map;
}

export function getAvailableSlots(map: TimeSlotMap, energy: EnergyLevel): number[] {
  const slots: number[] = [];
  for (const [hour, level] of map.entries()) {
    if (level === energy) slots.push(hour);
  }
  return slots.sort((a, b) => a - b);
}

export function isSlotAvailable(map: TimeSlotMap, hour: number): boolean {
  return map.has(hour);
}

export function hourToIndex(hour: number): number {
  return hour - MIN_HOUR;
}

export function indexToHour(index: number): number {
  return MIN_HOUR + index;
}

export function isInRange(hour: number): boolean {
  return hour >= MIN_HOUR && hour <= MAX_HOUR;
}

export function durationHours(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

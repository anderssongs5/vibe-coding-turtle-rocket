import type { EnergyLevel } from '../types/energy';

const MIN_HOUR = 8;
const MAX_HOUR = 19;

export function initializeEnergyLevels(): EnergyLevel[] {
  return Array(12).fill('medium') as EnergyLevel[];
}

export function updateEnergyAt(
  levels: EnergyLevel[],
  hour: number,
  energy: EnergyLevel,
): EnergyLevel[] {
  const index = hour - MIN_HOUR;
  if (index < 0 || index >= levels.length) return levels;
  const next = [...levels];
  next[index] = energy;
  return next;
}

export function getEnergyAt(levels: EnergyLevel[], hour: number): EnergyLevel | null {
  const index = hour - MIN_HOUR;
  if (index < 0 || index > MAX_HOUR - MIN_HOUR) return null;
  return levels[index];
}

export function resetEnergyLevels(): EnergyLevel[] {
  return initializeEnergyLevels();
}

export function cycleEnergyLevel(current: EnergyLevel): EnergyLevel {
  const order: EnergyLevel[] = ['low', 'medium', 'high'];
  return order[(order.indexOf(current) + 1) % order.length];
}

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface TimeSlot {
  hour: number; // 8–19
  energy: EnergyLevel;
}

export const ENERGY_HOURS = Array.from({ length: 12 }, (_, i) => ({
  hour: 8 + i,
  label: `${8 + i}:00`,
}));

export const EnergyEmoji: Record<EnergyLevel, string> = {
  low: '🐢',
  medium: '😐',
  high: '🚀',
};

export const EnergyColors: Record<EnergyLevel, string> = {
  low: '#6B9BD2',
  medium: '#F6C64F',
  high: '#E85D5D',
};

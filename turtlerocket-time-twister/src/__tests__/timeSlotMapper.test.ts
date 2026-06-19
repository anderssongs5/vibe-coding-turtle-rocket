import {
  createTimeSlotMap,
  getAvailableSlots,
  isSlotAvailable,
  hourToIndex,
  indexToHour,
  isInRange,
  durationHours,
} from '../utils/timeSlotMapper';
import { initializeEnergyLevels } from '../utils/energyHelpers';
import type { EnergyLevel } from '../types/energy';

describe('createTimeSlotMap', () => {
  it('creates a map with 12 entries for hours 8–19', () => {
    const map = createTimeSlotMap(initializeEnergyLevels());
    expect(map.size).toBe(12);
    expect(map.has(8)).toBe(true);
    expect(map.has(19)).toBe(true);
    expect(map.has(7)).toBe(false);
    expect(map.has(20)).toBe(false);
  });

  it('maps each hour to the correct energy level', () => {
    const levels: EnergyLevel[] = Array(12).fill('medium') as EnergyLevel[];
    levels[0] = 'high'; // hour 8
    levels[11] = 'low'; // hour 19
    const map = createTimeSlotMap(levels);
    expect(map.get(8)).toBe('high');
    expect(map.get(19)).toBe('low');
    expect(map.get(9)).toBe('medium');
  });
});

describe('getAvailableSlots', () => {
  it('returns all hours matching the requested energy', () => {
    const levels: EnergyLevel[] = Array(12).fill('medium') as EnergyLevel[];
    levels[0] = 'high'; // 8
    levels[2] = 'high'; // 10
    const map = createTimeSlotMap(levels);
    expect(getAvailableSlots(map, 'high')).toEqual([8, 10]);
  });

  it('returns hours in ascending order', () => {
    const map = createTimeSlotMap(initializeEnergyLevels());
    const slots = getAvailableSlots(map, 'medium');
    expect(slots).toEqual([...slots].sort((a, b) => a - b));
  });

  it('returns empty array when no slots match', () => {
    const map = createTimeSlotMap(initializeEnergyLevels()); // all medium
    expect(getAvailableSlots(map, 'high')).toEqual([]);
  });
});

describe('isSlotAvailable', () => {
  it('returns true for hours 8–19', () => {
    const map = createTimeSlotMap(initializeEnergyLevels());
    expect(isSlotAvailable(map, 8)).toBe(true);
    expect(isSlotAvailable(map, 19)).toBe(true);
  });

  it('returns false for hours outside 8–19', () => {
    const map = createTimeSlotMap(initializeEnergyLevels());
    expect(isSlotAvailable(map, 7)).toBe(false);
    expect(isSlotAvailable(map, 20)).toBe(false);
  });
});

describe('hourToIndex / indexToHour', () => {
  it('converts hour 8 to index 0', () => {
    expect(hourToIndex(8)).toBe(0);
    expect(indexToHour(0)).toBe(8);
  });

  it('converts hour 19 to index 11', () => {
    expect(hourToIndex(19)).toBe(11);
    expect(indexToHour(11)).toBe(19);
  });

  it('round-trips correctly', () => {
    for (let h = 8; h <= 19; h++) {
      expect(indexToHour(hourToIndex(h))).toBe(h);
    }
  });
});

describe('isInRange', () => {
  it('returns true for hours 8–19', () => {
    expect(isInRange(8)).toBe(true);
    expect(isInRange(19)).toBe(true);
    expect(isInRange(13)).toBe(true);
  });

  it('returns false outside 8–19', () => {
    expect(isInRange(7)).toBe(false);
    expect(isInRange(20)).toBe(false);
  });
});

describe('durationHours', () => {
  it('calculates 1-hour duration', () => {
    const start = new Date('2024-01-01T09:00:00');
    const end = new Date('2024-01-01T10:00:00');
    expect(durationHours(start, end)).toBe(1);
  });

  it('calculates fractional duration', () => {
    const start = new Date('2024-01-01T09:00:00');
    const end = new Date('2024-01-01T09:30:00');
    expect(durationHours(start, end)).toBe(0.5);
  });
});

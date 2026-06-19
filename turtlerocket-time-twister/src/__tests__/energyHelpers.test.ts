import {
  initializeEnergyLevels,
  updateEnergyAt,
  getEnergyAt,
  resetEnergyLevels,
  cycleEnergyLevel,
} from '../utils/energyHelpers';

describe('cycleEnergyLevel', () => {
  it('cycles low → medium → high → low', () => {
    expect(cycleEnergyLevel('low')).toBe('medium');
    expect(cycleEnergyLevel('medium')).toBe('high');
    expect(cycleEnergyLevel('high')).toBe('low');
  });
});

describe('initializeEnergyLevels', () => {
  it('returns 12 slots all set to medium', () => {
    const levels = initializeEnergyLevels();
    expect(levels).toHaveLength(12);
    levels.forEach((l) => expect(l).toBe('medium'));
  });

  it('returns a new array on each call', () => {
    expect(initializeEnergyLevels()).not.toBe(initializeEnergyLevels());
  });
});

describe('resetEnergyLevels', () => {
  it('returns a fresh all-medium array regardless of prior state', () => {
    const levels = resetEnergyLevels();
    expect(levels).toHaveLength(12);
    levels.forEach((l) => expect(l).toBe('medium'));
  });
});

describe('updateEnergyAt', () => {
  it('updates the correct slot by hour without mutating the original', () => {
    const levels = initializeEnergyLevels();
    const next = updateEnergyAt(levels, 8, 'high');
    expect(next[0]).toBe('high');
    expect(levels[0]).toBe('medium');
  });

  it('updates the last valid hour (19)', () => {
    const levels = initializeEnergyLevels();
    const next = updateEnergyAt(levels, 19, 'low');
    expect(next[11]).toBe('low');
  });

  it('returns the original array for hour below 8', () => {
    const levels = initializeEnergyLevels();
    expect(updateEnergyAt(levels, 7, 'high')).toBe(levels);
  });

  it('returns the original array for hour above 19', () => {
    const levels = initializeEnergyLevels();
    expect(updateEnergyAt(levels, 20, 'high')).toBe(levels);
  });
});

describe('getEnergyAt', () => {
  it('returns the energy level for the first valid hour (8)', () => {
    const levels = initializeEnergyLevels();
    expect(getEnergyAt(levels, 8)).toBe('medium');
  });

  it('returns the energy level for the last valid hour (19)', () => {
    const levels = initializeEnergyLevels();
    expect(getEnergyAt(levels, 19)).toBe('medium');
  });

  it('reflects a prior update', () => {
    const levels = updateEnergyAt(initializeEnergyLevels(), 12, 'high');
    expect(getEnergyAt(levels, 12)).toBe('high');
  });

  it('returns null for hour below 8', () => {
    expect(getEnergyAt(initializeEnergyLevels(), 7)).toBeNull();
  });

  it('returns null for hour above 19', () => {
    expect(getEnergyAt(initializeEnergyLevels(), 20)).toBeNull();
  });
});

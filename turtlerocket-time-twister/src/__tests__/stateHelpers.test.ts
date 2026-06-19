import {
  createInitialState,
  updateEnergyLevel,
  setUploadedEvents,
  setClassifiedEvents,
  setOptimizedEvents,
  setProcessing,
} from '../utils/stateHelpers';
import type { CalendarEvent, ClassifiedEvent, OptimizedEvent } from '../types';

describe('createInitialState', () => {
  it('returns 12 energy slots all set to medium', () => {
    const state = createInitialState();
    expect(state.energyLevels).toHaveLength(12);
    state.energyLevels.forEach((level) => expect(level).toBe('medium'));
  });

  it('returns empty event arrays', () => {
    const state = createInitialState();
    expect(state.uploadedEvents).toEqual([]);
    expect(state.classifiedEvents).toEqual([]);
    expect(state.optimizedEvents).toEqual([]);
  });

  it('returns isProcessing false', () => {
    const state = createInitialState();
    expect(state.isProcessing).toBe(false);
  });
});

describe('updateEnergyLevel', () => {
  it('updates a single slot without mutating the original', () => {
    const state = createInitialState();
    const next = updateEnergyLevel(state, 0, 'high');
    expect(next.energyLevels[0]).toBe('high');
    expect(state.energyLevels[0]).toBe('medium');
  });

  it('only changes the targeted index', () => {
    const state = createInitialState();
    const next = updateEnergyLevel(state, 5, 'low');
    expect(next.energyLevels[5]).toBe('low');
    next.energyLevels.forEach((level, i) => {
      if (i !== 5) expect(level).toBe('medium');
    });
  });
});

describe('setUploadedEvents', () => {
  it('replaces uploadedEvents without mutating original', () => {
    const state = createInitialState();
    const events: CalendarEvent[] = [
      { uid: '1', summary: 'Test', start: new Date(), end: new Date() },
    ];
    const next = setUploadedEvents(state, events);
    expect(next.uploadedEvents).toEqual(events);
    expect(state.uploadedEvents).toEqual([]);
  });
});

describe('setClassifiedEvents', () => {
  it('replaces classifiedEvents without mutating original', () => {
    const state = createInitialState();
    const events: ClassifiedEvent[] = [
      { uid: '1', summary: 'Review', start: new Date(), end: new Date(), cognitiveLoad: 'heavy' },
    ];
    const next = setClassifiedEvents(state, events);
    expect(next.classifiedEvents).toEqual(events);
    expect(state.classifiedEvents).toEqual([]);
  });
});

describe('setOptimizedEvents', () => {
  it('replaces optimizedEvents without mutating original', () => {
    const state = createInitialState();
    const now = new Date();
    const events: OptimizedEvent[] = [
      {
        uid: '1',
        summary: 'Review',
        start: now,
        end: now,
        cognitiveLoad: 'heavy',
        newStart: now,
        newEnd: now,
        moved: false,
      },
    ];
    const next = setOptimizedEvents(state, events);
    expect(next.optimizedEvents).toEqual(events);
    expect(state.optimizedEvents).toEqual([]);
  });
});

describe('setProcessing', () => {
  it('toggles isProcessing without mutating original', () => {
    const state = createInitialState();
    const next = setProcessing(state, true);
    expect(next.isProcessing).toBe(true);
    expect(state.isProcessing).toBe(false);
  });
});

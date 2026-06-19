import type { AppState, CalendarEvent, ClassifiedEvent, OptimizedEvent, EnergyLevel } from '../types';

export function createInitialState(): AppState {
  return {
    energyLevels: Array(12).fill('medium') as EnergyLevel[],
    uploadedEvents: [],
    classifiedEvents: [],
    optimizedEvents: [],
    isProcessing: false,
  };
}

export function updateEnergyLevel(state: AppState, index: number, level: EnergyLevel): AppState {
  const energyLevels = [...state.energyLevels];
  energyLevels[index] = level;
  return { ...state, energyLevels };
}

export function setUploadedEvents(state: AppState, events: CalendarEvent[]): AppState {
  return { ...state, uploadedEvents: events };
}

export function setClassifiedEvents(state: AppState, events: ClassifiedEvent[]): AppState {
  return { ...state, classifiedEvents: events };
}

export function setOptimizedEvents(state: AppState, events: OptimizedEvent[]): AppState {
  return { ...state, optimizedEvents: events };
}

export function setProcessing(state: AppState, isProcessing: boolean): AppState {
  return { ...state, isProcessing };
}

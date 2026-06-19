import type { CognitiveLoad } from './classification';
import type { EnergyLevel } from './energy';

export type { CognitiveLoad, EnergyLevel };

export interface CalendarEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date;
}

export interface ClassifiedEvent extends CalendarEvent {
  cognitiveLoad: CognitiveLoad;
}

export interface OptimizedEvent extends ClassifiedEvent {
  newStart: Date;
  newEnd: Date;
  moved: boolean;
}

export interface AppState {
  energyLevels: EnergyLevel[];
  uploadedEvents: CalendarEvent[];
  classifiedEvents: ClassifiedEvent[];
  optimizedEvents: OptimizedEvent[];
  isProcessing: boolean;
}


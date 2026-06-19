export type EnergyLevel = 'low' | 'medium' | 'high';

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

export type { CognitiveLoad } from './classification';

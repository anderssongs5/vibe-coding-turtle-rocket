import { HEAVY_KEYWORDS, LIGHT_KEYWORDS } from '../config/keywords';
import type { CalendarEvent, ClassifiedEvent } from '../types';
import type { CognitiveLoad, ClassificationResult } from '../types/classification';

export function getMatchedKeywords(summary: string): ClassificationResult {
  const lower = summary.toLowerCase();

  const heavyMatches = HEAVY_KEYWORDS.filter((kw) => lower.includes(kw));
  if (heavyMatches.length > 0) {
    return { cognitiveLoad: 'heavy', matchedKeywords: heavyMatches };
  }

  const lightMatches = LIGHT_KEYWORDS.filter((kw) => lower.includes(kw));
  if (lightMatches.length > 0) {
    return { cognitiveLoad: 'light', matchedKeywords: lightMatches };
  }

  return { cognitiveLoad: 'medium', matchedKeywords: [] };
}

export function classifyEvent(event: CalendarEvent): ClassifiedEvent {
  const { cognitiveLoad } = getMatchedKeywords(event.summary);
  return { ...event, cognitiveLoad };
}

export function classifyEvents(events: CalendarEvent[]): ClassifiedEvent[] {
  return events.map(classifyEvent);
}

export { CognitiveLoad };

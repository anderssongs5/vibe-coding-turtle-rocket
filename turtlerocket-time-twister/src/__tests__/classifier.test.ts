import { classifyEvent, classifyEvents, getMatchedKeywords } from '../utils/classifier';
import type { CalendarEvent } from '../types';

const now = new Date('2024-01-01T09:00:00');
const later = new Date('2024-01-01T10:00:00');

function makeEvent(summary: string, uid = 'uid-1'): CalendarEvent {
  return { uid, summary, start: now, end: later };
}

describe('getMatchedKeywords', () => {
  it('classifies heavy keyword correctly', () => {
    const result = getMatchedKeywords('Weekly team meeting');
    expect(result.cognitiveLoad).toBe('heavy');
    expect(result.matchedKeywords).toContain('meeting');
  });

  it('classifies light keyword correctly', () => {
    const result = getMatchedKeywords('Lunch with team');
    expect(result.cognitiveLoad).toBe('light');
    expect(result.matchedKeywords).toContain('lunch');
  });

  it('defaults to medium when no keywords match', () => {
    const result = getMatchedKeywords('1:1 with manager');
    expect(result.cognitiveLoad).toBe('medium');
    expect(result.matchedKeywords).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    expect(getMatchedKeywords('MEETING with CEO').cognitiveLoad).toBe('heavy');
    expect(getMatchedKeywords('LUNCH Break').cognitiveLoad).toBe('light');
  });

  it('partial-word matches work (meetings → meeting)', () => {
    expect(getMatchedKeywords('All hands meetings').cognitiveLoad).toBe('heavy');
  });

  it('heavy takes precedence over light when both match', () => {
    // "review" is heavy, "optional" is light
    const result = getMatchedKeywords('Optional review session');
    expect(result.cognitiveLoad).toBe('heavy');
  });

  it('returns all matching keywords', () => {
    const result = getMatchedKeywords('Sprint planning meeting');
    expect(result.cognitiveLoad).toBe('heavy');
    expect(result.matchedKeywords.length).toBeGreaterThanOrEqual(2);
  });

  it('handles empty title gracefully', () => {
    const result = getMatchedKeywords('');
    expect(result.cognitiveLoad).toBe('medium');
    expect(result.matchedKeywords).toHaveLength(0);
  });
});

describe('classifyEvent', () => {
  it('adds cognitiveLoad to the event', () => {
    const event = makeEvent('Budget review');
    const classified = classifyEvent(event);
    expect(classified.cognitiveLoad).toBe('heavy');
    expect(classified.uid).toBe('uid-1');
  });

  it('preserves all original event fields', () => {
    const event = makeEvent('Coffee break');
    const classified = classifyEvent(event);
    expect(classified.summary).toBe('Coffee break');
    expect(classified.start).toBe(now);
    expect(classified.end).toBe(later);
  });
});

describe('classifyEvents', () => {
  it('classifies a batch of events', () => {
    const events = [
      makeEvent('Strategy meeting', 'uid-1'),
      makeEvent('Lunch with client', 'uid-2'),
      makeEvent('1:1 catchup', 'uid-3'),
    ];
    const classified = classifyEvents(events);
    expect(classified).toHaveLength(3);
    expect(classified[0].cognitiveLoad).toBe('heavy');
    expect(classified[1].cognitiveLoad).toBe('light');
    expect(classified[2].cognitiveLoad).toBe('medium');
  });

  it('returns empty array for empty input', () => {
    expect(classifyEvents([])).toEqual([]);
  });
});

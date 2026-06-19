import ICAL from 'ical.js';
import type { CalendarEvent } from '../types';

const MIN_HOUR = 8;
const MAX_HOUR = 20; // exclusive upper bound (events ending at 20:00 are included)

function isInDayRange(date: Date): boolean {
  const h = date.getHours();
  return h >= MIN_HOUR && h < MAX_HOUR;
}

export function parseICSFile(content: string): CalendarEvent[] {
  let parsed: ICAL.Component;
  try {
    parsed = new ICAL.Component(ICAL.parse(content));
  } catch {
    throw new Error('Failed to parse ICS file: invalid format');
  }

  const vevents = parsed.getAllSubcomponents('vevent');
  const events: CalendarEvent[] = [];

  for (const vevent of vevents) {
    const icalEvent = new ICAL.Event(vevent);

    const dtstart = vevent.getFirstPropertyValue('dtstart') as ICAL.Time | null;
    const dtend = vevent.getFirstPropertyValue('dtend') as ICAL.Time | null;
    const summary = (vevent.getFirstPropertyValue('summary') as string | null) ?? '(No title)';
    const uid = (vevent.getFirstPropertyValue('uid') as string | null) ?? icalEvent.uid ?? '';

    if (!dtstart || !dtend) continue;

    // Skip all-day events (DATE values have no time component)
    if (dtstart.isDate) continue;

    const start = dtstart.toJSDate();
    const end = dtend.toJSDate();

    // Skip events outside 8 AM – 8 PM window
    if (!isInDayRange(start)) continue;

    events.push({ uid, summary, start, end });
  }

  return events;
}

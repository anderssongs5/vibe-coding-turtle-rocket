import type { OptimizedEvent } from '../types';

const FOLD_LENGTH = 75;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatICSDate(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function foldLine(line: string): string {
  if (line.length <= FOLD_LENGTH) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.slice(0, FOLD_LENGTH));
  remaining = remaining.slice(FOLD_LENGTH);
  while (remaining.length > 0) {
    parts.push(' ' + remaining.slice(0, FOLD_LENGTH - 1));
    remaining = remaining.slice(FOLD_LENGTH - 1);
  }
  return parts.join('\r\n');
}

function buildVEvent(event: OptimizedEvent): string {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${escapeText(event.uid)}`,
    `SUMMARY:${escapeText(event.summary)}`,
    `DTSTART:${formatICSDate(event.newStart)}`,
    `DTEND:${formatICSDate(event.newEnd)}`,
  ];
  if (event.moved) lines.push('X-TURTLEROCKET-OPTIMIZED:TRUE');
  lines.push('END:VEVENT');
  return lines.map(foldLine).join('\r\n');
}

export function buildICSFile(events: OptimizedEvent[]): string {
  const vevents = events.map(buildVEvent).join('\r\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TurtleRocket Time Twister//EN',
    'CALSCALE:GREGORIAN',
    vevents,
    'END:VCALENDAR',
  ].join('\r\n');
}

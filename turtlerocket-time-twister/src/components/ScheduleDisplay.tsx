import React from 'react';
import type { CalendarEvent, ClassifiedEvent, EnergyLevel } from '../types';
import type { CognitiveLoad } from '../types/classification';
import { ENERGY_HOURS } from '../types/energy';
import { EnergyColors } from '../types/energy';
import styles from './ScheduleDisplay.module.css';

const LOAD_COLORS: Record<CognitiveLoad, string> = {
  heavy: '#E85D5D',
  medium: '#F6C64F',
  light: '#6B9BD2',
};

const GRID_START = 8;
const GRID_END = 20;
const GRID_HOURS = GRID_END - GRID_START; // 12

interface Props {
  events: (CalendarEvent | ClassifiedEvent)[];
  showEnergyLevels?: boolean;
  energyLevels?: EnergyLevel[];
  title?: string;
}

function isCognitive(e: CalendarEvent | ClassifiedEvent): e is ClassifiedEvent {
  return 'cognitiveLoad' in e;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function eventTop(start: Date): number {
  const h = start.getHours() + start.getMinutes() / 60;
  return ((h - GRID_START) / GRID_HOURS) * 100;
}

function eventHeight(start: Date, end: Date): number {
  const dur = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return (dur / GRID_HOURS) * 100;
}

export function ScheduleDisplay({ events, showEnergyLevels, energyLevels, title }: Props) {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.grid}>
        {/* Hour markers */}
        <div className={styles.hours} aria-hidden="true">
          {ENERGY_HOURS.map((slot) => (
            <div key={slot.hour} className={styles.hourLabel}>
              {slot.label}
            </div>
          ))}
        </div>

        {/* Event area */}
        <div className={styles.eventArea} role="list" aria-label={title ?? 'Schedule'}>
          {/* Energy level backgrounds */}
          {showEnergyLevels && energyLevels &&
            ENERGY_HOURS.map((slot, i) => (
              <div
                key={slot.hour}
                className={styles.energyBg}
                style={{
                  top: `${(i / GRID_HOURS) * 100}%`,
                  height: `${(1 / GRID_HOURS) * 100}%`,
                  backgroundColor: EnergyColors[energyLevels[i]] + '33',
                }}
                aria-hidden="true"
              />
            ))}

          {/* Hour grid lines */}
          {ENERGY_HOURS.map((slot, i) => (
            <div
              key={slot.hour}
              className={styles.gridLine}
              style={{ top: `${(i / GRID_HOURS) * 100}%` }}
              aria-hidden="true"
            />
          ))}

          {events.length === 0 && (
            <div className={styles.empty}>No events to display</div>
          )}

          {events.map((event) => {
            const load = isCognitive(event) ? event.cognitiveLoad : 'medium';
            const borderColor = LOAD_COLORS[load];
            const top = eventTop(event.start);
            const height = Math.max(eventHeight(event.start, event.end), 4);

            return (
              <div
                key={event.uid}
                role="listitem"
                className={styles.event}
                style={{
                  top: `${top}%`,
                  height: `${height}%`,
                  borderLeftColor: borderColor,
                }}
                aria-label={`${event.summary} at ${formatTime(event.start)}`}
              >
                <span className={styles.eventTime}>{formatTime(event.start)}</span>
                <span className={styles.eventTitle}>{event.summary}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

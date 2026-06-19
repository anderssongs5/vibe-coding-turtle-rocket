import React from 'react';
import type { OptimizedEvent } from '../types';
import styles from './ScheduleComparison.module.css';

interface Props {
  events: OptimizedEvent[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function timeDiffLabel(original: Date, newTime: Date): string {
  const diffMs = newTime.getTime() - original.getTime();
  const diffH = Math.round(diffMs / (1000 * 60 * 60));
  if (diffH === 0) return '';
  const abs = Math.abs(diffH);
  const dir = diffH < 0 ? 'earlier' : 'later';
  return `${abs}h ${dir}`;
}

function movementArrow(original: Date, newTime: Date): string {
  const diff = newTime.getTime() - original.getTime();
  if (diff < 0) return '↑';
  if (diff > 0) return '↓';
  return '';
}

export function ScheduleComparison({ events }: Props) {
  const moved = events.filter((e) => e.moved);
  const movedCount = moved.length;
  const totalShiftMs = moved.reduce(
    (sum, e) => sum + Math.abs(e.newStart.getTime() - e.start.getTime()),
    0,
  );
  const avgShiftH = movedCount > 0 ? Math.round(totalShiftMs / movedCount / (1000 * 60 * 60)) : 0;

  return (
    <section className={styles.container} aria-label="Schedule comparison">
      <h2 className={styles.heading}>Optimized Schedule</h2>

      <div className={styles.summary} aria-label="Optimization summary">
        <span>{movedCount} event{movedCount !== 1 ? 's' : ''} moved</span>
        {movedCount > 0 && <span>avg {avgShiftH}h shift</span>}
      </div>

      <div className={styles.columns}>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Original</h3>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Optimized</h3>
        </div>
      </div>

      <ul className={styles.eventList}>
        {events.map((event) => {
          const arrow = movementArrow(event.start, event.newStart);
          const diff = timeDiffLabel(event.start, event.newStart);
          return (
            <li key={event.uid} className={styles.eventRow} aria-label={`${event.summary} comparison`}>
              <div className={styles.original}>
                <span
                  className={event.moved ? styles.strikethrough : undefined}
                >
                  {formatTime(event.start)}
                </span>
                <span className={styles.eventName}>{event.summary}</span>
              </div>

              <div className={styles.arrow} aria-hidden="true">
                {arrow || '→'}
              </div>

              <div className={styles.optimized}>
                <span className={event.moved ? styles.bold : undefined}>
                  {formatTime(event.newStart)}
                </span>
                {diff && (
                  <span className={styles.diff} aria-label={diff}>
                    {diff}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import React from 'react';
import type { EnergyLevel } from '../types/energy';
import { ENERGY_HOURS, EnergyEmoji } from '../types/energy';
import { cycleEnergyLevel } from '../utils/energyHelpers';
import styles from './EnergySelector.module.css';

interface Props {
  energyLevels: EnergyLevel[];
  onEnergyChange: (index: number, level: EnergyLevel) => void;
  onReset: () => void;
}

export function EnergySelector({ energyLevels, onEnergyChange, onReset }: Props) {
  return (
    <section className={styles.container} aria-label="Energy levels">
      <div className={styles.header}>
        <h2 className={styles.title}>Your Energy Levels</h2>
        <button
          className={styles.resetBtn}
          onClick={onReset}
          type="button"
          title="Reset all hours to medium energy"
        >
          Reset to Default
        </button>
      </div>
      <div className={styles.grid} role="list">
        {ENERGY_HOURS.map((slot, index) => {
          const level = energyLevels[index];
          return (
            <button
              key={slot.hour}
              role="listitem"
              type="button"
              aria-label={`${slot.label} — ${level} energy`}
              title="Click to cycle energy: low → medium → high → low"
              className={`${styles.block} ${styles[level]}`}
              onClick={() => onEnergyChange(index, cycleEnergyLevel(level))}
            >
              <span className={styles.hour}>{slot.label}</span>
              <span className={styles.emoji} aria-hidden="true">{EnergyEmoji[level]}</span>
              <span className={styles.label}>{level}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

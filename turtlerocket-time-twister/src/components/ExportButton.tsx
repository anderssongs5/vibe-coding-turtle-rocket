import React, { useState } from 'react';
import type { OptimizedEvent } from '../types';
import { buildICSFile } from '../utils/icsBuilder';
import { downloadFile, generateFilename } from '../utils/download';
import styles from './ExportButton.module.css';

interface Props {
  events: OptimizedEvent[];
  isProcessing: boolean;
  disabled: boolean;
}

export function ExportButton({ events, isProcessing, disabled }: Props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setSuccess(false);
    setError(null);
    try {
      const ics = buildICSFile(events);
      downloadFile(ics, generateFilename());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to generate calendar file.');
    }
  }

  const isDisabled = disabled || isProcessing || events.length === 0;

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.btn} ${success ? styles.success : ''}`}
        onClick={handleExport}
        disabled={isDisabled}
        aria-label="Export optimized calendar"
      >
        {isProcessing ? 'Processing…' : success ? '✓ Downloaded' : '⬇ Export Calendar'}
      </button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

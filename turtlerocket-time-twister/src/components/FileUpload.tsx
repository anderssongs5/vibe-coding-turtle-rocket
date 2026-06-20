import React, { useRef, useEffect } from 'react';
import styles from './FileUpload.module.css';

interface Props {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
  selectedFileName?: string | null;
  onClear: () => void;
}

export function FileUpload({ onFileSelect, isProcessing, error, selectedFileName, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFileName) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClear();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedFileName]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  }

  return (
    <section className={styles.container} aria-label="Calendar file upload">
      <h2 className={styles.title}>Import Calendar</h2>
      <div className={styles.uploadArea}>
        <label className={styles.label} htmlFor="ics-input">
          {isProcessing ? 'Processing…' : 'Choose an .ics file'}
        </label>
        <input
          id="ics-input"
          ref={inputRef}
          type="file"
          accept=".ics,text/calendar"
          className={styles.input}
          disabled={isProcessing}
          onChange={handleChange}
          aria-describedby={error ? 'upload-error' : undefined}
        />
      </div>

      {selectedFileName && !error && (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{selectedFileName}</span>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Remove file"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <p id="upload-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

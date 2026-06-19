import React, { useState } from 'react';
import './App.css';
import { createInitialState, updateEnergyLevel, setProcessing } from './utils/stateHelpers';
import { resetEnergyLevels } from './utils/energyHelpers';
import { validateFileType, validateFileSize, checkICSFormat } from './utils/validation';
import { parseICSFile } from './utils/icsParser';
import { classifyEvents } from './utils/classifier';
import { optimizeSchedule } from './utils/optimizer';
import { setUploadedEvents, setClassifiedEvents, setOptimizedEvents } from './utils/stateHelpers';
import type { AppState, EnergyLevel } from './types';
import { EnergySelector } from './components/EnergySelector';
import { FileUpload } from './components/FileUpload';
import { ScheduleDisplay } from './components/ScheduleDisplay';
import { ScheduleComparison } from './components/ScheduleComparison';
import { ExportButton } from './components/ExportButton';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [appState, setAppState] = useState<AppState>(createInitialState);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  function handleEnergyChange(index: number, level: EnergyLevel) {
    setAppState((s) => updateEnergyLevel(s, index, level));
  }

  function handleEnergyReset() {
    setAppState((s) => ({ ...s, energyLevels: resetEnergyLevels() }));
  }

  function handleFileSelect(file: File) {
    setUploadError(null);

    if (!validateFileType(file)) {
      setUploadError('Please select a valid .ics calendar file.');
      return;
    }
    if (!validateFileSize(file)) {
      setUploadError('File is too large. Maximum size is 5 MB.');
      return;
    }

    setSelectedFileName(file.name);
    setAppState((s) => setProcessing(s, true));

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!checkICSFormat(content)) {
        setUploadError('File does not appear to be a valid ICS calendar.');
        setAppState((s) => setProcessing(s, false));
        return;
      }
      try {
        const events = parseICSFile(content);
        const classified = classifyEvents(events);
        setAppState((s) => {
          const withUploaded = setUploadedEvents(setProcessing(s, false), events);
          const withClassified = setClassifiedEvents(withUploaded, classified);
          const optimized = optimizeSchedule(classified, s.energyLevels);
          return setOptimizedEvents(withClassified, optimized);
        });
      } catch {
        setUploadError('Could not parse the calendar file.');
        setAppState((s) => setProcessing(s, false));
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the file.');
      setAppState((s) => setProcessing(s, false));
    };
    reader.readAsText(file);
  }

  function handleFileClear() {
    setSelectedFileName(null);
    setUploadError(null);
    setAppState((s) => ({ ...s, uploadedEvents: [], classifiedEvents: [], optimizedEvents: [] }));
  }

  const hasResults = appState.classifiedEvents.length > 0;

  return (
    <ErrorBoundary>
      <div className="app-wrapper">
        <div className="app-container">
          <h1>TurtleRocket Time Twister</h1>
          <p className="app-subtitle">
            Set your energy levels, upload a calendar, and get an optimized schedule.
          </p>

          <EnergySelector
            energyLevels={appState.energyLevels}
            onEnergyChange={handleEnergyChange}
            onReset={handleEnergyReset}
          />

          <FileUpload
            onFileSelect={handleFileSelect}
            isProcessing={appState.isProcessing}
            error={uploadError}
            selectedFileName={selectedFileName}
            onClear={handleFileClear}
          />

          {appState.isProcessing && (
            <p className="app-loading" aria-live="polite">Analyzing your calendar…</p>
          )}

          {hasResults && (
            <>
              <ScheduleDisplay
                events={appState.classifiedEvents}
                showEnergyLevels
                energyLevels={appState.energyLevels}
                title="Original Schedule"
              />
              <ScheduleComparison events={appState.optimizedEvents} />
              <ExportButton
                events={appState.optimizedEvents}
                isProcessing={appState.isProcessing}
                disabled={false}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

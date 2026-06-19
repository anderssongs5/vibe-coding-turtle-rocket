import React, { useState } from 'react';
import './App.css';
import { createInitialState, updateEnergyLevel, setProcessing } from './utils/stateHelpers';
import { resetEnergyLevels } from './utils/energyHelpers';
import { validateFileType, validateFileSize, checkICSFormat } from './utils/validation';
import { parseICSFile } from './utils/icsParser';
import { setUploadedEvents } from './utils/stateHelpers';
import type { AppState, EnergyLevel } from './types';
import { EnergySelector } from './components/EnergySelector';
import { FileUpload } from './components/FileUpload';

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
        setAppState((s) => setUploadedEvents(setProcessing(s, false), events));
      } catch {
        setUploadError('Could not parse the calendar file.');
        setAppState((s) => setProcessing(s, false));
      }
    };
    reader.readAsText(file);
  }

  function handleFileClear() {
    setSelectedFileName(null);
    setUploadError(null);
    setAppState((s) => ({ ...s, uploadedEvents: [], classifiedEvents: [], optimizedEvents: [] }));
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1>TurtleRocket Time Twister</h1>
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
      </div>
    </div>
  );
}

export default App;

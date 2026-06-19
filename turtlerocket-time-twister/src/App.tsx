import React, { useState } from 'react';
import './App.css';
import { createInitialState, updateEnergyLevel } from './utils/stateHelpers';
import { resetEnergyLevels } from './utils/energyHelpers';
import type { AppState, EnergyLevel } from './types';
import { EnergySelector } from './components/EnergySelector';

function App() {
  const [appState, setAppState] = useState<AppState>(createInitialState);

  function handleEnergyChange(index: number, level: EnergyLevel) {
    setAppState((s) => updateEnergyLevel(s, index, level));
  }

  function handleEnergyReset() {
    setAppState((s) => ({ ...s, energyLevels: resetEnergyLevels() }));
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
      </div>
    </div>
  );
}

export default App;

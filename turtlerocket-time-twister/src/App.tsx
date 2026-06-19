import React, { useState } from 'react';
import './App.css';
import { createInitialState } from './utils/stateHelpers';
import type { AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(createInitialState);

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1>TurtleRocket Time Twister</h1>
      </div>
    </div>
  );
}

export default App;

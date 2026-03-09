import React from 'react';
import { TelegramProvider } from './telegram/TelegramProvider';
import OrbitalView from './components/views/OrbitalView';

function App() {
  return (
    <TelegramProvider>
      <OrbitalView />
    </TelegramProvider>
  );
}

export default App;

/******************************************************************************
 * File: main.tsx
 * Layer: main
 * Desc: Application entry point with providers and global setup
 ******************************************************************************/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './core/styles/theme.css';
import { Provider } from 'react-redux';
import { store, persistor } from './core/store/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'virtual:svg-icons-register'; // SVG sprite plugin registration

// Telegram Apps SDK - Simple initialization
import { init } from '@telegram-apps/sdk-react';

// Initialize Telegram SDK
try {
  init();
  console.log('✅ Telegram SDK initialized');
} catch (error) {
  console.log('❌ Telegram SDK initialization failed:', error);
}

/**
 * Application entry point
 * Sets up all providers and renders the main App component
 * Includes Redux store, router, persistence, and Telegram SDK integration
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

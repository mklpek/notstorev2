import './bootstrapTG'; // .tg sınıfını sadece Telegram içinde ekler
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './core/styles/theme.css';
import { Provider } from 'react-redux';
import { store, persistor } from './core/store/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from './core/hooks/useSafeArea';
import 'virtual:svg-icons-register'; // SVG sprite eklentisi için

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  </React.StrictMode>
);

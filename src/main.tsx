import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/theme.css';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'virtual:svg-icons-register'; // SVG sprite eklentisi için
import SafeArea from './components/SafeArea';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <SafeArea>
            <App />
          </SafeArea>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { initializeTelegramWebApp } from './lib/telegram';
import { applyInitialTheme } from './lib/theme';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n';

initializeTelegramWebApp();
applyInitialTheme();

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);

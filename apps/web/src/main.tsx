import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { initializeTelegramWebApp } from './lib/telegram';
import { applyInitialTheme } from './lib/theme';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

initializeTelegramWebApp();
applyInitialTheme();

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const queryClient = new QueryClient();

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

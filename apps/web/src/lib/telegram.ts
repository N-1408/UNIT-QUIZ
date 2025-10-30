import WebApp from '@twa-dev/sdk';

export function initializeTelegramWebApp() {
  if (typeof window === 'undefined') return;

  try {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor('#ffffff');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Telegram WebApp init skipped:', error);
  }
}

export function closeTelegramWebApp() {
  try {
    WebApp.close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Telegram WebApp close skipped:', error);
  }
}

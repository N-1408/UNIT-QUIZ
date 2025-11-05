import { useEffect } from 'react';

const BOT_USERNAME = 'unitquiz_bot';
const AUTH_URL = `${(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')}/api/telegram-login`;

export default function LoginPage() {
  useEffect(() => {
    const container = document.getElementById('telegram-login-container');
    if (!container) return;

    // Clear any existing scripts (hot reload safety)
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-auth-url', AUTH_URL);
    script.setAttribute('data-request-access', 'write');

    container.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--divider)] bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <img src="https://telegram.org/img/website_icon.svg" alt="Telegram" className="h-14 w-14" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Login with Telegram</h1>
        <p className="mt-2 text-sm text-gray-500">
          We use Telegram OAuth to keep your account secure.
        </p>
        <div id="telegram-login-container" className="mt-6 flex justify-center" />
      </div>
    </div>
  );
}

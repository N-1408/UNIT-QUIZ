import { useEffect } from "react";

const BOT_USERNAME = (import.meta.env.VITE_TG_BOT_USERNAME ?? "unit_quiz_bot").toString();
const AUTH_URL = (import.meta.env.VITE_TG_AUTH_URL ?? "https://unit-quiz.onrender.com/api/auth/telegram").toString();

export default function Login() {
  useEffect(() => {
    const container = document.getElementById("telegram-login-container");
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-auth-url", AUTH_URL);

    container.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6 text-[var(--fg)]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Login with Telegram</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Use your Telegram account to securely sign in.
        </p>
      </div>
      <div id="telegram-login-container" className="flex justify-center" />
    </div>
  );
}

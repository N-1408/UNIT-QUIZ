import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    const container = document.getElementById("telegram-login");
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "unitquiz_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-auth-url", "https://unit-quiz.onrender.com/api/telegram-login");
    script.setAttribute("data-request-access", "write");

    container.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div
        className="w-full max-w-sm rounded-xl border border-[var(--divider)] bg-white p-8 text-center shadow-lg"
        style={{ background: "var(--card)", color: "var(--fg)" }}
      >
        <div className="mb-4 flex justify-center">
          <img src="https://telegram.org/img/website_icon.svg" alt="Telegram" className="h-14 w-14" />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>
          Login with Telegram
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          We use Telegram OAuth to keep your account secure.
        </p>
        <div id="telegram-login" className="mt-6 flex justify-center" />
      </div>
    </div>
  );
}

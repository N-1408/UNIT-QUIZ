import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initTelegramApp } from "../utils/telegram";

const API_URL = (import.meta.env.VITE_API_URL ?? "https://unit-quiz.onrender.com").replace(
  /\/$/,
  ""
);

type Mode = "checking" | "browser" | "working" | "success" | "error";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("checking");
  const [status, setStatus] = useState("Starting secure Telegram login...");
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    const { tg, initData, user } = initTelegramApp();

    if (!tg) {
      setMode("browser");
      return;
    }

    if (!initData || !user) {
      setMode("error");
      setStatus("We could not detect a Telegram session.");
      setError("Unable to authenticate. Please reopen in Telegram.");
      return;
    }

    setMode("working");
    setStatus("Verifying your Telegram session...");
    setError(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 1500);

    try {
      const response = await fetch(`${API_URL}/api/auth/telegram/webapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ initData, user }),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Auth request failed with status ${response.status}`);
      }

      setMode("success");
      setStatus("Welcome back! Redirecting...");
      navigate("/tests", { replace: true });
    } catch (err) {
      window.clearTimeout(timeoutId);
      console.error("Auth failed", err);
      setMode("error");
      setStatus("We hit a snag.");
      setError("Unable to authenticate. Please reopen in Telegram.");
    }
  }, [navigate]);

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  const view = useMemo(() => {
    if (mode === "browser") {
      return <BrowserBlock />;
    }

    return (
      <TelegramInApp
        mode={mode}
        status={status}
        error={error}
        onRetry={() => {
          setMode("checking");
          setStatus("Retrying Telegram session...");
          setError(null);
          void authenticate();
        }}
      />
    );
  }, [authenticate, error, mode, status]);

  return view;
}

type TelegramInAppProps = {
  mode: Mode;
  status: string;
  error: string | null;
  onRetry: () => void;
};

function TelegramInApp({ mode, status, error, onRetry }: TelegramInAppProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (mode === "checking" || mode === "working") {
      setShowSpinner(true);
      const timer = window.setTimeout(() => setShowSpinner(false), 1000);
      return () => {
        window.clearTimeout(timer);
      };
    }
    setShowSpinner(false);
  }, [mode]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f6f7fb,#ffffff)] px-6 py-16 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(255,255,255,0)_60%)] opacity-90" />
      <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#229ED9]/15 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-[18%] h-96 w-96 rounded-full bg-white/60 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 rounded-[20px] border border-white/70 bg-white/70 p-10 text-center shadow-[0_35px_80px_rgba(34,158,217,0.22)] backdrop-blur-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-inner shadow-slate-200">
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg"
            alt="Telegram"
            className="h-12 w-12 text-[#229ED9]"
          />
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">Logging you in via Telegram</h1>
        <p className="text-sm text-slate-600">{status}</p>

        {showSpinner && (
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#229ED9]/30 border-t-[#229ED9]" />
          </div>
        )}

        {mode === "error" && error ? (
          <div className="flex flex-col items-center gap-3 text-sm text-rose-500">
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full border border-[#229ED9]/40 px-5 py-2 text-sm font-medium text-[#229ED9] shadow-[0_12px_30px_rgba(34,158,217,0.18)] transition hover:bg-[#229ED9]/10"
            >
              Try again
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BrowserBlock() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f7fb,#ffffff)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,158,217,0.08)_0%,rgba(34,158,217,0)_70%)]" />
      <div className="absolute left-[20%] top-[18%] h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute right-[22%] top-[32%] h-80 w-80 rounded-full bg-[#229ED9]/20 blur-[120px]" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-6 rounded-[20px] border border-white/60 bg-white/60 p-12 text-center shadow-[0_45px_90px_rgba(34,158,217,0.25)] backdrop-blur-2xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-inner shadow-slate-200">
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg"
            alt="Telegram"
            className="h-14 w-14 text-[#229ED9]"
          />
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight text-slate-900">
          Open in Telegram to continue
        </h1>
        <p className="max-w-md text-sm text-slate-600">
          UNIT QUIZ lives inside the Telegram Mini App. Launch it from Telegram for the most secure
          and seamless experience.
        </p>
        <a
          className="group inline-flex items-center gap-2 rounded-full bg-[#229ED9] px-7 py-3 text-sm font-semibold text-white shadow-[0_26px_60px_rgba(34,158,217,0.35)] transition hover:shadow-[0_26px_65px_rgba(34,158,217,0.45)]"
          href="https://t.me/unit_quiz_bot?start=webapp"
        >
          <span>Open in Telegram</span>
          <svg
            className="transition group-hover:translate-x-0.5"
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.333 8h9.334M8.667 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <span className="text-xs uppercase tracking-[0.35em] text-slate-400">UNIT QUIZ</span>
      </div>
    </div>
  );
}

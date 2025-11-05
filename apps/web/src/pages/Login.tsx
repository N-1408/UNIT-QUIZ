import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL ?? "https://unit-quiz.onrender.com").replace(
  /\/$/,
  ""
);

type ViewMode = "checking" | "miniapp" | "browser";

export default function Login() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("checking");
  const [status, setStatus] = useState("Verifying your Telegram session...");
  const [error, setError] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const runAuth = useCallback(async () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setViewMode("browser");
      setError("This app can only be opened inside Telegram.");
      return;
    }

    setViewMode("miniapp");
    setError(null);

    tg.ready?.();
    tg.expand?.();

    const initData = tg.initData ?? "";
    const rawUser = tg.initDataUnsafe?.user;

    if (!initData || !rawUser) {
      setStatus("We couldn’t detect your Telegram profile.");
      setError("Try closing and reopening the mini app from Telegram.");
      return;
    }

    const user = {
      id: rawUser.id,
      first_name: rawUser.first_name ?? "",
      last_name: rawUser.last_name ?? undefined,
      username: rawUser.username ?? undefined,
      photo_url: rawUser.photo_url ?? undefined,
      language_code: rawUser.language_code ?? undefined,
    };

    setStatus("Connecting to UNIT QUIZ...");
    setShowSpinner(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);

    try {
      const response = await fetch(`${API_URL}/api/auth/telegram/webapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ initData, user }),
        signal: controller.signal,
      });

      window.clearTimeout(timeout);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Auth request failed (${response.status})`);
      }

      setStatus("Welcome back! Redirecting...");
      window.setTimeout(() => navigate("/tests", { replace: true }), 250);
    } catch (err) {
      window.clearTimeout(timeout);
      console.error("Telegram login failed", err);
      setStatus("We couldn’t confirm your Telegram session.");
      setError("Please try again from Telegram.");
    } finally {
      window.setTimeout(() => setShowSpinner(false), 600);
    }
  }, [navigate]);

  useEffect(() => {
    void runAuth();
  }, [runAuth]);

  if (viewMode === "browser") {
    return <BrowserBlock message={error} />;
  }

  return (
    <MiniAppView
      status={status}
      error={error}
      showSpinner={showSpinner}
      onRetry={() => {
        setStatus("Retrying your Telegram session...");
        setError(null);
        void runAuth();
      }}
    />
  );
}

type MiniAppViewProps = {
  status: string;
  error: string | null;
  showSpinner: boolean;
  onRetry: () => void;
};

function MiniAppView({ status, error, showSpinner, onRetry }: MiniAppViewProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f6f8fb,#ffffff)] px-6 py-16 text-slate-900">
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
        <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">
          Logging you in via Telegram
        </h1>
        <p className="text-sm text-slate-600">{status}</p>

        <div
          className={`flex items-center justify-center transition-opacity duration-500 ${
            showSpinner ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#229ED9]/25 border-t-[#229ED9]" />
        </div>

        {error ? (
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

type BrowserBlockProps = {
  message: string | null;
};

function BrowserBlock({ message }: BrowserBlockProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f8fb,#ffffff)]" />
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
          {message ?? "UNIT QUIZ lives inside the Telegram Mini App. Launch it from Telegram for the most secure and seamless experience."}
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

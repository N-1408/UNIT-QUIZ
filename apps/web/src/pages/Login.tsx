import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initTelegramApp } from "../utils/telegram";

const API_URL = (import.meta.env.VITE_API_URL ?? "https://unit-quiz.onrender.com").replace(
  /\/$/,
  ""
);

type AuthStage = "idle" | "authenticating" | "success" | "error";

export default function Login() {
  const navigate = useNavigate();
  const [isTelegram, setIsTelegram] = useState<boolean | null>(null);
  const [stage, setStage] = useState<AuthStage>("idle");
  const [message, setMessage] = useState("Preparing Telegram session…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { tg, initData, user } = initTelegramApp();

    if (!tg) {
      setIsTelegram(false);
      return;
    }

    setIsTelegram(true);

    if (!initData || !user) {
      setStage("error");
      setError("We couldn't access your Telegram profile. Please reopen the mini app.");
      setMessage("Unable to authenticate.");
      return;
    }

    const authenticate = async () => {
      setStage("authenticating");
      setMessage("Logging you in securely via Telegram…");
      try {
        const response = await fetch(`${API_URL}/api/auth/telegram/webapp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ initData, user }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to authenticate via Telegram.");
        }

        setStage("success");
        setMessage("Welcome back! Redirecting…");
        window.setTimeout(() => {
          navigate("/tests", { replace: true });
        }, 750);
      } catch (err) {
        console.error(err);
        setStage("error");
        setMessage("Unable to authenticate.");
        setError("Authentication failed. Please close and reopen the mini app.");
      }
    };

    void authenticate();
  }, [navigate]);

  const handleRetry = () => {
    window.location.reload();
  };

  const telegramScreen = useMemo(
    () => (
      <TelegramAuthScreen message={message} stage={stage} error={error} onRetry={handleRetry} />
    ),
    [error, message, stage]
  );

  if (isTelegram === false) {
    return <BrowserLanding />;
  }

  return telegramScreen;
}

type TelegramAuthScreenProps = {
  message: string;
  stage: AuthStage;
  error: string | null;
  onRetry: () => void;
};

function TelegramAuthScreen({ message, stage, error, onRetry }: TelegramAuthScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f0f4f8,#eef2f7)] px-6 py-16 text-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(255,255,255,0)_55%)] opacity-80" />
      <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#229ED9]/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/4 h-96 w-96 rounded-full bg-white/60 blur-3xl" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-[#229ED9]/25 blur-xl" />
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-[#229ED9]/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#229ED9] text-white shadow-[0_18px_40px_rgba(34,158,217,0.35)]">
            <TelegramGlyph />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900">Logging you in</h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>

        {stage === "error" && error ? (
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-rose-500">
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full border border-[#229ED9]/40 px-5 py-2 text-sm font-medium text-[#229ED9] shadow-[0_10px_30px_rgba(34,158,217,0.18)] transition hover:bg-[#229ED9]/10"
            >
              Try again
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BrowserLanding() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f9fafb,#e8edf1)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)]" />
      <div className="absolute left-[18%] top-[20%] h-64 w-64 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute right-[15%] top-[35%] h-72 w-72 rounded-full bg-[#229ED9]/15 blur-3xl" />

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/60 bg-white/50 p-10 text-center shadow-[0_40px_80px_rgba(34,158,217,0.2)] backdrop-blur-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-inner shadow-slate-200">
          <img src="https://telegram.org/img/t_logo.png" alt="Telegram" className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Open in Telegram to continue</h1>
        <p className="text-sm text-slate-600">
          UNIT QUIZ runs securely inside the Telegram Mini App. Launch it in Telegram for a seamless
          experience.
        </p>
        <a
          className="group inline-flex items-center gap-2 rounded-full bg-[#229ED9] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(34,158,217,0.28)] transition hover:shadow-[0_20px_50px_rgba(34,158,217,0.4)]"
          href="https://t.me/unit_quiz_bot?start=webapp"
        >
          <span>Open in Telegram</span>
          <svg
            className="transition group-hover:translate-x-0.5"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
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

function TelegramGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.665 3.43219C20.9575 3.31137 21.2775 3.27964 21.5866 3.34062C21.8957 3.40161 22.1796 3.55284 22.4025 3.77569C22.6254 3.99855 22.7767 4.28252 22.8377 4.59163C22.8987 4.90075 22.8669 5.22073 22.7461 5.51319L14.8891 23.2017C14.7548 23.5159 14.5222 23.7773 14.2261 23.9451C13.9299 24.1129 13.5879 24.1781 13.2525 24.1307C12.9172 24.0832 12.6083 23.9259 12.3771 23.6857C12.1458 23.4455 12.0062 23.1375 11.9825 22.8092L11.6225 17.9022C11.5934 17.4959 11.7316 17.0949 12.0048 16.788L16.8978 11.3047C17.0171 11.1687 17.0272 10.9601 16.9216 10.8117C16.816 10.6633 16.6203 10.6215 16.4548 10.7052L9.43984 14.2322C9.09975 14.4034 8.71402 14.4492 8.34827 14.3629C7.98253 14.2766 7.65755 14.0634 7.43334 13.7597L4.67584 10.06C4.49563 9.82576 4.31063 9.58473 4.12084 9.33691L1.14484 5.43569C0.935106 5.16365 0.84358 4.80395 0.893217 4.4508C0.942855 4.09764 1.12966 3.78228 1.41192 3.57183C1.69418 3.36138 2.05031 3.27205 2.40084 3.32369C2.75137 3.37533 3.05984 3.56319 3.28284 3.84769L6.17484 7.53369C6.36187 7.76944 6.57655 7.98746 6.81334 8.18319C7.04342 8.36518 7.32934 8.45031 7.61984 8.42169L20.665 3.43219Z"
        fill="currentColor"
      />
    </svg>
  );
}

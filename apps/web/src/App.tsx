import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import TestsPage from "./pages/Tests";
import RatingPage from "./pages/Rating";
import SettingsPage from "./pages/Settings";
import TestRunner from "./pages/TestRunner";
import TeacherPanel from "./pages/TeacherPanel";
import { useCurrentUser } from "./hooks/useCurrentUser";

function App() {
  const { status, telegramUser, refetch, error } = useCurrentUser();

  if (status === "no-telegram") {
    return (
      <InfoScreen
        title="Telegram orqali oching"
        description="UNIT QUIZ mini ilovasi faqat Telegram ichida ishlaydi. Iltimos, Nova LC botidan ilovani oching."
        actionLabel="Botga o'tish"
        actionHref="https://t.me/unit_quiz_bot"
      />
    );
  }

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "needs-registration") {
    const firstName = telegramUser?.first_name ?? "do'st";
    return (
      <InfoScreen
        title={`Salom, ${firstName}!`}
        description={`Ro'yxatdan o'tish uchun botdagi "Raqamni yuborish (Send Contact)" tugmasini bosing. Kontakt yuborilgach, bu yerda avtomatik kirish ochiladi.`}
        actionLabel="Botni ochish"
        actionHref="https://t.me/unit_quiz_bot"
      />
    );
  }

  if (status === "error") {
    return (
      <InfoScreen
        title="Tizimga ulanish muvaffaqiyatsiz"
        description={
          error instanceof Error
            ? error.message
            : "Server bilan bog'lanib bo'lmadi. Qayta urinib ko'ring."
        }
        actionLabel="Qayta urinish"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/tests" replace />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test/:id" element={<TestRunner />} />
          <Route path="/teacher" element={<TeacherPanel />} />
          <Route path="*" element={<Navigate to="/tests" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#ffe0cc,_#fff)] px-6 text-center text-[var(--fg)]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgba(255,95,0,0.25)] border-t-[#ff5f00]" />
      <p className="mt-6 text-sm text-[var(--muted)]">Nova LC platformasi yuklanmoqda...</p>
    </div>
  );
}

type InfoScreenProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
};

function InfoScreen({ title, description, actionLabel, actionHref, onAction }: InfoScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,95,0,0.12),_transparent_60%)] px-6 py-16 text-center">
      <div className="w-full max-w-md rounded-3xl bg-[color-mix(in_oklab,_#ffffff_90%,_transparent)] p-8 shadow-[0_30px_60px_rgba(255,95,0,0.12)] backdrop-blur">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#ff5f00,_#ff7b33)] text-white shadow-[0_16px_30px_rgba(255,95,0,0.28)]">
          <span className="text-xl font-semibold">N</span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--fg)]">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
        {actionHref ? (
          <a
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#ff5f00,_#ff7b33)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(255,95,0,0.28)] transition hover:shadow-[0_20px_40px_rgba(255,95,0,0.35)]"
            href={actionHref}
            target="_blank"
            rel="noreferrer"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#ff5f00,_#ff7b33)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(255,95,0,0.28)] transition hover:shadow-[0_20px_40px_rgba(255,95,0,0.35)]"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

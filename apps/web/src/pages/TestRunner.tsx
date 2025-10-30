import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../components/Timer";

const defaultTest = {
  title: "Unit 1 Quick Check",
  summary: "Demo test - 10 ta savol - 10 daqiqa",
  bullets: [
    "Savollar Supabase'dan dinamik yuklanadi (keyingi bosqich).",
    "Tarqatilgan PDF yoki Excel fayllardan convert qilinadi.",
    "Natijalar Supabase Realtime orqali kuzatiladi."
  ]
};

const testCatalog: Record<string, typeof defaultTest> = {
  starter: {
    title: "Starter Placement",
    summary: "Boshlang'ich daraja testi - 10 savol",
    bullets: [
      "Ingliz tili asosiy ko'nikmalarini baholaydi.",
      "CEFR bo'yicha avtomatik balanslash.",
      "Natija asosida keyingi modul tavsiyasi."
    ]
  },
  "unit-1": {
    title: "Unit 1 - Academic Skills",
    summary: "Reading va vocabulary - 15 savol",
    bullets: [
      "Kontekst asosidagi so'z boyligi.",
      "Inline feedback va tavsiya etilgan mashqlar.",
      "Telegram bot orqali natija yuboriladi."
    ]
  },
  "speaking-lite": {
    title: "Speaking Lite",
    summary: "Audio tayyorgarlik - 6 savol",
    bullets: [
      "Voice note shaklida javoblar (demo).",
      "AI transkripsiya keyingi bosqichda.",
      "Mentor bilan feedback jadvali."
    ]
  }
};

export default function TestRunner() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);

  const test = useMemo(() => {
    if (!id) return defaultTest;
    return testCatalog[id] ?? defaultTest;
  }, [id]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#0b0b0b] px-4 pb-10 pt-6 text-white">
      <header className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:text-brand-yellow"
        >
          <- Orqaga
        </button>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">Demo rejim</span>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-white">{test.title}</h1>
          <p className="text-sm text-white/60">{test.summary}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-start">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111111] px-4 py-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-yellow">Preview</h2>
            <ul className="flex list-disc flex-col gap-2 pl-4 text-sm text-white/70">
              {test.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={submitted}
              className="mt-2 rounded-xl border border-brand-yellow/40 bg-brand-yellow px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitted ? "Yuborildi (mock)" : "Javoblarni yuborish"}
            </button>
          </div>
          <Timer durationSec={600} isActive={!submitted} />
        </div>

        {submitted && (
          <div className="rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-3 text-sm text-brand-yellow">
            Javoblar yuborildi (mock). Telegram bot orqali natija yuboriladi.
          </div>
        )}
      </section>
    </div>
  );
}

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StatCard } from "@/components/common/StatCard";
import { ExamList } from "@/components/exams/ExamList";
import type { ExamSummary } from "@/components/exams/ExamCard";
import { useAuthStore } from "@/store/useAuth";

const MOCK_EXAMS: ExamSummary[] = [
  {
    id: 1,
    title: "Listening Sprint",
    startsAt: new Date(Date.now() + 1000 * 60 * 45),
    durationMinutes: 30,
    status: "upcoming"
  },
  {
    id: 2,
    title: "Reading Marathon",
    startsAt: null,
    durationMinutes: 60,
    status: "open"
  }
];

export const HomePage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((state) => state.session);
  const name = session?.fullName?.split(" ")[0] ?? "do'stimiz";

  const stats = useMemo(
    () => [
      { label: "Bugun OPEN", value: "2 ta", hint: "Yulduzlar safida bo'ling", icon: "??" },
      { label: "Oxirgi natija", value: "87%", hint: "Bu raqamni oshirib yuboramizmi?", icon: "??" },
      { label: "O'rtacha vaqt", value: "42 min", hint: "Choy ham ayni shu paytda tayyor bo'ladi", icon: "??" }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl bg-mesh-primary p-6 text-slate-50 shadow-lg backdrop-blur-xl">
        <h1 className="text-3xl font-semibold">{t("home.greet", { name })}</h1>
        <p className="mt-2 text-sm text-white/70">{t("home.subtitle")}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} icon={stat.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Imtihonlar</h2>
          <span className="text-sm text-muted">Yaqinlashayotgan bosqichlarga tayyor turing</span>
        </header>
        <ExamList items={MOCK_EXAMS} />
      </section>
    </div>
  );
};

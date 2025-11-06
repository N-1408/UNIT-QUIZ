import { useMemo } from "react";
import { Link } from "react-router-dom";
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
  const rawName = session?.fullName?.split(" ")[0] ?? "do'stimiz";
  const name = rawName || "do'stimiz";

  const greeting = t("home.greet", {
    name,
    defaultValue: `Salom, ${name}! \uD83D\uDC4B`
  });

  const subtitle = t("home.subtitle", {
    defaultValue: "Bugun o'zingizni sinab ko'rasizmi yoki choy ichib dam olamizmi? \uD83C\uDF75"
  });

  const stats = useMemo(
    () => [
      { label: "Bugun OPEN", value: "2 ta", hint: "Yulduzlar safida bo'ling", icon: "\uD83D\uDCDA" },
      { label: "Oxirgi natija", value: "87%", hint: "Bu raqamni oshirib yuboramizmi?", icon: "\uD83C\uDFC6" },
      { label: "O'rtacha vaqt", value: "42 min", hint: "Choy ham ayni shu paytda tayyor bo'ladi", icon: "\uD83C\uDF75" }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-[32px] border border-transparent bg-surface shadow-elev-lg">
        <div className="grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8">
          <div className="relative overflow-hidden rounded-[28px] bg-mesh-brand p-6 text-brand-ink shadow-elev-md">
            <div className="absolute inset-0 bg-mesh-soft opacity-20" aria-hidden />
            <div className="relative flex flex-col gap-4">
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{greeting}</h1>
              <p className="text-base text-brand-ink/80 md:text-lg">{subtitle}</p>
              <Link
                to="/exams"
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95"
              >
                \uD83D\uDE80 Boshlash
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] border border-stroke/60 bg-surface-alt/60 p-5 text-sm text-text-secondary shadow-elev-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Bugungi kayfiyat
            </span>
            <p>
              "{t("home.heroNote", { defaultValue: "Qadam tashlang, qolganini biz birgalikda qilamiz." })}"
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} icon={stat.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Imtihonlar</h2>
          <span className="text-sm text-text-secondary">
            {t("home.examsHint", { defaultValue: "Yaqinlashayotgan bosqichlarga tayyor turing" })}
          </span>
        </header>
        <ExamList items={MOCK_EXAMS} />
      </section>
    </div>
  );
};

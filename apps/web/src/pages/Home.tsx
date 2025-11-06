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
    defaultValue: "Bugun o'zingizni sinab ko'rasizmi yoki choy ichamizmi? \u2615\uFE0F"
  });

  const stats = useMemo(
    () => [
      { label: "Bugun OPEN", value: "2 ta", hint: "Ikki sinov ochiq turibdi.", icon: "\u23F0" },
      { label: "Natijalar", value: "87%", hint: "Oxirgi yutuq darajasi.", icon: "\u2728" },
      { label: "Kayfiyat", value: "Yuqori", hint: "Telegram ham shunday deydi.", icon: "\uD83C\uDF1F" }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-[24px] border border-border bg-surface/95 p-4 shadow-elev-sm">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-text-secondary">
            <span>Bosh sahifa</span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">{greeting}</h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
          <Link
            to="/exams"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/20 bg-brand px-4 py-2 text-xs font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-dark active:scale-[0.97]"
          >
            \uD83D\uDE80 Keling, sinovdan o'tamiz!
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} icon={stat.icon} />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>{t("home.examsHint", { defaultValue: "Kayfiyatga qarab tanlang, hammasi tayyor." })}</span>
        </div>
        <ExamList items={MOCK_EXAMS} />
      </section>
    </div>
  );
};

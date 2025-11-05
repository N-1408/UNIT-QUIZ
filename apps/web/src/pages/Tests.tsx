import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { haptic } from "../lib/tg";
import { buildApiUrl } from "../lib/api";
import { useCurrentUser } from "../hooks/useCurrentUser";

type TestSummary = {
  id: string;
  title: string;
  unit: string;
  createdAt: string;
  isNew?: boolean;
};

type TestsResponse = TestSummary[];

export default function TestsPage() {
  const navigate = useNavigate();
  const { telegramUser, profile } = useCurrentUser();

  const greetingName = profile?.firstName ?? telegramUser?.first_name ?? "do'st";

  const { data, isLoading, isError, refetch } = useQuery<TestsResponse>({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl("/api/tests"));
      if (!response.ok) {
        throw new Error("failed_to_fetch");
      }
      return response.json() as Promise<TestsResponse>;
    }
  });

  const tests = useMemo(() => data ?? [], [data]);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <section className="flex flex-col gap-3">
        <header className="space-y-2">
          <h1 className="section-title" style={{ color: "var(--fg)" }}>
            Salom, {greetingName}!
          </h1>
            <div className="section-accent mt-1" />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Bugungi kunda tekshirib ko'rishingiz mumkin bo'lgan UNIT QUIZ testlari ro'yxati.
          </p>
        </header>

        {isLoading && (
          <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
            Testlar yuklanmoqda...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            Testlar ro'yxatini olishda xatolik yuz berdi.{" "}
            <button type="button" className="underline" onClick={() => refetch()}>
              Qayta urinish
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {tests.map((test) => (
            <article key={test.id} className="card flex flex-col gap-4 p-5">
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                    {test.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {test.unit}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {test.isNew ? (
                    <span
                      className="badge"
                      style={{
                        background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                        color: "#ffffff",
                        boxShadow: "0 12px 24px rgba(255, 95, 0, 0.18)"
                      }}
                    >
                      Yangi
                    </span>
                  ) : null}
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="badge">8/10</span>
                    <span className="badge badge-time">~ 6:34</span>
                  </div>
                </div>
              </header>
              <footer className="flex items-center justify-between text-sm text-[var(--muted)]">
                <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                <button
                  type="button"
                  className="btn btn-primary tap px-4 py-2 text-sm font-semibold"
                  onClick={() => {
                    haptic.tap();
                    navigate(`/test/${test.id}`);
                  }}
                >
                  Boshlash
                </button>
              </footer>
            </article>
          ))}
          {!isLoading && tests.length === 0 && !isError ? (
            <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-6 text-center text-sm text-[var(--muted)]">
              Hozircha hech qanday test mavjud emas.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

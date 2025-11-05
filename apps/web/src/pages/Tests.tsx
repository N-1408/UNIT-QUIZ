import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProtectedRoute from "../components/ProtectedRoute";
import UserHeader from "../components/UserHeader";
import { haptic } from "../lib/tg";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

type TestSummary = {
  id: string;
  title: string;
  unit: string;
  createdAt: string;
  isNew?: boolean;
};

type TestsResponse = TestSummary[];

type MeResponse = {
  full_name?: string | null;
};

export default function TestsPage() {
  const navigate = useNavigate();

  const { data: me } = useQuery<MeResponse | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("https://unit-quiz.onrender.com/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data, isLoading, isError, refetch } = useQuery<TestsResponse>({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/tests`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("failed_to_fetch");
      }
      return response.json();
    },
  });

  const tests = useMemo(() => data ?? [], [data]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4 pb-24">
        <UserHeader />

        <section className="flex flex-col gap-4">
          <header className="space-y-2">
            <h1 className="section-title" style={{ color: "var(--fg)" }}>
              {me?.full_name ? `Salom, ${me.full_name.split(" ")[0]}!` : "Available tests"}
            </h1>
            <div className="section-accent mt-1" />
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Choose a test to begin. Your Telegram login keeps progress secure.
            </p>
          </header>

          {isLoading && (
            <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
              Loading tests...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              Failed to load tests.{" "}
              <button type="button" className="underline" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {tests.map((test) => (
              <article key={test.id} className="card flex flex-col gap-4 p-4">
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
                    {test.isNew ? <span className="badge badge-new">New</span> : null}
                    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="badge">8/10</span>
                      <span className="badge">⏱ 6:34</span>
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
                    Start
                  </button>
                </footer>
              </article>
            ))}
            {!isLoading && tests.length === 0 && !isError ? (
              <div className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-4 py-6 text-center text-sm text-[var(--muted)]">
                No tests available yet.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

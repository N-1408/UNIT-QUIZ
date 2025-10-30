import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type TestStatus = 'new' | 'in-progress' | 'completed';

interface TestItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: TestStatus;
  progress?: string;
}

const mockTests: TestItem[] = [
  {
    id: 'starter',
    title: 'Starter Placement',
    description: "Boshlang'ich darajani aniqlash uchun tezkor sinov.",
    meta: '10 savol / 12 daqiqa',
    status: 'new'
  },
  {
    id: 'unit-1',
    title: 'Unit 1 - Academic Skills',
    description: 'Reading va vocabulary bo\'yicha qisqa test.',
    meta: '15 savol / 18 daqiqa',
    status: 'in-progress',
    progress: '8/15 - 6:34'
  },
  {
    id: 'speaking-lite',
    title: 'Speaking Lite',
    description: 'Audio suhbatlarga tayyorlanish uchun sinov.',
    meta: '6 savol / 7 daqiqa',
    status: 'completed',
    progress: '100% - 12:40'
  }
];

export default function TestsPage() {
  const navigate = useNavigate();
  const tests = useMemo(() => mockTests, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Testlar</h1>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
          Demo ma'lumot
        </span>
      </div>
      <p className="text-sm text-white/50">
        Hamma testlar Telegram Mini App orqali ishlaydi. Yakuniy ball Supabase bilan sinxronlanadi.
      </p>

      <div className="mt-2 flex flex-col gap-3">
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => navigate(`/test/${test.id}`)}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-left transition hover:bg-white/[0.08]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{test.title}</h2>
                <p className="mt-1 text-sm text-white/60">{test.description}</p>
              </div>
              <StatusBadge status={test.status} progress={test.progress} />
            </div>
            <div className="text-xs uppercase tracking-wide text-brand-yellow">{test.meta}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

interface StatusBadgeProps {
  status: TestStatus;
  progress?: string;
}

function StatusBadge({ status, progress }: StatusBadgeProps) {
  if (status === 'new') {
    return (
      <span className="rounded-full border border-brand-yellow/40 bg-brand-yellow/20 px-3 py-1 text-xs font-semibold text-brand-yellow">
        Yangi
      </span>
    );
  }

  if (status === 'in-progress') {
    return (
      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
        {progress}
      </span>
    );
  }

  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
      Yakunlandi - {progress}
    </span>
  );
}

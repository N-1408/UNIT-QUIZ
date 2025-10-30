import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../App';

type TestItem = {
  id: string;
  title: string;
  unit: string;
  isNew: boolean;
  lastAttempt?: {
    correct: number;
    total: number;
    duration: string;
    finishedAt: string;
  };
};

const mockTests: TestItem[] = [
  {
    id: 'starter',
    title: 'Starter Placement',
    unit: 'Placement',
    isNew: true
  },
  {
    id: 'unit-1',
    title: 'Unit 1 — Academic Skills',
    unit: 'Unit 1',
    isNew: false,
    lastAttempt: {
      correct: 8,
      total: 10,
      duration: '6:34',
      finishedAt: '2025-10-18T17:43:00+05:00'
    }
  },
  {
    id: 'speaking-lite',
    title: 'Speaking Lite',
    unit: 'Speaking Prep',
    isNew: false,
    lastAttempt: {
      correct: 5,
      total: 6,
      duration: '7:10',
      finishedAt: '2025-10-15T11:05:00+05:00'
    }
  }
];

export default function TestsPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<AppOutletContext>();
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);

  const tests = useMemo(() => mockTests, []);
  const firstName = useMemo(() => (user?.fullName?.split(' ')?.[0] ?? 'Talaba'), [user]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Assalomu alaykum, {firstName}</h1>
          <p className="text-xs uppercase tracking-wide text-white/40">inter-nation.uz mini testlar</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">Demo</span>
      </div>
      <p className="text-sm text-white/60">
        Yangi testlar qo‘shilganda Telegram bot orqali bildirishnoma keladi. Yakuniy ball Supabase bilan
        sinxronlanadi.
      </p>

      <div className="mt-2 flex flex-col gap-3">
        {tests.map((test) => {
          const solvedLabel =
            test.lastAttempt &&
            `${test.lastAttempt.correct}/${test.lastAttempt.total} • ${test.lastAttempt.duration}`;

          return (
            <button
              key={test.id}
              onClick={() =>
                test.lastAttempt ? setSelectedTest(test) : navigate(`/test/${test.id}`)
              }
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-left transition hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wide text-white/40">{test.unit}</span>
                  <h2 className="mt-1 text-lg font-semibold text-white">{test.title}</h2>
                </div>
                {test.isNew ? (
                  <span className="rounded-full border border-brand-yellow/50 bg-brand-yellow/20 px-3 py-1 text-xs font-semibold text-brand-yellow">
                    Yangi
                  </span>
                ) : (
                  solvedLabel && (
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
                      {solvedLabel}
                    </span>
                  )
                )}
              </div>
              <p className="text-sm text-white/60">
                {test.isNew
                  ? "Bu test hali yechilmagan. Birinchi urinish reytingga tushadi, keyingilari faqat kuzatuv uchun."
                  : 'Oxirgi urinish ma’lumotlari mavjud. Qayta yechish reytingga ta’sir qilmaydi.'}
              </p>
              {!test.isNew && (
                <p className="text-xs text-white/40">
                  Oxirgi urinish: {new Date(test.lastAttempt!.finishedAt).toLocaleString('uz-UZ')}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selectedTest?.lastAttempt && (
        <TestHistoryModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onRetake={() => {
            navigate(`/test/${selectedTest.id}`);
            setSelectedTest(null);
          }}
        />
      )}
    </section>
  );
}

interface TestHistoryModalProps {
  test: TestItem;
  onClose: () => void;
  onRetake: () => void;
}

function TestHistoryModal({ test, onClose, onRetake }: TestHistoryModalProps) {
  const attempt = test.lastAttempt!;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 px-4 pb-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] p-5 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">{test.unit}</p>
            <h3 className="text-xl font-semibold text-white">{test.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 transition hover:text-brand-yellow"
          >
            Yopish
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-white/40">To‘g‘ri</p>
            <p className="mt-1 text-lg font-semibold text-brand-yellow">{attempt.correct}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-white/40">Xato</p>
            <p className="mt-1 text-lg font-semibold text-white/70">
              {attempt.total - attempt.correct}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-white/40">Vaqt</p>
            <p className="mt-1 text-lg font-semibold text-white/70">{attempt.duration}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-white/50">
          Reyting faqat birinchi urinishdagi ball bilan hisoblanadi. Qayta yechish mashq uchun.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="w-full rounded-xl border border-brand-yellow/40 bg-brand-yellow px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand-yellow/90"
          >
            Qayta yechish
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70 transition hover:text-brand-yellow"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
}

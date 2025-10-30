import { useState } from 'react';
import Timer from '../components/Timer';

interface TestRunnerProps {
  onBack: () => void;
}

function TestRunner({ onBack }: TestRunnerProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Unit 1 Quick Check</h2>
            <p className="mt-1 text-sm text-slate-500">Demo test • 10 ta savol • 10 daqiqa</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-primary/40 hover:text-primary"
          >
            ← Back
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-start">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Preview</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              <li>• Savollar Supabase’dan dinamik yuklanadi (keyingi bosqich).</li>
              <li>• Tarqatilgan PDF/Excel’dan convert qilinadi.</li>
              <li>• Natijalar Supabase Realtime orqali kuzatiladi.</li>
            </ul>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
              disabled={submitted}
            >
              {submitted ? 'Yuborildi (mock)' : 'Submit answers'}
            </button>
          </div>
          <Timer durationSec={600} isActive={!submitted} />
        </div>
        {submitted && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            Javoblar yuborildi (mock). Telegram bot orqalı natija yuboriladi.
          </div>
        )}
      </div>
    </section>
  );
}

export default TestRunner;

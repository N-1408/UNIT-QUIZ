import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function TeacherPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-4 pb-10 pt-8 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-6">
          <h1 className="text-xl font-semibold text-white">Teacher Panel</h1>
          <p className="mt-2 text-sm text-white/60">
            Admin/Teacher UI hozircha tayyor emas. Keyingi iteratsiyada Supabase Auth bilan to'ldiriladi.
          </p>
          <p className="mt-4 text-xs uppercase tracking-wide text-brand-yellow">
            Coming soon - inter-nation.uz
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70 transition hover:text-brand-yellow"
        >
          <- Orqaga
        </button>
      </main>
    </div>
  );
}

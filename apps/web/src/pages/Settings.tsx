import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../App';
import type { RegisteredUser } from '../lib/user';

const groups = [
  { id: 'ielts-4', title: 'IELTS-4' },
  { id: 'upper-1', title: 'Upper-1' },
  { id: 'b1-express', title: 'B1-Express' }
];

const teachers = [
  { id: 'malika', title: 'Malika Q.' },
  { id: 'jamshid', title: 'Jamshid B.' },
  { id: 'rahim', title: 'Rahim A.' }
];

export default function SettingsPage() {
  const { user, updateUser } = useOutletContext<AppOutletContext>();
  const [fullName, setFullName] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? '');
  const [darkMode, setDarkMode] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const groupOptions = useMemo(() => groups, []);
  const teacherOptions = useMemo(() => teachers, []);

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName);
    setGroupId(user.groupId);
    setTeacherId(user.teacherId);
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim()) return;

    setIsSaving(true);
    const baseId = user?.id ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `user-${Date.now()}`);

    const updated: RegisteredUser = {
      id: baseId,
      fullName: fullName.trim(),
      groupId,
      teacherId
    };

    window.setTimeout(() => {
      updateUser(updated);
      setIsSaving(false);
    }, 200);
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Sozlamalar</h1>
        <p className="mt-1 text-sm text-white/50">
          Bu yerda demo foydalanuvchi ma'lumotlari saqlanadi. Supabase bilan sinxronizatsiya keyingi bosqichda.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-5"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/60">Ism familiya</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
            placeholder="Masalan, Dilnoza Soatova"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/60">Guruh</span>
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
          >
            {groupOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/60">Mentor</span>
          <select
            value={teacherId}
            onChange={(event) => setTeacherId(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
          >
            {teacherOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white/70">
          <div>
            <p className="font-medium text-white">Dark Mode</p>
            <p className="text-xs text-white/50">Hozircha demo holatda, tez orada Device theme bilan bog'lanadi.</p>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            className={[
              'relative h-6 w-11 rounded-full transition',
              darkMode ? 'bg-brand-yellow' : 'bg-white/20'
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#0b0b0b] transition',
                darkMode ? 'translate-x-6' : 'translate-x-1'
              ].join(' ')}
            />
          </button>
        </label>

        <div className="flex flex-col gap-2 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-4 text-sm text-brand-yellow">
          <p className="font-semibold">Teachers Panel</p>
          <p className="text-xs text-brand-yellow/80">
            O'qituvchilar test natijalarini ko'rish va import qilishlari mumkin. Demo rejimida parol bilan yopiq.
          </p>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="mt-2 w-full rounded-xl border border-brand-yellow/50 bg-brand-yellow px-3 py-2 text-sm font-semibold text-black transition hover:bg-brand-yellow/90"
          >
            Teachers Panel
          </button>
        </div>

        <button
          type="submit"
          disabled={isSaving || !fullName.trim()}
          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saqlanmoqda...' : 'Saqlash (mock)'}
        </button>
      </form>

      {showPasswordModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111111] p-5 text-sm text-white">
            <h2 className="text-lg font-semibold text-white">Teacher Panel paroli</h2>
            <p className="mt-1 text-xs text-white/50">
              Supabase Auth integratsiyasi tayyor bo'lgach bu forma haqiqiy parol bilan ishlaydi.
            </p>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Parol"
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:text-white"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('Teacher panel password submit (mock):', password);
                  setShowPasswordModal(false);
                }}
                className="rounded-xl bg-brand-yellow px-3 py-2 text-xs font-semibold text-black transition hover:bg-brand-yellow/90"
              >
                Davom etish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

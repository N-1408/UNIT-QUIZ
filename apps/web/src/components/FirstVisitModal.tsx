import { FormEvent, useMemo, useState } from 'react';
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

interface FirstVisitModalProps {
  onComplete: (user: RegisteredUser) => void;
}

export default function FirstVisitModal({ onComplete }: FirstVisitModalProps) {
  const [fullName, setFullName] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = fullName.trim().length > 2 && groupId && teacherId;
  const groupOptions = useMemo(() => groups, []);
  const teacherOptions = useMemo(() => teachers, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSaving) return;

    setIsSaving(true);

    window.setTimeout(() => {
      const uuid =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `user-${Date.now()}`;
      onComplete({
        id: uuid,
        fullName: fullName.trim(),
        groupId,
        teacherId
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0b0b] px-5 py-6"
      >
        <h2 className="text-xl font-semibold text-white">Assalomu alaykum!</h2>
        <p className="mt-2 text-sm text-white/60">
          INTER-NATION mini testini boshlashdan oldin qisqa ma’lumotni to‘ldiring. Bu ma’lumot faqat demo
          rejimida saqlanadi.
        </p>

        <label className="mt-5 flex flex-col gap-2 text-sm text-white/70">
          To‘liq ism
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Masalan, Dilnoza Soatova"
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
          />
        </label>

        <label className="mt-4 flex flex-col gap-2 text-sm text-white/70">
          Guruh
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
          >
            {groupOptions.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 flex flex-col gap-2 text-sm text-white/70">
          Mentor
          <select
            value={teacherId}
            onChange={(event) => setTeacherId(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
          >
            {teacherOptions.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.title}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isSaving}
          className="mt-6 w-full rounded-xl border border-brand-yellow/40 bg-brand-yellow px-4 py-3 text-sm font-semibold text-black transition hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Boshlash
        </button>
      </form>
    </div>
  );
}

import { FormEvent, useMemo, useState } from "react";
import type { RegisteredUser } from "../lib/user";

const groups = [
  { id: "ielts-4", title: "IELTS-4" },
  { id: "upper-1", title: "Upper-1" },
  { id: "b1-express", title: "B1-Express" }
];

const teachers = [
  { id: "malika", title: "Malika Q." },
  { id: "jamshid", title: "Jamshid B." },
  { id: "rahim", title: "Rahim A." }
];

interface FirstVisitModalProps {
  onComplete: (user: RegisteredUser) => void;
}

export default function FirstVisitModal({ onComplete }: FirstVisitModalProps) {
  const [fullName, setFullName] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
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
        typeof crypto !== "undefined" && "randomUUID" in crypto
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--overlay)' }}>
      <form onSubmit={handleSubmit} className="card w-full max-w-sm border border-[var(--divider)] bg-[var(--bg)] px-5 py-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--fg)' }}>
          Assalomu alaykum!
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          INTER-NATION mini testini boshlashdan oldin qisqa ma'lumotni to‘ldiring. Ushbu ma'lumot hozircha faqat demo rejimida saqlanadi.
        </p>

        <label className="mt-5 flex flex-col gap-2 text-sm">
          <span style={{ color: 'var(--muted)' }}>To‘liq ism</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Masalan, Dilnoza Soatova"
            className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-3 outline-none"
          />
        </label>

        <label className="mt-4 flex flex-col gap-2 text-sm">
          <span style={{ color: 'var(--muted)' }}>Guruh</span>
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-3 outline-none"
          >
            {groupOptions.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 flex flex-col gap-2 text-sm">
          <span style={{ color: 'var(--muted)' }}>Mentor</span>
          <select
            value={teacherId}
            onChange={(event) => setTeacherId(event.target.value)}
            className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-3 outline-none"
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
          className="btn-primary mt-6"
        >
          Boshlash
        </button>
      </form>
    </div>
  );
}

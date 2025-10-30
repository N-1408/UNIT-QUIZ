import { useEffect, useMemo, useState } from 'react';

type Group = { id: string; title: string };
type Teacher = { id: string; name: string };
type Student = { id: string; name: string; groupId: string; bestScore: number };

const DEFAULT_PASSWORD = 'NKN09';

function useLocal<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore */
    }
  }, [key, val]);
  return [val, setVal] as const;
}

export default function TeacherPanel() {
  const [isAllowed, setIsAllowed] = useLocal<boolean>('internation:isTeacher', false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const [groups, setGroups] = useLocal<Group[]>('internation:groups', [
    { id: 'g1', title: 'CEFR Up A2' },
    { id: 'g2', title: 'CEFR Up B1' }
  ]);
  const [teachers, setTeachers] = useLocal<Teacher[]>('internation:teachers', [
    { id: 't1', name: 'Alisher aka' },
    { id: 't2', name: 'Dilnoza opa' }
  ]);
  const [students, setStudents] = useLocal<Student[]>('internation:students', [
    { id: 's1', name: 'Javlon', groupId: 'g1', bestScore: 82 },
    { id: 's2', name: 'Madina', groupId: 'g1', bestScore: 91 },
    { id: 's3', name: 'Bobur', groupId: 'g2', bestScore: 77 }
  ]);

  const [filterGroup, setFilterGroup] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => (filterGroup === 'all' ? true : s.groupId === filterGroup))
      .sort((a, b) => b.bestScore - a.bestScore);
  }, [students, filterGroup]);

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (password.trim() === DEFAULT_PASSWORD) {
      setIsAllowed(true);
      setError('');
    } else {
      setError('Parol xato. Qaytadan urinib ko‘ring.');
    }
  }

  function addGroup() {
    const title = window.prompt('Guruh nomi:');
    if (!title) return;
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `g-${Date.now()}`;
    setGroups([...groups, { id, title }]);
  }

  function addTeacher() {
    const name = window.prompt('O‘qituvchi ismi:');
    if (!name) return;
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `t-${Date.now()}`;
    setTeachers([...teachers, { id, name }]);
  }

  function removeStudent(id: string) {
    if (!window.confirm('O‘quvchini o‘chirasizmi?')) return;
    setStudents(students.filter((s) => s.id !== id));
  }

  if (!isAllowed) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-3 text-xl font-semibold">Teacher’s Panel</h1>
        <p className="mb-4 text-sm text-white/70">Kirish uchun faqat parol talab qilinadi.</p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Parol (NKN09)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            type="password"
          />
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button className="w-full rounded-xl bg-brand-yellow py-2 font-medium text-black">Kirish</button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4 pb-24">
      <h1 className="text-xl font-semibold">Teacher’s Panel</h1>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="font-medium">Test yuklash</h2>
        <div className="text-sm text-white/70">
          A) PDF/Rasm (OCR) — <span className="text-red-400">aniqlik pastroq</span> <br />
          B) Excel — <span className="text-green-400">tavsiya etiladi</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-white/10 py-2 transition hover:bg-white/15">
            PDF/Rasm yuklash
          </button>
          <a
            className="flex-1 rounded-xl bg-brand-yellow py-2 text-center font-medium text-black"
            href="/quiz_template.xlsx"
            download
          >
            Excel (namuna)
          </a>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Guruhlar</h2>
          <button
            onClick={addGroup}
            className="rounded-lg bg-brand-yellow px-3 py-1 text-sm text-black transition hover:bg-brand-yellow/90"
          >
            + Yangi
          </button>
        </div>
        <ul className="space-y-1 text-sm text-white/80">
          {groups.map((group) => (
            <li key={group.id}>• {group.title}</li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-3">
          <h2 className="font-medium">O‘qituvchilar</h2>
          <button
            onClick={addTeacher}
            className="rounded-lg bg-brand-yellow px-3 py-1 text-sm text-black transition hover:bg-brand-yellow/90"
          >
            + Qo‘shish
          </button>
        </div>
        <ul className="space-y-1 text-sm text-white/80">
          {teachers.map((teacher) => (
            <li key={teacher.id}>• {teacher.name}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">O‘quvchilar (reyting)</h2>
          <select
            className="rounded-lg bg-white/10 px-2 py-1 text-sm"
            value={filterGroup}
            onChange={(event) => setFilterGroup(event.target.value)}
          >
            <option value="all">Barcha guruhlar</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </div>
        <ul className="divide-y divide-white/10">
          {filteredStudents.map((student) => (
            <li key={student.id} className="flex items-center justify-between py-2">
              <div className="text-sm">{student.name}</div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70">{student.bestScore}</span>
                <button
                  onClick={() => removeStudent(student.id)}
                  className="rounded-lg bg-white/10 px-2 py-1 text-sm transition hover:bg-white/15"
                >
                  O‘chirish
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="font-medium">Panel paroli</h2>
        <p className="text-sm text-white/70">
          Hozircha default: <code className="rounded bg-white/10 px-1">NKN09</code>
        </p>
        <button className="rounded-xl bg-white/10 px-3 py-2 text-sm transition hover:bg-white/15">
          Parolni o‘zgartirish (soon)
        </button>
      </section>
    </div>
  );
}

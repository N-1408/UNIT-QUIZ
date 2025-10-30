import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  BookOpen,
  FileSpreadsheet,
  Filter,
  ImagePlus,
  PlusCircle,
  ShieldCheck,
  Trash2,
  Trophy,
  Upload,
  Users,
  UserPlus
} from "lucide-react";

const PASSWORD = "NKN09";
const TEACHER_FLAG_KEY = "internation:isTeacher";

type Group = { id: string; title: string };
type Teacher = { id: string; name: string };
type Student = { id: string; name: string; groupId: string; bestScore: number };

type LocalUpdater<T> = (value: T | ((prev: T) => T)) => void;

function useLocal<T>(key: string, initial: T): [T, LocalUpdater<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return initial;
      return JSON.parse(stored) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue];
}

function randomId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}`;
}

export default function TeacherPanel() {
  const [isAllowed, setIsAllowed] = useLocal<boolean>(TEACHER_FLAG_KEY, false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [groups, setGroups] = useLocal<Group[]>("internation:groups", [
    { id: "g1", title: "CEFR Up A2" },
    { id: "g2", title: "CEFR Up B1" }
  ]);

  const [teachers, setTeachers] = useLocal<Teacher[]>("internation:teachers", [
    { id: "t1", name: "Alisher aka" },
    { id: "t2", name: "Dilnoza opa" }
  ]);

  const [students, setStudents] = useLocal<Student[]>("internation:students", [
    { id: "s1", name: "Javlon", groupId: "g1", bestScore: 82 },
    { id: "s2", name: "Madina", groupId: "g1", bestScore: 91 },
    { id: "s3", name: "Bobur", groupId: "g2", bestScore: 77 },
    { id: "s4", name: "Laylo", groupId: "g2", bestScore: 88 }
  ]);

  const [filterGroup, setFilterGroup] = useState<string>("all");

  const groupMap = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((g) => map.set(g.id, g.title));
    return map;
  }, [groups]);

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => (filterGroup === "all" ? true : student.groupId === filterGroup))
      .sort((a, b) => b.bestScore - a.bestScore);
  }, [students, filterGroup]);

  const topStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 5)
      .map((student) => ({
        ...student,
        groupName: groupMap.get(student.groupId) ?? "—"
      }));
  }, [students, groupMap]);

  useEffect(() => {
    if (isAllowed) {
      setError("");
      setPassword("");
    }
  }, [isAllowed]);

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (password.trim() === PASSWORD) {
      setIsAllowed(true);
      window.localStorage.setItem(TEACHER_FLAG_KEY, JSON.stringify(true));
      setError("");
    } else {
      setError("Parol xato. Qaytadan urinib ko‘ring.");
    }
  }

  function addGroup() {
    const title = window.prompt("Yangi guruh nomi:");
    if (!title) return;
    setGroups((prev) => [...prev, { id: randomId("g"), title: title.trim() }]);
  }

  function removeGroup(id: string) {
    if (!window.confirm("Guruhni o‘chirasizmi? Bog‘liq o‘quvchilar ham filtrlardan yo‘qoladi.")) return;
    setGroups((prev) => prev.filter((group) => group.id !== id));
    setStudents((prev) => prev.filter((student) => student.groupId !== id));
    setFilterGroup((current) => (current === id ? "all" : current));
  }

  function addTeacher() {
    const name = window.prompt("O‘qituvchi ismi:");
    if (!name) return;
    setTeachers((prev) => [...prev, { id: randomId("t"), name: name.trim() }]);
  }

  function removeStudent(id: string) {
    if (!window.confirm("O‘quvchini o‘chirasizmi?")) return;
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }

  function banStudent(id: string) {
    const student = students.find((item) => item.id === id);
    if (!student) return;
    window.alert(`${student.name} (demo) ban qilindi. Haqiqiy ban Supabase orqali amalga oshiriladi.`);
  }

  function startEditTest() {
    window.alert("Testni tahrirlash stubi. Keyingi iteratsiyada haqiqiy editor ulanadi.");
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white">
        <div className="mx-auto flex max-w-sm flex-col gap-4 rounded-3xl border border-white/10 bg-[#111111] px-6 py-8 shadow-lg">
          <div className="flex items-center gap-2 text-brand-yellow">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm uppercase tracking-wide">Teacher’s Gate</span>
          </div>
          <h1 className="text-2xl font-semibold">Teacher’s Panel</h1>
          <p className="text-sm text-white/60">
            Kirish faqat o‘qituvchilar uchun. Demo rejimda parol <code className="rounded bg-white/10 px-1">{PASSWORD}</code>.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Parol (NKN09)"
              className="rounded-xl border border-white/10 bg-[#0b0b0b] px-3 py-3 text-sm outline-none focus:border-brand-yellow/70 focus:ring-1 focus:ring-brand-yellow/70"
              type="password"
            />
            {error && (
              <div className="flex items-center gap-2 text-xs text-state-red">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <button className="rounded-xl bg-brand-yellow py-2 text-sm font-semibold text-black transition hover:bg-brand-yellow/90">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-[#0b0b0b] px-4 pb-28 pt-8 text-white">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-yellow">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs uppercase tracking-wide">inter-nation.uz • teacher</span>
        </div>
        <h1 className="text-3xl font-semibold">Teacher’s Panel</h1>
        <p className="text-sm text-white/60">
          Demo boshqaruv paneli. Ma’lumotlar localStorage’da saqlanadi. Supabase bilan sinxronizatsiya keyingi bosqichda.
        </p>
      </header>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 text-brand-yellow">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Test yuklash</h2>
        </div>
        <p className="text-sm text-state-blue/80">
          <strong>PDF/Rasm (OCR):</strong> tezkor lekin aniqlik pastroq. <strong>Excel:</strong> tuzilma aniq, tavsiya etiladi.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-sm transition hover:bg-white/15">
            <Upload className="h-4 w-4" /> PDF/Rasm yuklash
          </button>
          <a
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-yellow px-3 py-3 text-sm font-semibold text-black transition hover:bg-brand-yellow/90"
            href="/quiz_template.xlsx"
            download
          >
            <FileSpreadsheet className="h-4 w-4" /> Namuna (Excel)
          </a>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={startEditTest}
            className="flex items-center gap-2 rounded-xl border border-brand-yellow/50 bg-brand-yellow px-3 py-2 text-sm font-semibold text-black transition hover:bg-brand-yellow/90"
            type="button"
          >
            <PlusCircle className="h-4 w-4" /> Testni tahrirlash
          </button>
          <button
            onClick={() => window.alert('Rasm/Ovoz savol qo\'shish stubi')}
            className="flex items-center gap-2 rounded-xl border border-state-blue/40 bg-white/10 px-3 py-2 text-state-blue transition hover:bg-white/15"
            type="button"
          >
            <ImagePlus className="h-4 w-4" /> Rasmli/Ovozli savol qo‘shish
          </button>
          <button
            onClick={() => window.alert("Testni o‘chirish stubi")}
            className="flex items-center gap-2 rounded-xl border border-state-red/40 bg-state-red/20 px-3 py-2 text-state-red transition hover:bg-state-red/30"
            type="button"
          >
            <Trash2 className="h-4 w-4" /> Testni o‘chirish
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-yellow">
            <Users className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Guruhlar</h2>
          </div>
          <button
            onClick={addGroup}
            className="flex items-center gap-2 rounded-xl bg-brand-yellow px-3 py-2 text-sm font-medium text-black transition hover:bg-brand-yellow/90"
            type="button"
          >
            <PlusCircle className="h-4 w-4" /> Yangi
          </button>
        </div>
        <ul className="space-y-2 text-sm text-white/80">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0f0f0f] px-3 py-2">
              <span>{group.title}</span>
              <button
                onClick={() => removeGroup(group.id)}
                className="rounded-lg border border-state-red/30 bg-state-red/20 p-2 transition hover:bg-state-red/30"
                type="button"
              >
                <Trash2 className="h-4 w-4 text-state-red" />
              </button>
            </li>
          ))}
          {groups.length === 0 && <li className="text-xs text-white/40">Guruhlar hozircha yo‘q.</li>}
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-yellow">
            <UserPlus className="h-5 w-5" />
            <h2 className="text-lg font-semibold">O‘qituvchilar</h2>
          </div>
          <button
            onClick={addTeacher}
            className="flex items-center gap-2 rounded-xl bg-brand-yellow px-3 py-2 text-sm font-medium text-black transition hover:bg-brand-yellow/90"
            type="button"
          >
            <PlusCircle className="h-4 w-4" /> Qo‘shish
          </button>
        </div>
        <ul className="space-y-1 text-sm text-state-red">
          {teachers.map((teacher) => (
            <li key={teacher.id}>• {teacher.name}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-brand-yellow">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">O‘quvchilar</h2>
          </div>
          <select
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm"
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
            <li key={student.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-xs text-white/50">{groupMap.get(student.groupId) ?? '—'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-white/10 px-2 py-1 text-sm text-white/80">{student.bestScore}</span>
                <button
                  onClick={() => banStudent(student.id)}
                  className="rounded-lg border border-state-blue/30 bg-white/10 p-2 text-xs text-state-blue transition hover:bg-white/15"
                  type="button"
                  title="Ban"
                >
                  <Ban className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeStudent(student.id)}
                  className="rounded-lg border border-white/10 bg-state-red/20 p-2 text-xs text-state-red transition hover:bg-state-red/30"
                  type="button"
                  title="O‘chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {filteredStudents.length === 0 && <li className="py-4 text-xs text-white/40">Tanlangan guruh uchun o‘quvchi yo‘q.</li>}
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2 text-brand-yellow">
          <Trophy className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Eng yaxshi o‘quvchilar</h2>
        </div>
        <ul className="space-y-3">
          {topStudents.map((student, index) => (
            <li key={student.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101010] px-4 py-3">
              <div>
                <p className="font-medium text-white">{index + 1}. {student.name}</p>
                <p className="text-xs text-white/50">{student.groupName}</p>
              </div>
              <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-sm font-semibold text-brand-yellow">
                {student.bestScore}
              </span>
            </li>
          ))}
          {topStudents.length === 0 && <li className="text-xs text-white/40">Reyting uchun ma’lumot topilmadi.</li>}
        </ul>
      </section>
    </div>
  );
}

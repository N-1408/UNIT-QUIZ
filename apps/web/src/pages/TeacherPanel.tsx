import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  BookOpen,
  FileSpreadsheet,
  ImagePlus,
  Lock,
  Pencil,
  PlusCircle,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  UserPlus
} from "lucide-react";

const DEFAULT_PASSWORD = "NKN09";
const PASSWORD_KEY = "internation:teacherPassword";
const TEACHER_FLAG_KEY = "internation:isTeacher";

type Group = { id: string; title: string };
type Teacher = { id: string; name: string };
type Student = { id: string; name: string; groupId: string; bestScore: number };
type TestItem = { id: string; title: string; unit: string; tags: string[]; lastUpdated: string };

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
  const [panelPassword, setPanelPassword] = useLocal<string>(PASSWORD_KEY, DEFAULT_PASSWORD);
  const [isAllowed, setIsAllowed] = useLocal<boolean>(TEACHER_FLAG_KEY, false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [tests, setTests] = useLocal<TestItem[]>("internation:tests", [
    { id: "placement", title: "Starter Placement", unit: "Placement", tags: ["Reading", "Grammar"], lastUpdated: "2025-10-12" },
    { id: "unit-1", title: "Unit 1 — Academic Skills", unit: "Unit 1", tags: ["Listening"], lastUpdated: "2025-10-18" },
    { id: "speaking-lite", title: "Speaking Lite", unit: "Speaking Prep", tags: ["Speaking", "Audio"], lastUpdated: "2025-10-24" }
  ]);

  const [groups, setGroups] = useLocal<Group[]>("internation:groups", [
    { id: "g1", title: "CEFR Up A2" },
    { id: "g2", title: "CEFR Up B1" },
    { id: "g3", title: "CEFR Up B2" }
  ]);

  const [teachers, setTeachers] = useLocal<Teacher[]>("internation:teachers", [
    { id: "t1", name: "Alisher aka" },
    { id: "t2", name: "Dilnoza opa" },
    { id: "t3", name: "Sardor aka" }
  ]);

  const [students, setStudents] = useLocal<Student[]>("internation:students", [
    { id: "s1", name: "Javlon Abdullaev", groupId: "g1", bestScore: 82 },
    { id: "s2", name: "Madina Toxtayeva", groupId: "g1", bestScore: 91 },
    { id: "s3", name: "Bobur Musayev", groupId: "g2", bestScore: 77 },
    { id: "s4", name: "Laylo Mahmudova", groupId: "g2", bestScore: 88 },
    { id: "s5", name: "Azizbek Karimov", groupId: "g3", bestScore: 85 }
  ]);

  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const groupMap = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((g) => map.set(g.id, g.title));
    return map;
  }, [groups]);

  const filteredStudents = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return students
      .filter((student) => (filterGroup === "all" ? true : student.groupId === filterGroup))
      .filter((student) => (keyword ? student.name.toLowerCase().includes(keyword) : true))
      .sort((a, b) => b.bestScore - a.bestScore);
  }, [students, filterGroup, searchTerm]);

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
    if (password.trim() === panelPassword) {
      setIsAllowed(true);
      window.localStorage.setItem(TEACHER_FLAG_KEY, JSON.stringify(true));
      setError("");
    } else {
      setError("Parol xato. Qaytadan urinib ko'ring.");
    }
  }

  function addGroup() {
    const title = window.prompt("Yangi guruh nomi:");
    if (!title) return;
    setGroups((prev) => [...prev, { id: randomId("g"), title: title.trim() }]);
  }

  function removeGroup(id: string) {
    if (!window.confirm("Guruhni o'chirasizmi? Bog'liq o'quvchilar filtrlardan yo'qoladi.")) return;
    setGroups((prev) => prev.filter((group) => group.id !== id));
    setStudents((prev) => prev.filter((student) => student.groupId !== id));
    setFilterGroup((current) => (current === id ? "all" : current));
  }

  function addTeacher() {
    const name = window.prompt("O'qituvchi ismi:");
    if (!name) return;
    setTeachers((prev) => [...prev, { id: randomId("t"), name: name.trim() }]);
  }

  function removeTeacher(id: string) {
    if (!window.confirm("O'qituvchini o'chirishni tasdiqlaysizmi?")) return;
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  }

  function removeStudent(id: string) {
    if (!window.confirm("O'quvchini o'chirasizmi?")) return;
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }

  function banStudent(id: string) {
    const student = students.find((item) => item.id === id);
    if (!student) return;
    window.alert(`${student.name} vaqtincha bloklandi (demo). Haqiqiy ban keyingi iteratsiyada ulanadi.`);
  }

  function handleEditTest(id: string) {
    const test = tests.find((item) => item.id === id);
    if (!test) return;
    window.alert(`"${test.title}" uchun editor keyingi bosqichda ishga tushadi.`);
  }

  function handleDeleteTest(id: string) {
    const test = tests.find((item) => item.id === id);
    if (!test) return;
    if (!window.confirm(`"${test.title}" testini o'chirishni xohlaysizmi?`)) return;
    setTests((prev) => prev.filter((item) => item.id !== id));
  }

  function handlePasswordChange(event: React.FormEvent) {
    event.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!currentPwd.trim() || !newPwd.trim() || !confirmPwd.trim()) {
      setPwdError("Barcha maydonlarni to'ldiring.");
      return;
    }

    if (currentPwd !== panelPassword) {
      setPwdError("Joriy parol mos kelmadi.");
      return;
    }

    if (newPwd.length < 4) {
      setPwdError("Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdError("Yangi parol tasdiqlash bilan mos emas.");
      return;
    }

    setPanelPassword(newPwd);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setPwdSuccess("Parol yangilandi. Keyingi kirishda yangi paroldan foydalaning.");
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--fg)]">
        <div className="mx-auto flex max-w-sm flex-col gap-4 rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-6 py-8 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-yellow)]">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wide">Teacher's gate</span>
          </div>
          <h1 className="text-2xl font-semibold">Teacher's Panel</h1>
          <p className="text-sm opacity-70">
            Panel faqat o'qituvchilar uchun. Demo parol:{" "}
            <code className="rounded bg-[var(--elev)] px-1 py-0.5 text-xs">{DEFAULT_PASSWORD}</code>.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Parol (NKN09)"
              className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3 text-sm outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
              type="password"
            />
            {error && (
              <div className="flex items-center gap-2 text-xs text-state-red">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <button className="rounded-xl bg-[var(--brand-yellow)] py-2 text-sm font-semibold text-black transition hover:bg-[var(--brand-yellow)]/90">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 bg-[var(--bg)] px-4 pb-28 pt-6 text-[var(--fg)]">
      <header className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <div className="flex items-center gap-2 text-[var(--brand-yellow)]">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs uppercase tracking-wide">inter-nation.uz • teacher</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold">Teacher's Panel</h1>
        <p className="mt-1 text-sm opacity-70">
          Demo boshqaruv paneli. Ma'lumotlar hozircha localStorage orqali saqlanadi. Supabase integratsiyasi keyingi bosqichda qo'shiladi.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tests</h2>
            <p className="text-sm opacity-70">
              PDF/Image OCR unchalik aniq emas. Excel shablonidan foydalanish tavsiya etiladi.
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => window.alert("PDF yoki rasmdan yuklash: demo bosqichi.")}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3 text-sm font-medium transition hover:bg-[var(--elev)]"
          >
            <ImagePlus className="h-4 w-4" />
            Upload from PDF/Images
          </button>
          <button
            type="button"
            onClick={() => window.alert("Excel import demo bosqichida.")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-3 py-3 text-sm font-semibold text-black transition hover:bg-[var(--brand-yellow)]/90"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Upload from Excel (recommended)
          </button>
          <button
            type="button"
            onClick={() => window.alert("Savol yaratish modal demo.")}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3 text-sm font-medium transition hover:bg-[var(--elev)]"
          >
            <PlusCircle className="h-4 w-4" />
            Create question
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {tests.map((test) => (
            <li key={test.id} className="rounded-2xl border border-[var(--divider)] bg-[var(--bg)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <BookOpen className="h-4 w-4" />
                    <span>{test.unit}</span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{test.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                    {test.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[var(--divider)] bg-[var(--card)] px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditTest(test.id)}
                    className="rounded-xl border border-[var(--divider)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--elev)]"
                  >
                    <div className="flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTest(test.id)}
                    className="rounded-xl border border-state-red/50 px-3 py-2 text-sm font-medium text-state-red transition hover:bg-state-red/10"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </div>
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs opacity-70">Last updated: {test.lastUpdated}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Groups</h2>
          <button
            type="button"
            onClick={addGroup}
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-3 py-2 text-sm font-semibold text-black transition hover:bg-[var(--brand-yellow)]/90"
          >
            <PlusCircle className="h-4 w-4" />
            Add
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center justify-between rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3">
              <span className="font-medium">{group.title}</span>
              <button
                type="button"
                onClick={() => removeGroup(group.id)}
                className="rounded-xl border border-state-red/40 px-3 py-2 text-sm font-medium text-state-red transition hover:bg-state-red/10"
              >
                Delete
              </button>
            </li>
          ))}
          {groups.length === 0 && <li className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3 text-xs opacity-70">Guruhlar hozircha yo'q.</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Teachers</h2>
          <button
            type="button"
            onClick={addTeacher}
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-3 py-2 text-sm font-semibold text-black transition hover:bg-[var(--brand-yellow)]/90"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {teachers.map((teacher) => (
            <li key={teacher.id} className="flex items-center justify-between rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3">
              <span className="font-medium">{teacher.name}</span>
              <button
                type="button"
                onClick={() => removeTeacher(teacher.id)}
                className="rounded-xl border border-state-red/40 px-3 py-2 text-sm font-medium text-state-red transition hover:bg-state-red/10"
              >
                Delete
              </button>
            </li>
          ))}
          {teachers.length === 0 && <li className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3 text-xs opacity-70">O'qituvchilar ro'yxati bo'sh.</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Students</h2>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <select
              className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-2 text-sm"
              value={filterGroup}
              onChange={(event) => setFilterGroup(event.target.value)}
            >
              <option value="all">All groups</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search student"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-[var(--divider)] bg-[var(--bg)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
              />
            </div>
          </div>
        </div>
        <ul className="mt-4 divide-y divide-[var(--divider)]">
          {filteredStudents.map((student) => (
            <li key={student.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-xs opacity-70">{groupMap.get(student.groupId) ?? "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--brand-yellow)]/25 px-3 py-1 text-sm font-semibold text-[var(--brand-yellow)]">
                  {student.bestScore}
                </span>
                <button
                  type="button"
                  onClick={() => banStudent(student.id)}
                  className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-2 text-sm transition hover:bg-[var(--elev)]"
                  title="Mute / Ban"
                >
                  <Ban className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeStudent(student.id)}
                  className="rounded-xl border border-state-red/40 px-3 py-2 text-sm text-state-red transition hover:bg-state-red/10"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {filteredStudents.length === 0 && <li className="py-6 text-center text-xs opacity-70">Tanlangan filtrga mos o'quvchi topilmadi.</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm opacity-70">
          Panel parolini faqat administratorlar o'zgartirishi kerak. Bu funksiya hozircha lokal saqlash orqali ishlaydi.
        </p>
        <form onSubmit={handlePasswordChange} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Current password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="password"
                value={currentPwd}
                onChange={(event) => setCurrentPwd(event.target.value)}
                className="w-full rounded-xl border border-[var(--divider)] bg-[var(--bg)] py-2 pl-9 pr-3 outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
              />
            </div>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">New password</span>
            <input
              type="password"
              value={newPwd}
              onChange={(event) => setNewPwd(event.target.value)}
              className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-2 outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Confirm new password</span>
            <input
              type="password"
              value={confirmPwd}
              onChange={(event) => setConfirmPwd(event.target.value)}
              className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-2 outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--brand-yellow)] px-3 py-2 text-sm font-semibold text-black transition hover:bg-[var(--brand-yellow)]/90"
            >
              Save new password
            </button>
          </div>
        </form>
        <div className="mt-3 text-sm">
          {pwdError && (
            <div className="flex items-center gap-2 text-state-red">
              <AlertCircle className="h-4 w-4" />
              <span>{pwdError}</span>
            </div>
          )}
          {pwdSuccess && <div style={{ color: "var(--green)" }}>{pwdSuccess}</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4">
        <div className="flex items-center gap-2 text-[var(--brand-yellow)]">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Top students</h2>
        </div>
        <ul className="mt-3 space-y-3">
          {topStudents.map((student, index) => (
            <li key={student.id} className="flex items-center justify-between rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3">
              <div>
                <p className="font-medium text-[var(--fg)]">
                  {index + 1}. {student.name}
                </p>
                <p className="text-xs opacity-70">{student.groupName}</p>
              </div>
              <span className="rounded-full bg-[var(--brand-yellow)]/20 px-3 py-1 text-sm font-semibold text-[var(--brand-yellow)]">
                {student.bestScore}
              </span>
            </li>
          ))}
          {topStudents.length === 0 && <li className="rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3 text-xs opacity-70">Reyting uchun ma'lumot topilmadi.</li>}
        </ul>
      </section>
    </div>
  );
}

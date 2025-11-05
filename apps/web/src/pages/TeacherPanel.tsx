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
  Upload,
  Users,
  UserPlus
} from "lucide-react";
import { haptic } from "../lib/tg";
import { useI18n } from "../i18n";

const DEFAULT_PASSWORD = "NKN09";
const PASSWORD_KEY = "nova-lc:teacherPassword";
const TEACHER_FLAG_KEY = "nova-lc:isTeacher";

type Group = { id: string; title: string; teacherId?: string };
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

function formatString(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((acc, [key, val]) => acc.replace(`{${key}}`, String(val)), template);
}

export default function TeacherPanel() {
  const { t } = useI18n();

  const [panelPassword, setPanelPassword] = useLocal<string>(PASSWORD_KEY, DEFAULT_PASSWORD);
  const [isAllowed, setIsAllowed] = useLocal<boolean>(TEACHER_FLAG_KEY, false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [tests, setTests] = useLocal<TestItem[]>("nova-lc:tests", [
    { id: "placement", title: "Starter Placement", unit: "Placement", tags: ["Reading", "Grammar"], lastUpdated: "2025-10-12" },
    { id: "unit-1", title: "Unit 1 - Academic Skills", unit: "Unit 1", tags: ["Listening"], lastUpdated: "2025-10-18" },
    { id: "speaking-lite", title: "Speaking Lite", unit: "Speaking Prep", tags: ["Speaking", "Audio"], lastUpdated: "2025-10-24" }
  ]);

  const [teachers, setTeachers] = useLocal<Teacher[]>("nova-lc:teachers", [
    { id: "t1", name: "Alisher aka" },
    { id: "t2", name: "Dilnoza opa" },
    { id: "t3", name: "Sardor aka" }
  ]);

  const [groups, setGroups] = useLocal<Group[]>("nova-lc:groups", [
    { id: "g1", title: "CEFR Up A2", teacherId: "t1" },
    { id: "g2", title: "CEFR Up B1", teacherId: "t2" },
    { id: "g3", title: "CEFR Up B2", teacherId: "t3" }
  ]);

  const [students, setStudents] = useLocal<Student[]>("nova-lc:students", [
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

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaImageName, setMediaImageName] = useState("");
  const [mediaAudioName, setMediaAudioName] = useState("");

  const [editingTeacher, setEditingTeacher] = useState<{ id: string; name: string } | null>(null);
  const [editingTeacherName, setEditingTeacherName] = useState("");
  const [editingGroup, setEditingGroup] = useState<{ id: string; title: string; teacherId?: string } | null>(null);
  const [groupDraftTitle, setGroupDraftTitle] = useState("");
  const [groupDraftTeacherId, setGroupDraftTeacherId] = useState<string>("");

  const groupNameById = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((g) => map.set(g.id, g.title));
    return map;
  }, [groups]);

  const studentCounts = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((student) => {
      map.set(student.groupId, (map.get(student.groupId) ?? 0) + 1);
    });
    return map;
  }, [students]);

  const teacherGroupCounts = useMemo(() => {
    const map = new Map<string, number>();
    groups.forEach((group) => {
      if (!group.teacherId) return;
      map.set(group.teacherId, (map.get(group.teacherId) ?? 0) + 1);
    });
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
        groupName: groupNameById.get(student.groupId) ?? "-"
      }));
  }, [students, groupNameById]);

  useEffect(() => {
    if (isAllowed) {
      setError("");
      setPassword("");
    }
  }, [isAllowed]);

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (password.trim() === panelPassword) {
      haptic.success();
      setIsAllowed(true);
      window.localStorage.setItem(TEACHER_FLAG_KEY, JSON.stringify(true));
      setError("");
    } else {
      haptic.error();
      setError(t("wrongPassword"));
    }
  }

  function addGroup() {
    haptic.tap();
    const title = window.prompt(t("addGroup"));
    if (!title) return;
    setGroups((prev) => [
      ...prev,
      { id: randomId("g"), title: title.trim(), teacherId: teachers[0]?.id }
    ]);
  }

  function removeGroup(id: string) {
    if (!window.confirm(`${t("delete")}?`)) return;
    haptic.warn();
    setGroups((prev) => prev.filter((group) => group.id !== id));
    setStudents((prev) => prev.filter((student) => student.groupId !== id));
    setFilterGroup((current) => (current === id ? "all" : current));
  }

  function addTeacher() {
    haptic.tap();
    const name = window.prompt(t("addTeacher"));
    if (!name) return;
    setTeachers((prev) => [...prev, { id: randomId("t"), name: name.trim() }]);
  }

  function removeTeacher(id: string) {
    if (!window.confirm(`${t("delete")}?`)) return;
    haptic.warn();
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    setGroups((prev) => prev.map((group) => (group.teacherId === id ? { ...group, teacherId: undefined } : group)));
  }

  function removeStudent(id: string) {
    if (!window.confirm(`${t("delete")}?`)) return;
    haptic.warn();
    setStudents((prev) => prev.filter((student) => student.id !== id));
  }

  function banStudent(id: string) {
    const student = students.find((item) => item.id === id);
    if (!student) return;
    haptic.warn();
    alert(formatString(t("demoBanMessage"), { name: student.name }));
  }

  function handleEditTest(id: string) {
    const test = tests.find((item) => item.id === id);
    if (!test) return;
    haptic.tap();
    alert(`${test.title} вЂ” ${t("testsDemoNote")}`);
  }

  function handleDeleteTest(id: string) {
    const test = tests.find((item) => item.id === id);
    if (!test) return;
    if (!window.confirm(`${t("delete")}?`)) return;
    haptic.warn();
    setTests((prev) => prev.filter((item) => item.id !== id));
  }

  function handlePasswordChange(event: React.FormEvent) {
    event.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!currentPwd.trim() || !newPwd.trim() || !confirmPwd.trim()) {
      haptic.error();
      setPwdError(t("fillAllFields"));
      return;
    }

    if (currentPwd !== panelPassword) {
      haptic.error();
      setPwdError(t("wrongPassword"));
      return;
    }

    if (newPwd.length < 4) {
      haptic.error();
      setPwdError(t("passwordTooShort"));
      return;
    }

    if (newPwd !== confirmPwd) {
      haptic.error();
      setPwdError(t("passwordMismatch"));
      return;
    }

    haptic.success();
    setPanelPassword(newPwd);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setPwdSuccess(t("mockSaved"));
  }

  const openTeacherEditor = (teacher: Teacher) => {
    haptic.tap();
    setEditingTeacher({ id: teacher.id, name: teacher.name });
    setEditingTeacherName(teacher.name);
  };

  const saveTeacherEdit = () => {
    if (!editingTeacher) return;
    const trimmed = editingTeacherName.trim();
    if (!trimmed) {
      haptic.error();
      alert(t("fillAllFields"));
      return;
    }
    setTeachers((prev) => prev.map((item) => (item.id === editingTeacher.id ? { ...item, name: trimmed } : item)));
    haptic.success();
    alert(t("mockSaved"));
    setEditingTeacher(null);
  };

  const openGroupEditor = (group: Group) => {
    haptic.tap();
    setEditingGroup({ id: group.id, title: group.title, teacherId: group.teacherId });
    setGroupDraftTitle(group.title);
    setGroupDraftTeacherId(group.teacherId ?? "");
  };

  const saveGroupEdit = () => {
    if (!editingGroup) return;
    const trimmed = groupDraftTitle.trim();
    if (!trimmed) {
      haptic.error();
      alert(t("fillAllFields"));
      return;
    }
    setGroups((prev) =>
      prev.map((item) =>
        item.id === editingGroup.id ? { ...item, title: trimmed, teacherId: groupDraftTeacherId || undefined } : item
      )
    );
    haptic.success();
    alert(t("mockSaved"));
    setEditingGroup(null);
  };

  const closeMediaModal = () => {
    setMediaModalOpen(false);
    setMediaImageName("");
    setMediaAudioName("");
  };

  const saveMediaModal = () => {
    haptic.success();
    alert(t("mockSaved"));
    closeMediaModal();
  };

  if (!isAllowed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 bg-[var(--bg)] px-4 pb-24 pt-6 text-sm text-[var(--fg)]">
          <div className="mx-auto mt-5 flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-[var(--divider)] bg-[var(--card)] px-6 py-8 shadow-sm">
            <div className="flex items-center gap-2 text-[var(--brand-yellow)]">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs uppercase tracking-wide">Teacher's gate</span>
            </div>
            <h1 className="text-2xl font-semibold">{t("teacherPanel")}</h1>
            <p className="text-sm section-sub">{t("teacherPanelNote")}</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="NKN09"
                className="rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-3 text-sm outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
                type="password"
              />
              {error && (
                <div className="flex items-center gap-2 text-xs text-state-red">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              <button className="btn btn-primary tap rounded-xl" type="submit">
                {t("openTeacher")}
              </button>
            </form>
          </div>
        </div>
    );
  }

  return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-5 bg-[var(--bg)] px-4 pb-28 pt-6 text-sm text-[var(--fg)]">
        <header className="card mt-5">
          <div className="flex items-center gap-2 text-[var(--brand-yellow)]">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wide">inter-nation.uz / teacher</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold">{t("teacherPanel")}</h1>
          <p className="mt-1 section-sub text-sm">{t("teacherPanelNote")}</p>
        </header>

        <section className="card mt-5 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("testsTitle")}</h2>
            <p className="section-sub text-sm">{t("testsIntroNote")}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              haptic.tap();
              alert(t("testsDemoNote"));
            }}
            className="btn btn-primary tap"
          >
            <ImagePlus className="h-4 w-4" /> {t("uploadPdfImg")}
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.tap();
              alert(t("testsDemoNote"));
            }}
            className="btn btn-primary tap"
          >
            <FileSpreadsheet className="h-4 w-4" /> {t("uploadExcel")}
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.tap();
              alert(t("testsDemoNote"));
            }}
            className="btn btn-primary tap"
          >
            <PlusCircle className="h-4 w-4" /> {t("createQuestion")}
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.tap();
              setMediaModalOpen(true);
            }}
            className="btn btn-primary tap"
          >
            <Upload className="h-4 w-4" /> {t("addImageAudioTest")}
          </button>
        </div>

        <ul className="space-y-3">
          {tests.map((test) => (
            <li key={test.id} className="card space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs section-sub">
                    <BookOpen className="h-4 w-4" />
                    <span>{test.unit}</span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{test.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs section-sub">
                    {test.tags.map((tag) => (
                      <span key={tag} className="badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditTest(test.id)}
                    className="btn btn-ghost tap"
                    title={t("tooltipEdit")}
                  >
                    <Pencil className="h-4 w-4" /> {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTest(test.id)}
                    className="btn btn-danger tap"
                    title={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" /> {t("delete")}
                  </button>
                </div>
              </div>
              <p className="text-xs section-sub">
                {`${t("lastAttempt")}: ${test.lastUpdated}`}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t("groups")}</h2>
          <button type="button" onClick={addGroup} className="btn btn-primary tap">
            <PlusCircle className="h-4 w-4" /> {t("addGroup")}
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {groups.map((group) => {
            const count = studentCounts.get(group.id) ?? 0;
            const teacherName = teachers.find((teacher) => teacher.id === group.teacherId)?.name ?? t("teacher");
            return (
              <li key={group.id} className="flex items-center justify-between rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3">
                <div>
                  <p className="font-semibold">{group.title}</p>
                  <p className="text-xs section-sub">
                    {teacherName} В· {formatString(t("groupSummary"), { count })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost tap"
                    onClick={() => openGroupEditor(group)}
                    title={t("tooltipEdit")}
                  >
                    <Pencil className="h-4 w-4" /> {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGroup(group.id)}
                    className="btn btn-danger tap"
                    title={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" /> {t("delete")}
                  </button>
                </div>
              </li>
            );
          })}
          {groups.length === 0 && (
            <li className="rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3 text-xs section-sub">
              {t("noResults")}
            </li>
          )}
        </ul>
      </section>

      <section className="card mt-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t("teachers")}</h2>
          <button type="button" onClick={addTeacher} className="btn btn-primary tap">
            <UserPlus className="h-4 w-4" /> {t("addTeacher")}
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {teachers.map((teacher) => {
            const count = teacherGroupCounts.get(teacher.id) ?? 0;
            return (
              <li key={teacher.id} className="flex items-center justify-between rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3">
                <div>
                  <p className="font-semibold">{teacher.name}</p>
                  <p className="text-xs section-sub">{formatString(t("teacherSummary"), { count })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost tap"
                    onClick={() => openTeacherEditor(teacher)}
                    title={t("tooltipEdit")}
                  >
                    <Pencil className="h-4 w-4" /> {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTeacher(teacher.id)}
                    className="btn btn-danger tap"
                    title={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" /> {t("delete")}
                  </button>
                </div>
              </li>
            );
          })}
          {teachers.length === 0 && (
            <li className="rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3 text-xs section-sub">
              {t("noResults")}
            </li>
          )}
        </ul>
      </section>

      <section className="card mt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{t("students")}</h2>
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <select
              className="tap rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 text-sm"
              value={filterGroup}
              onChange={(event) => {
                haptic.tap();
                setFilterGroup(event.target.value);
              }}
            >
              <option value="all">{t("groupFilter")}</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </select>
            <div className="relative w-full sm:w-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="search"
                placeholder={t("searchStudent")}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
              />
            </div>
          </div>
        </div>
        <ul className="divide-y divide-[var(--divider)]">
          {filteredStudents.map((student) => (
            <li key={student.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-xs section-sub">{groupNameById.get(student.groupId) ?? "-"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-green">{student.bestScore}</span>
                <button
                  type="button"
                  onClick={() => banStudent(student.id)}
                  className="tap rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-2"
                  title={t("tooltipBan")}
                >
                  <Ban className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeStudent(student.id)}
                  className="tap rounded-xl border border-[var(--divider)] bg-[var(--bg)] px-3 py-2 text-state-red"
                  title={t("tooltipDelete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {filteredStudents.length === 0 && (
            <li className="py-6 text-center text-xs section-sub">{t("noResults")}</li>
          )}
        </ul>
      </section>

      <section className="card mt-5 space-y-4">
        <h2 className="text-lg font-semibold">{t("security")}</h2>
        <p className="section-sub text-sm">{t("changePassword")}</p>
        <form onSubmit={handlePasswordChange} className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">{t("currentPassword")}</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="password"
                value={currentPwd}
                onChange={(event) => setCurrentPwd(event.target.value)}
                className="w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] py-2 pl-9 pr-3 outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
              />
            </div>
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">{t("newPassword")}</span>
            <input
              type="password"
              value={newPwd}
              onChange={(event) => setNewPwd(event.target.value)}
              className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">{t("confirmPassword")}</span>
            <input
              type="password"
              value={confirmPwd}
              onChange={(event) => setConfirmPwd(event.target.value)}
              className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 outline-none focus:border-[var(--brand-yellow)]/70 focus:ring-1 focus:ring-[var(--brand-yellow)]/70"
            />
          </label>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary tap w-full">
              {t("savePassword")}
            </button>
          </div>
        </form>
        <div className="text-sm">
          {pwdError && (
            <div className="flex items-center gap-2 text-state-red">
              <AlertCircle className="h-4 w-4" />
              <span>{pwdError}</span>
            </div>
          )}
          {pwdSuccess && <div style={{ color: "var(--green)" }}>{pwdSuccess}</div>}
        </div>
      </section>

      <section className="card mt-5 space-y-3">
        <div className="flex items-center gap-2 text-[var(--brand-yellow)]">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-semibold">{t("topStudents")}</h2>
        </div>
        <ul className="space-y-2">
          {topStudents.map((student, index) => (
            <li
              key={student.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3"
            >
              <div>
                <p className="font-medium text-[var(--fg)]">#{index + 1} {student.name}</p>
                <p className="text-xs section-sub">{student.groupName}</p>
              </div>
              <span className="badge badge-green">{student.bestScore}</span>
            </li>
          ))}
          {topStudents.length === 0 && (
            <li className="rounded-2xl border border-[var(--divider)] bg-[var(--bg)] px-4 py-3 text-xs section-sub">
              {t("noResults")}
            </li>
          )}
        </ul>
      </section>

      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--overlay)' }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--divider)] bg-[var(--bg)] p-5">
            <h3 className="text-lg font-semibold">{t("addImageAudioTest")}</h3>
            <p className="mt-1 text-sm section-sub">{t("demoModalNote")}</p>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex flex-col gap-2">
                <span>{t("pickImage")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setMediaImageName(event.target.files?.[0]?.name ?? "")}
                  className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
                />
                {mediaImageName && <span className="text-xs section-sub">{mediaImageName}</span>}
              </label>
              <label className="flex flex-col gap-2">
                <span>{t("pickAudio")}</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) => setMediaAudioName(event.target.files?.[0]?.name ?? "")}
                  className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
                />
                {mediaAudioName && <span className="text-xs section-sub">{mediaAudioName}</span>}
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost tap"
                onClick={() => {
                  haptic.tap();
                  closeMediaModal();
                }}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary tap"
                onClick={() => {
                  haptic.tap();
                  saveMediaModal();
                }}
              >
                {t("saveMock")}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--overlay)' }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--divider)] bg-[var(--bg)] p-5">
            <h3 className="text-lg font-semibold">{t("teacherEditTitle")}</h3>
            <div className="mt-3 space-y-3 text-sm">
              <label className="flex flex-col gap-2">
                <span>{t("name")}</span>
                <input
                  value={editingTeacherName}
                  onChange={(event) => setEditingTeacherName(event.target.value)}
                  className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost tap"
                onClick={() => {
                  haptic.tap();
                  setEditingTeacher(null);
                }}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary tap"
                onClick={() => {
                  haptic.tap();
                  saveTeacherEdit();
                }}
              >
                {t("saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--overlay)' }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--divider)] bg-[var(--bg)] p-5">
            <h3 className="text-lg font-semibold">{t("groupEditTitle")}</h3>
            <div className="mt-3 space-y-3 text-sm">
              <label className="flex flex-col gap-2">
                <span>{t("name")}</span>
                <input
                  value={groupDraftTitle}
                  onChange={(event) => setGroupDraftTitle(event.target.value)}
                  className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span>{t("assignedTeacher")}</span>
                <select
                  value={groupDraftTeacherId}
                  onChange={(event) => setGroupDraftTeacherId(event.target.value)}
                  className="rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
                >
                  <option value="">{t("teacher")}</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost tap"
                onClick={() => {
                  haptic.tap();
                  setEditingGroup(null);
                }}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary tap"
                onClick={() => {
                  haptic.tap();
                  saveGroupEdit();
                }}
              >
                {t("saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

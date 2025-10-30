import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../components/Switch";
import { getTheme, setTheme } from "../lib/theme";

type Group = { id: string; title: string };
type Teacher = { id: string; name: string };

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const [groups] = useState<Group[]>([
    { id: "g1", title: "CEFR Up A2" },
    { id: "g2", title: "CEFR Up B1" },
    { id: "g3", title: "CEFR Up B2" }
  ]);

  const [teachers] = useState<Teacher[]>([
    { id: "t1", name: "Alisher aka" },
    { id: "t2", name: "Dilnoza opa" },
    { id: "t3", name: "Sardor aka" }
  ]);

  const [fullName, setFullName] = useState<string>(() => getLocal("internation:user.fullName", ""));
  const [groupId, setGroupId] = useState<string>(() => getLocal("internation:user.groupId", "g1"));
  const [teacherId, setTeacherId] = useState<string>(() => getLocal("internation:user.teacherId", "t1"));

  const [dark, setDark] = useState(() => getTheme() === "dark");

  useEffect(() => {
    setLocal("internation:user.fullName", fullName);
  }, [fullName]);

  useEffect(() => {
    setLocal("internation:user.groupId", groupId);
  }, [groupId]);

  useEffect(() => {
    setLocal("internation:user.teacherId", teacherId);
  }, [teacherId]);

  useEffect(() => {
    setTheme(dark ? "dark" : "light");
  }, [dark]);

  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    alert("Saqlandi.");
  }

  function openTeacherPanel() {
    setShowPwd(true);
  }

  function checkPassword(event: React.FormEvent) {
    event.preventDefault();
    if (pwd.trim() === "NKN09") {
      setLocal("internation:isTeacher", true);
      setPwd("");
      setPwdErr("");
      setShowPwd(false);
      navigate("/teacher");
    } else {
      setPwdErr("Parol xato. Qaytadan urinib ko‘ring.");
    }
  }

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <h1 className="mb-4 text-xl font-semibold">Settings</h1>

      <section className="card p-4">
        <h2 className="mb-3 font-medium">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-3">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Full name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="e.g. Ali Valiyev"
              className="mt-1 w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-[var(--muted)]">Group</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
              value={groupId}
              onChange={(event) => setGroupId(event.target.value)}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-[var(--muted)]">Teacher</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2"
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-between gap-4 pt-2 text-sm">
            <span className="text-[var(--muted)]">Dark theme</span>
            <Switch checked={dark} onChange={setDark} label="Dark theme toggle" />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </section>

      <section className="card mt-6 p-4">
        <h2 className="mb-3 font-medium">Teacher’s panel</h2>
        <p className="mb-3 text-sm text-[var(--muted)]">Panelga kirish uchun faqat parol talab qilinadi.</p>
        <button onClick={openTeacherPanel} className="btn-primary">
          Open teacher mode
        </button>
      </section>

      {showPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--overlay)' }}>
          <div className="w-full max-w-sm rounded-2xl border border-[var(--divider)] bg-[var(--elev)] p-4">
            <h3 className="mb-2 font-medium">Panel password</h3>
            <form onSubmit={checkPassword} className="space-y-3">
              <input
                value={pwd}
                onChange={(event) => setPwd(event.target.value)}
                className="w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 outline-none"
                type="password"
                placeholder="NKN09"
              />
              {pwdErr && <div className="text-sm text-state-red">{pwdErr}</div>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPwd(false);
                    setPwd("");
                    setPwdErr("");
                  }}
                  className="btn-ghost flex-1 !w-auto text-center"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 !w-auto">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

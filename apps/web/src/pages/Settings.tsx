import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    // ignore
  }
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const [groups] = useState<Group[]>([
    { id: 'g1', title: 'CEFR Up A2' },
    { id: 'g2', title: 'CEFR Up B1' },
    { id: 'g3', title: 'CEFR Up B2' }
  ]);
  const [teachers] = useState<Teacher[]>([
    { id: 't1', name: 'Alisher aka' },
    { id: 't2', name: 'Dilnoza opa' },
    { id: 't3', name: 'Sardor aka' }
  ]);

  const [fullName, setFullName] = useState<string>(() => getLocal('internation:user.fullName', ''));
  const [groupId, setGroupId] = useState<string>(() => getLocal('internation:user.groupId', 'g1'));
  const [teacherId, setTeacherId] = useState<string>(() => getLocal('internation:user.teacherId', 't1'));

  const [dark, setDark] = useState<boolean>(() => getLocal('internation:theme.dark', true));

  useEffect(() => {
    setLocal('internation:user.fullName', fullName);
  }, [fullName]);
  useEffect(() => {
    setLocal('internation:user.groupId', groupId);
  }, [groupId]);
  useEffect(() => {
    setLocal('internation:user.teacherId', teacherId);
  }, [teacherId]);
  useEffect(() => {
    setLocal('internation:theme.dark', dark);
  }, [dark]);

  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    alert('Saqlandi.');
  }

  function openTeacherPanel() {
    setShowPwd(true);
  }

  function checkPassword(event: React.FormEvent) {
    event.preventDefault();
    if (pwd.trim() === 'NKN09') {
      setLocal('internation:isTeacher', true);
      setPwd('');
      setPwdErr('');
      setShowPwd(false);
      navigate('/teacher');
    } else {
      setPwdErr('Parol xato. Qaytadan urinib ko‘ring.');
    }
  }

  return (
    <div className="mx-auto max-w-md p-4 pb-24 text-white">
      <h1 className="mb-4 text-xl font-semibold">Sozlamalar</h1>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-3 font-medium">Profil</h2>
        <form onSubmit={saveProfile} className="space-y-3">
          <label className="block text-sm">
            <span className="text-white/70">Ism Familiya</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Masalan: Ali Valiyev"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-white/70">Guruh</span>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
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
            <span className="text-white/70">Teacher</span>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2"
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

          <div className="flex items-center justify-between pt-2 text-sm">
            <span className="text-white/70">Mavzu</span>
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
            >
              {dark ? 'Dark (qora)' : 'Light'}
            </button>
          </div>

          <div className="pt-2">
            <button className="w-full rounded-xl bg-brand-yellow py-2 text-sm font-medium text-black hover:bg-brand-yellow/90">
              Saqlash
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-3 font-medium">Teacher’s panel</h2>
        <p className="mb-3 text-sm text-white/70">Panelga kirish uchun faqat parol talab qilinadi.</p>
        <button
          onClick={openTeacherPanel}
          className="w-full rounded-xl bg-brand-yellow py-2 text-sm font-medium text-black hover:bg-brand-yellow/90"
        >
          Panelga kirish
        </button>
      </section>

      {showPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111111]/95 p-4">
            <h3 className="mb-2 font-medium">Parol</h3>
            <form onSubmit={checkPassword} className="space-y-3">
              <input
                value={pwd}
                onChange={(event) => setPwd(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                type="password"
                placeholder="NKN09"
              />
              {pwdErr && <div className="text-sm text-state-red">{pwdErr}</div>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPwd(false);
                    setPwd('');
                    setPwdErr('');
                  }}
                  className="flex-1 rounded-xl bg-white/10 py-2 hover:bg-white/15"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-brand-yellow py-2 text-sm font-medium text-black hover:bg-brand-yellow/90"
                >
                  Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

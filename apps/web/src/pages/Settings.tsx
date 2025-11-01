import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../components/Switch";
import { getTheme, setTheme } from "../lib/theme";
import { haptic } from "../lib/tg";
import { useI18n, type Lang } from "../i18n";

type Group = { id: string; title: string };
type Teacher = { id: string; name: string };

const LANGUAGE_OPTIONS: Array<{ code: Lang; labelKey: string }> = [
  { code: "en", labelKey: "languageEnglishFlag" },
  { code: "uz", labelKey: "languageUzbekFlag" },
  { code: "ru", labelKey: "languageRussianFlag" }
];

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
  const { t, lang, setLang } = useI18n();

  const [groups] = useState<Group[]>([{
    id: "g1",
    title: "CEFR Up A2"
  }, {
    id: "g2",
    title: "CEFR Up B1"
  }, {
    id: "g3",
    title: "CEFR Up B2"
  }]);

  const [teachers] = useState<Teacher[]>([{
    id: "t1",
    name: "Alisher aka"
  }, {
    id: "t2",
    name: "Dilnoza opa"
  }, {
    id: "t3",
    name: "Sardor aka"
  }]);

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

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    haptic.success();
    alert(t("mockSaved"));
  };

  const openTeacherPanel = () => {
    setShowPwd(true);
  };

  const checkPassword = (event: React.FormEvent) => {
    event.preventDefault();
    if (pwd.trim() === "NKN09") {
      haptic.success();
      setLocal("internation:isTeacher", true);
      setPwd("");
      setPwdErr("");
      setShowPwd(false);
      navigate("/teacher");
    } else {
      haptic.error();
      setPwdErr(t("wrongPassword"));
    }
  };

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <h1 className="mb-4 text-xl font-semibold">{t("settings")}</h1>

      <section className="card p-4">
        <h2 className="mb-3 font-medium">{t("profile")}</h2>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">{t("fullName")}</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder={t("fullNamePlaceholder")}
              className="mt-1 w-full rounded-xl border border-[var(--divider)] bg-[var(--card)] px-3 py-2 outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-[var(--muted)]">{t("group")}</span>
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
            <span className="text-[var(--muted)]">{t("teacher")}</span>
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
            <span className="text-[var(--muted)]">{t("darkTheme")}</span>
            <Switch
              checked={dark}
              onChange={(next) => setDark(next)}
              label={`${t("darkTheme")} toggle`}
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn btn-primary tap" onClick={() => haptic.tap()}>
              {t("save")}
            </button>
          </div>
        </form>
      </section>

      <section className="card mt-6 p-4">
        <h2 className="mb-3 font-medium">{t("languageCardTitle")}</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`pill tap ${lang === option.code ? "pill-active" : ""}`}
              onClick={() => {
                haptic.tap();
                setLang(option.code);
              }}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </section>

      <section className="card mt-6 p-4">
        <h2 className="mb-3 font-medium">{t("teacherPanel")}</h2>
        <p className="mb-3 text-sm text-[var(--muted)]">{t("teacherPanelNote")}</p>
        <button
          onClick={() => {
            haptic.tap();
            openTeacherPanel();
          }}
          className="btn btn-primary tap"
        >
          {t("openTeacher")}
        </button>
      </section>

      {showPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--overlay)' }}>
          <div className="w-full max-w-sm rounded-2xl border border-[var(--divider)] bg-[var(--elev)] p-4">
            <h3 className="mb-2 font-medium">{t("panelPassword")}</h3>
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
                    haptic.tap();
                    setShowPwd(false);
                    setPwd("");
                    setPwdErr("");
                  }}
                  className="btn btn-ghost tap flex-1 !w-auto text-center"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary tap flex-1 !w-auto"
                  onClick={() => haptic.tap()}
                >
                  {t("continue")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

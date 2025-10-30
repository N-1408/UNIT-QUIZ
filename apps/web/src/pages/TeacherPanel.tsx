const groupList = [
  { id: "g1", title: "CEFR Up A2", members: 18 },
  { id: "g2", title: "CEFR Up B1", members: 22 },
  { id: "g3", title: "CEFR Up B2", members: 16 }
] as const;

const teacherList = [
  { id: "t1", name: "Alisher aka", groups: 2 },
  { id: "t2", name: "Dilnoza opa", groups: 1 },
  { id: "t3", name: "Sardor aka", groups: 1 }
] as const;

const studentList = [
  { id: "s1", name: "Azizbek Karimov", group: "CEFR Up B1" },
  { id: "s2", name: "Laylo Mahmudova", group: "CEFR Up B2" },
  { id: "s3", name: "Madina To'xtayeva", group: "CEFR Up A2" }
] as const;

const actionButton =
  "rounded-xl border border-[var(--divider)] px-3 py-2 text-sm font-medium transition hover:opacity-80";
const dangerButton = "rounded-xl px-3 py-2 text-sm font-medium transition hover:opacity-80";

export default function TeacherPanel() {
  return (
    <div className="mx-auto max-w-md p-4 pb-24 text-[15px]">
      <header className="card p-4">
        <h1 className="text-lg font-semibold">Teacher panel</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Guruhlarni boshqarish, o'qituvchilarni tayinlash va o'quvchilarni nazorat qilish uchun tezkor maket.
        </p>
        <div className="mt-3 flex gap-2">
          <button type="button" className={actionButton}>
            Yangi test
          </button>
          <button
            type="button"
            className={dangerButton}
            style={{ color: "var(--red)" }}
          >
            Testni o'chirish
          </button>
        </div>
      </header>

      <section className="card mt-5 p-4">
        <h2 className="text-lg font-semibold mb-3">Guruhlar</h2>
        <div className="mb-3 flex justify-end">
          <button type="button" className={actionButton}>
            Qo'shish
          </button>
        </div>
        <ul className="space-y-3">
          {groupList.map((group) => (
            <li key={group.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {group.title}
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {group.members} ta o'quvchi
                </p>
              </div>
              <button
                type="button"
                className={dangerButton}
                style={{ color: "var(--red)" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-5 p-4">
        <h2 className="text-lg font-semibold mb-3">O'qituvchilar</h2>
        <div className="mb-3 flex justify-end">
          <button type="button" className={actionButton}>
            Qo'shish
          </button>
        </div>
        <ul className="space-y-3">
          {teacherList.map((teacher) => (
            <li key={teacher.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {teacher.name}
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {teacher.groups} ta guruh
                </p>
              </div>
              <button
                type="button"
                className={dangerButton}
                style={{ color: "var(--red)" }}
              >
                Ban
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-5 p-4">
        <h2 className="text-lg font-semibold mb-3">O'quvchilar</h2>
        <div className="mb-3 flex justify-end">
          <button type="button" className={actionButton}>
            Qo'shish
          </button>
        </div>
        <ul className="space-y-3">
          {studentList.map((student) => (
            <li key={student.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {student.name}
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {student.group}
                </p>
              </div>
              <button
                type="button"
                className={dangerButton}
                style={{ color: "var(--red)" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

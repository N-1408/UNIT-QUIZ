import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StatCard } from "@/components/common/StatCard";
import { ExamCard, type ExamSummary } from "@/components/exams/ExamCard";
import { useAuthStore } from "@/store/useAuth";

const emoji = {
  wave: String.fromCodePoint(0x1f44b),
  coffee: String.fromCodePoint(0x2615, 0xfe0f),
  rocket: String.fromCodePoint(0x1f680),
  medal: String.fromCodePoint(0x1f3c5),
  memo: String.fromCodePoint(0x1f4dd),
  book: String.fromCodePoint(0x1f4da),
  wink: String.fromCodePoint(0x1f609)
};

const arrowRight = String.fromCharCode(0x2192);

const MOCK_EXAMS: ExamSummary[] = [
  {
    id: 1,
    title: "Listening Sprint",
    startsAt: new Date(Date.now() + 1000 * 60 * 45),
    durationMinutes: 30,
    status: "upcoming"
  },
  {
    id: 2,
    title: "Reading Marathon",
    startsAt: null,
    durationMinutes: 60,
    status: "open"
  },
  {
    id: 3,
    title: "Grammar Clinic",
    startsAt: null,
    durationMinutes: 35,
    status: "open"
  }
];

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.12 }
  }
};

const blockVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } }
};

export const HomePage = () => {
  const session = useAuthStore((state) => state.session);
  const displayName = session?.fullName?.trim() || "do'stimiz";

  const subtitleOptions = [
    `Bugun o'zingizni sinovdan o'tkazamizmi yoki choy ichamizmi? ${emoji.coffee}`,
    `Yangi natijalarga tayyormisiz? ${emoji.rocket}`,
    "Imtihonlar sizni sog'indi."
  ];
  const subtitle =
    subtitleOptions[displayName.length % subtitleOptions.length] ??
    subtitleOptions[0];

  const latestScore = "87%";
  const openExams = useMemo(
    () => MOCK_EXAMS.filter((exam) => exam.status === "open").slice(0, 2),
    []
  );
  const lastExamTitle = openExams[0]?.title ?? "Hali yo'q";

  const stats = useMemo(
    () => [
      {
        label: "So'nggi natijangiz",
        value: latestScore,
        hint: "Oxirgi yutuq darajasi.",
        icon: emoji.medal
      },
      {
        label: "Oxirgi imtihon",
        value: lastExamTitle,
        hint: "Eng so'nggi urinish.",
        icon: emoji.memo
      }
    ],
    [latestScore, lastExamTitle]
  );

  return (
    <motion.div
      className="flex flex-col gap-6 pb-24"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section
        variants={blockVariants}
        className="rounded-[24px] border border-border bg-surface/95 p-5 shadow-elev-sm"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-text-primary">
            {`Salom, ${displayName}! ${emoji.wave}`}
          </h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
          <Link
            to="/exams"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-swift ease-fluid hover:bg-brand-dark active:scale-[0.98]"
          >
            {emoji.rocket} Keling, boshlaymiz!
          </Link>
        </div>
      </motion.section>

      <motion.section variants={blockVariants} className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={blockVariants}
            transition={{ delay: index * 0.08 }}
          >
            <StatCard
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              icon={stat.icon}
            />
          </motion.div>
        ))}
      </motion.section>

      <motion.section variants={blockVariants} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">
            {`${emoji.book} Siz uchun ochiq testlar`}
          </h2>
          <Link
            to="/exams"
            className="text-sm font-semibold text-brand transition duration-swift ease-fluid hover:text-brand-dark"
          >
            {`Barchasini ko'rish ${arrowRight}`}
          </Link>
        </div>

        {openExams.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {openExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                variants={blockVariants}
                transition={{ delay: index * 0.1 }}
              >
                <ExamCard exam={exam} className="min-w-[160px]" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={blockVariants}
            className="rounded-[20px] border border-border bg-surface/90 px-4 py-6 text-sm text-text-secondary shadow-elev-sm"
          >
            {`Hozircha imtihon yo'q, lekin tez orada bo'ladi ${emoji.wink}`}
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
};

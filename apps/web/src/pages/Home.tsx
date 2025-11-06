import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuth";

const emojis = {
  wave: "👋",
  coffee: "☕️",
  rocket: "🚀",
  flame: "🔥",
  medal: "🏅",
  bulb: "💡",
  book: "📖",
  wink: "😉"
};

const arrowRight = String.fromCharCode(0x2192);

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut", staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } }
};

export const HomePage = () => {
  const session = useAuthStore((state) => state.session);
  const rawName =
    (session as { full_name?: string } | null)?.full_name ??
    session?.fullName ??
    "do'stimiz";
  const displayName = rawName.trim() || "do'stimiz";

  const subtitleOptions = [
    `Bugun sinovlarmi yoki choy ichamizmi? ${emojis.coffee}`,
    `Yangi natijalarga tayyormisiz? ${emojis.rocket}`,
    "Imtihonlar sizni sog'indi."
  ];
  const subtitle =
    subtitleOptions[displayName.length % subtitleOptions.length] ??
    subtitleOptions[0];

  const widgets = useMemo(
    () => [
      {
        title: "📅 Faol kunlaringiz",
        description: `${emojis.flame} 4 kun ketma-ket faolsiz!`,
        gradient: "from-[#fff1e6] via-[#fff5ee] to-[#ffe9d7]"
      },
      {
        title: "🏅 Eng yuqori ball",
        description: `${emojis.medal} 92% Listening Sprint`,
        gradient: "from-[#f5f6ff] via-[#f2f3ff] to-[#e9ebff]"
      }
    ],
    []
  );

  const recentActivity = useMemo(
    () => ["Reading Marathon — 87% ✅", "Listening Sprint — 92% 🏅"],
    []
  );

  return (
    <motion.div
      className="flex flex-col gap-6 pb-[80px]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section
        variants={itemVariants}
        className="rounded-[24px] bg-surface p-5 text-left shadow-elev-sm"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-text-primary">
            {`Salom, ${displayName}! ${emojis.wave}`}
          </h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
          <Link
            to="/exams"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-elev-md transition duration-200 ease-in-out hover:bg-brand-dark active:scale-[0.97]"
          >
            {`${emojis.rocket} Boshlaymiz!`}
          </Link>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3">
        {widgets.map((widget, index) => (
          <motion.div key={widget.title} variants={itemVariants} transition={{ delay: index * 0.08 }}>
            <div className={`rounded-[18px] bg-gradient-to-br ${widget.gradient} p-[1px] shadow-elev-sm`}>
              <div className="flex h-full flex-col gap-2 rounded-[17px] bg-white/92 p-4">
                <h3 className="text-sm font-semibold text-text-primary/90">{widget.title}</h3>
                <p className="text-sm text-text-secondary/90">{widget.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="flex items-start gap-3 rounded-[20px] border border-border bg-surface p-5 shadow-elev-sm"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand">
          {emojis.bulb}
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Bugungi ilhom</h3>
          <p className="text-sm text-text-secondary">
            Qadam tashlang, qolganini biz birgalikda o‘rganamiz.
          </p>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">
            {`${emojis.book} So‘nggi faoliyat`}
          </h2>
          <Link
            to="/results"
            className="text-sm font-semibold text-brand transition duration-200 ease-in-out hover:text-brand-dark"
          >
            {`Barchasini ko'rish ${arrowRight}`}
          </Link>
        </div>
        <motion.div
          variants={itemVariants}
          className="rounded-[20px] border border-border bg-surface p-4 shadow-elev-sm"
        >
          {recentActivity.length ? (
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              {recentActivity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">
              {`Hozircha faoliyat yo'q, lekin sizdan umid katta ${emojis.wink}`}
            </p>
          )}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

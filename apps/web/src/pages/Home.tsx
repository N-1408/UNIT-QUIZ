import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuth";

const emoji = {
  wave: String.fromCodePoint(0x1f44b),
  coffee: String.fromCodePoint(0x2615, 0xfe0f),
  rocket: String.fromCodePoint(0x1f680),
  flame: String.fromCodePoint(0x1f525),
  trophy: String.fromCodePoint(0x1f3c6),
  bulb: String.fromCodePoint(0x1f4a1),
  book: String.fromCodePoint(0x1f4da),
  wink: String.fromCodePoint(0x1f609)
};

const arrowRight = String.fromCharCode(0x2192);

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
    `Bugun sinovlarmi yoki choy ichamizmi? ${emoji.coffee}`,
    `Yangi natijalarga tayyormisiz? ${emoji.rocket}`,
    "Imtihonlar sizni sog'indi."
  ];
  const subtitle =
    subtitleOptions[displayName.length % subtitleOptions.length] ??
    subtitleOptions[0];

  const widgets = useMemo(
    () => [
      {
        title: "📅 Faol kunlaringiz",
        description: `${emoji.flame} 4 kun ketma-ket faolsiz!`
      },
      {
        title: "🏆 Umumiy yutuq",
        description: `${emoji.trophy} 8 ta imtihon tugallandi!`
      }
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      "Listening Sprint — 87% ✅",
      "Reading Marathon — 92% 🏅"
    ],
    []
  );

  return (
    <motion.div
      className="flex flex-col gap-6 pb-[100px]"
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
            🚀 Boshlaymiz!
          </Link>
        </div>
      </motion.section>

      <motion.section variants={blockVariants} className="grid grid-cols-2 gap-3">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.title}
            variants={blockVariants}
            transition={{ delay: index * 0.08 }}
            className="rounded-[16px] border border-border bg-surface/95 p-4 shadow-elev-sm"
          >
            <h3 className="text-sm font-semibold text-text-primary">
              {widget.title}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{widget.description}</p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        variants={blockVariants}
        className="rounded-[20px] border border-border bg-brand-light/40 p-4 shadow-elev-sm"
      >
        <h3 className="text-sm font-semibold text-text-primary">
          {`Bugungi ilhom ${emoji.bulb}`}
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Qadam tashlang, qolganini biz birgalikda o‘rganamiz.
        </p>
      </motion.section>

      <motion.section variants={blockVariants} className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">
            {`${emoji.book} So‘nggi faoliyat`}
          </h2>
          <Link
            to="/results"
            className="text-sm font-semibold text-brand transition duration-swift ease-fluid hover:text-brand-dark"
          >
            {`Barchasini ko'rish ${arrowRight}`}
          </Link>
        </div>
        <motion.div
          variants={blockVariants}
          className="rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm"
        >
          {recentActivity.length ? (
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              {recentActivity.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">
              {`Hozircha faoliyat yo'q, lekin sizdan umid katta ${emoji.wink}`}
            </p>
          )}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

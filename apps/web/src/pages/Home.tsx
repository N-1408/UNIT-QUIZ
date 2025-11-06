import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/telegram";
import { useAuthStore } from "@/store/useAuth";
import { cn } from "@/lib/utils";

const emojis = {
  wave: "👋",
  coffee: "☕️",
  rocket: "🚀",
  flame: "🔥",
  medal: "🏅",
  bulb: "💡",
  sparkle: "✨"
};

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: "easeOut" }
  }
};

const wordGameDeck = [
  {
    word: "Serene",
    prompt: "Choose the closest meaning.",
    options: [
      { label: "Tinch, osoyishta", correct: true },
      { label: "Qiziqarli", correct: false },
      { label: "Shoshilinch", correct: false }
    ],
    tip: "Think of a calm lake at sunset."
  },
  {
    word: "Spark",
    prompt: "Pick the matching translation.",
    options: [
      { label: "Charm", correct: false },
      { label: "Yonqin uchquni", correct: true },
      { label: "Uyquchanlik", correct: false }
    ],
    tip: "It starts the fire."
  },
  {
    word: "Glow",
    prompt: "What does it mean?",
    options: [
      { label: "Yal-yorug' porlash", correct: true },
      { label: "Qorong'ilik", correct: false },
      { label: "Shovqin", correct: false }
    ],
    tip: "Soft light, like a candle."
  }
];

export const HomePage = () => {
  const { session } = useAuthStore();
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
        highlight: `${emojis.flame} 4 kun`,
        description: "Ketma-ket faollik bilan motivatsiyani ushlab turing.",
        accent: "bg-gradient-to-r from-[#fff4ec] to-[#ffe0c9]"
      },
      {
        title: "🏅 Eng yuqori ball",
        highlight: `${emojis.medal} 92%`,
        description: "Listening Sprint natijangizga yangi rekord qo‘shing.",
        accent: "bg-gradient-to-r from-[#f2f5ff] to-[#e9f0ff]"
      }
    ],
    []
  );

  const [cardIndex, setCardIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentCard = wordGameDeck[cardIndex % wordGameDeck.length];
  const handleOptionClick = (label: string, correct: boolean) => {
    triggerHaptic(correct ? "light" : "medium");
    setSelection(label);
    setShowFeedback(true);
  };

  const handleNextCard = () => {
    setSelection(null);
    setShowFeedback(false);
    setCardIndex((prev) => prev + 1);
  };

  return (
    <motion.div
      className="mx-auto flex w-full max-w-[380px] flex-col gap-6 pb-[92px]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section
        variants={itemVariants}
        className="rounded-[26px] bg-white p-5 text-left shadow-elev-sm"
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

      <motion.section variants={itemVariants} className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">
          Bugungi ko‘rsatkichlar
        </span>
        <div className="grid grid-cols-2 gap-3">
          {widgets.map((widget, index) => (
            <motion.div
              key={widget.title}
              variants={itemVariants}
              transition={{ delay: index * 0.08 }}
              className={cn(
                "flex h-full flex-col gap-3 rounded-[18px] p-4 shadow-elev-sm",
                "bg-white",
                widget.accent
              )}
            >
              <h3 className="text-sm font-semibold text-text-primary/90">
                {widget.title}
              </h3>
              <span className="text-lg font-semibold text-text-primary">{widget.highlight}</span>
              <p className="text-xs text-text-secondary/90">{widget.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="flex items-start gap-3 rounded-[22px] bg-white p-5 shadow-elev-sm"
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

      <motion.section
        variants={itemVariants}
        className="flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-elev-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {`${emojis.sparkle} Word Spark`}
            </h3>
            <p className="text-xs text-text-secondary">
              Mini o‘yin: yangi so‘zlarni smart usulda eslab qoling.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[18px] bg-gradient-to-br from-[#fff8f0] to-[#f4f8ff] p-4">
          <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
            <span>{currentCard.word}</span>
            <span className="text-xs text-text-secondary">{currentCard.prompt}</span>
          </div>

          <div className="flex flex-col gap-2">
            {currentCard.options.map(({ label, correct }) => {
              const isSelected = selection === label;
              const isCorrect = showFeedback && correct;
              const isWrong = showFeedback && isSelected && !correct;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleOptionClick(label, correct)}
                  className={cn(
                    "flex items-center justify-between rounded-[14px] border px-3 py-2 text-sm transition duration-150 ease-in-out",
                    "hover:border-brand-light hover:bg-brand-light/60",
                    isSelected && !showFeedback && "border-brand bg-brand-light/80 text-brand",
                    isCorrect && "border-green-500 bg-green-50 text-green-700",
                    isWrong && "border-red-400 bg-red-50 text-red-600"
                  )}
                >
                  <span>{label}</span>
                  {isCorrect ? "✅" : isWrong ? "⚠️" : null}
                </button>
              );
            })}
          </div>

          <div className="rounded-[14px] bg-white/70 px-3 py-2 text-xs text-text-secondary">
            {showFeedback ? currentCard.tip : "Tanlang va aniqligini tekshirib ko‘ring."}
          </div>

          <button
            type="button"
            disabled={!showFeedback}
            onClick={handleNextCard}
            className="self-end rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-elev-sm transition duration-150 ease-in-out hover:bg-brand-dark disabled:opacity-50"
          >
            Keyingi so‘z →
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
};

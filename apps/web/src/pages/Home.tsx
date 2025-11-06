import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/Page";
import { triggerHaptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuth";

const emojis = {
  wave: "👋",
  coffee: "☕️",
  rocket: "🚀",
  flame: "🔥",
  medal: "🏅",
  bulb: "💡",
  sparkle: "✨"
} as const;

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
] as const;

export const HomePage = () => {
  const { session } = useAuthStore();
  const rawName =
    (session as { full_name?: string } | null)?.full_name ?? session?.fullName ?? "do'stimiz";
  const displayName = rawName.trim() || "do'stimiz";

  const subtitleOptions = [
    `Bugun sinovlarmi yoki choy ichamizmi? ${emojis.coffee}`,
    `Yangi natijalarga tayyormisiz? ${emojis.rocket}`,
    "Imtihonlar sizni sog'indi."
  ];

  const subtitle = subtitleOptions[displayName.length % subtitleOptions.length] ?? subtitleOptions[0];

  const widgets = useMemo(
    () => [
      {
        title: "Faol kunlaringiz",
        highlight: `${emojis.flame} 4 kun`,
        description: "Ketma-ket harakat motivatsiyani yuqorida ushlab turadi.",
        accent: "from-[#FFF5ED] via-[#FFEBDD] to-[#FFE2D5]"
      },
      {
        title: "Eng yuqori ball",
        highlight: `${emojis.medal} 92%`,
        description: "Listening Sprint natijangiz rekordni yangilashga tayyor.",
        accent: "from-[#F3F6FF] via-[#E8EFFF] to-[#DDE7FF]"
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
    <PageContainer className="pb-[calc(env(safe-area-inset-bottom)+120px)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.section
          variants={itemVariants}
          className="rounded-[20px] bg-white/95 p-6 text-left shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">
              {`Salom, ${displayName}! ${emojis.wave}`}
            </h1>
            <p className="text-sm text-text-secondary">{subtitle}</p>
            <Link
              to="/exams"
              onClick={() => triggerHaptic("light")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(82,114,255,0.28)] transition duration-200 ease-out hover:bg-brand-dark active:scale-[0.97]"
            >
              <span className="text-[1.1em]">{emojis.rocket}</span>
              Boshlaymiz!
            </Link>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          {widgets.map((widget, index) => (
            <motion.div
              key={widget.title}
              variants={itemVariants}
              transition={{ delay: index * 0.06 }}
              className={cn(
                "rounded-[20px] border border-white/60 bg-gradient-to-br p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]",
                widget.accent
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-text-primary/90">{widget.title}</h3>
                <span className="text-lg font-semibold text-text-primary">{widget.highlight}</span>
                <p className="text-xs text-text-secondary/90">{widget.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="flex items-start gap-3 rounded-[20px] bg-white/95 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-lg text-brand shadow-[0_4px_12px_rgba(82,114,255,0.18)]">
            {emojis.bulb}
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-semibold text-text-primary">Bugungi ilhom</h3>
            <p className="text-sm text-text-secondary">
              Qadam tashlang, qolganini biz birgalikda o‘rganamiz.
            </p>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="flex flex-col gap-4 rounded-[20px] bg-white/95 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                <span className="mr-1 text-[1.1em]">{emojis.sparkle}</span>
                Word Spark
              </h3>
              <p className="text-xs text-text-secondary">
                Mini o‘yin: yangi so‘zlarni sokin ritmda yodda saqlang.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[16px] bg-gradient-to-br from-[#FFF8F0] via-[#F6F8FF] to-[#EEF3FF] p-4">
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
                      "flex items-center justify-between rounded-[14px] border border-transparent bg-white/90 px-4 py-2 text-sm transition duration-150 ease-in-out",
                      "hover:bg-white hover:shadow-[0_4px_12px_rgba(82,114,255,0.12)]",
                      isSelected && !showFeedback && "border-brand bg-brand-light/70 text-brand",
                      isCorrect &&
                        "border-green-500 bg-green-50 text-green-700 shadow-[0_8px_18px_rgba(34,197,94,0.18)]",
                      isWrong &&
                        "border-red-400 bg-red-50 text-red-600 shadow-[0_8px_18px_rgba(248,113,113,0.16)]"
                    )}
                  >
                    <span>{label}</span>
                    {isCorrect ? "✅" : isWrong ? "❌" : null}
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
              className="self-end rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(82,114,255,0.28)] transition duration-150 ease-in-out hover:bg-brand-dark disabled:opacity-40"
            >
              Keyingi so‘z ➜
            </button>
          </div>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};


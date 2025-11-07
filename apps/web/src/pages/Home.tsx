import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PageContainer } from "@/components/layout/Page";
import { triggerHaptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuth";

const emojis = {
  wave: "\u{1F44B}",
  coffee: "\u{2615}\u{FE0F}",
  rocket: "\u{1F680}",
  flame: "\u{1F525}",
  medal: "\u{1F3C5}",
  bulb: "\u{1F4A1}",
  sparkle: "\u{2728}"
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

const widgetPalette = [
  {
    title: "Faol kunlaringiz",
    highlight: `${emojis.flame} 4 kun`,
    description: "Ketma-ket harakat motivatsiyani yuqorida ushlab turadi.",
    accent: "from-ui-accent2 via-[#FFE5CC] to-ui-accent2"
  },
  {
    title: "Eng yuqori ball",
    highlight: `${emojis.medal} 92%`,
    description: "Listening Sprint natijangiz rekordni yangilashga tayyor.",
    accent: "from-ui-accent1 via-[#E7F0FF] to-ui-accent1"
  }
] as const;

export const HomePage = () => {
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  console.log("Auth status:", status);
  const displayName = session?.fullName?.trim() || "do'stimiz";

  const subtitleOptions = useMemo(
    () => [
      `Bugun sinovlarmi yoki choy ichamizmi? ${emojis.coffee}`,
      `Yangi natijalarga tayyormisiz? ${emojis.rocket}`,
      "Imtihonlar sizni sog'indi."
    ],
    []
  );

  const subtitle = subtitleOptions[displayName.length % subtitleOptions.length] ?? subtitleOptions[0];

  const [cardIndex, setCardIndex] = useState(0);
  const [selection, setSelection] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentCard = wordGameDeck[cardIndex % wordGameDeck.length];
  const selectedOption = selection
    ? currentCard.options.find((option) => option.label === selection)
    : undefined;
  const isCorrectSelection = Boolean(showFeedback && selectedOption?.correct);
  const isWrongSelection = Boolean(showFeedback && selection && !selectedOption?.correct);

  const feedbackCopy = isCorrectSelection
    ? "Zo'r! Shunday ritm bilan tez orada yangi rekordlar sizniki bo'ladi."
    : isWrongSelection
      ? "Bu safar biroz chalkashdi. Yangi so'z yana imkoniyat beradi."
      : "Tanlang va aniqligini tekshirib ko'ring.";

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
          className="rounded-[20px] bg-ui-surface/95 p-6 text-left shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">
              {`Salom, ${displayName}! ${emojis.wave}`}
            </h1>
            <p className="text-sm text-text-secondary">{subtitle}</p>
            <Link
              to="/exams"
              onClick={() => triggerHaptic("light")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(255,107,0,0.25)] transition duration-200 ease-out hover:brightness-105 active:scale-[0.97]"
            >
              <span className="text-[1.1em]">{emojis.rocket}</span>
              Boshlaymiz!
            </Link>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          {widgetPalette.map((widget, index) => (
            <motion.div
              key={widget.title}
              variants={itemVariants}
              transition={{ delay: index * 0.06 }}
              className={cn(
                "rounded-[20px] border border-ui-border/70 bg-gradient-to-br p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]",
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
          className="flex items-start gap-3 rounded-[20px] bg-ui-surface/95 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-lg text-brand-primary shadow-[0_4px_12px_rgba(255,107,0,0.22)]">
            {emojis.bulb}
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-semibold text-text-primary">Bugungi ilhom</h3>
            <p className="text-sm text-text-secondary">
              Qadam tashlang, qolganini biz birgalikda o'rganamiz.
            </p>
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="flex flex-col gap-4 rounded-[20px] bg-ui-surface/95 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                <span className="mr-1 text-[1.1em]">{emojis.sparkle}</span>
                Word Spark
              </h3>
              <p className="text-xs text-text-secondary">
                Mini o'yin: yangi so'zlarni sokin ritmda yodda saqlang.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.word}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-3 rounded-[16px] bg-gradient-to-br from-ui-accent2/60 via-[#F6F8FF] to-ui-accent1/70 p-4"
            >
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
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => handleOptionClick(label, correct)}
                      className={cn(
                        "flex items-center justify-between rounded-[14px] border border-transparent bg-ui-surface px-4 py-2 text-sm transition duration-150 ease-in-out",
                        isSelected && !showFeedback && "border-brand-primary/60 bg-brand-light/70 text-brand-primary",
                        isCorrect &&
                          "border-ui-success/70 bg-ui-success/10 text-ui-success shadow-[0_8px_18px_rgba(52,199,89,0.18)]",
                        isWrong &&
                          "border-ui-danger/60 bg-ui-danger/10 text-ui-danger shadow-[0_8px_18px_rgba(255,59,48,0.16)]"
                      )}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    >
                      <span>{label}</span>
                      <AnimatePresence mode="wait">
                        {isCorrect ? (
                          <motion.span
                            key="correct"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 24 }}
                            className="ml-2"
                          >
                            ✅
                          </motion.span>
                        ) : null}
                        {isWrong ? (
                          <motion.span
                            key="wrong"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 24 }}
                            className="ml-2"
                          >
                            ❌
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              <div className="rounded-[14px] bg-ui-surface/70 px-3 py-2 text-xs text-text-secondary">
                {showFeedback ? currentCard.tip : "Tanlang va aniqligini tekshirib ko'ring."}
              </div>

              <motion.span
                key={feedbackCopy}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "text-xs font-medium",
                  isCorrectSelection ? "text-ui-success" : isWrongSelection ? "text-ui-danger" : "text-text-secondary"
                )}
              >
                {feedbackCopy}
              </motion.span>

              <button
                type="button"
                disabled={!showFeedback}
                onClick={handleNextCard}
                className={cn(
                  "self-end rounded-full bg-gradient-to-r from-brand-gradient1 to-brand-gradient2 px-4 py-2 text-xs font-semibold text-brand-ink shadow-[0_4px_12px_rgba(255,138,0,0.28)] transition duration-150 ease-in-out",
                  "enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-40"
                )}
              >
                Keyingi so'z \u279C
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};

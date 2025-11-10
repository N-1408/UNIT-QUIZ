import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { PageContainer } from "@/components/layout/Page";

const stats = [
  { label: "Foydalanuvchilar", value: "1,248", trend: "+12%", accent: "from-ui-accent1 via-white to-ui-accent1" },
  { label: "Imtihonlar", value: "58", trend: "+3 yangi", accent: "from-ui-accent2 via-white to-ui-accent2" },
  { label: "O'rtacha ball", value: "74%", trend: "+2.1%", accent: "from-[#FDF2F8] via-white to-[#FDE7F3]" }
];

const recentAttempts = [
  { id: 1, student: "Dilnoza S.", exam: "IELTS Sprint", score: 92, takenAt: "Bugun 10:24" },
  { id: 2, student: "Azizbek K.", exam: "Grammar Clinic", score: 81, takenAt: "Bugun 09:10" },
  { id: 3, student: "Madina T.", exam: "Reading Marathon", score: 76, takenAt: "Kecha 21:34" }
];

const quickActions = [
  { label: "Create Exam", description: "Yangi imtihon builderini ishga tushirish", href: "#" },
  { label: "Manage Users", description: "Guruh va rollarni yangilash", href: "#" },
  { label: "View Logs", description: "Audit log va tizim monitoringi", href: "#" }
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }
  })
};

export const AdminPage = () => (
  <PageContainer className="gap-6">
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-[24px] border border-border bg-surface/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <h1 className="text-2xl font-semibold text-text-primary">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Nova LC ekotizimining nazorat markazi. Imtihonlar, foydalanuvchilar va natijalar bo'yicha tezkor ko'rinish.
      </p>
    </motion.section>

    <section className="grid gap-4 sm:grid-cols-3">
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className={`rounded-[24px] border border-white/60 bg-gradient-to-br ${item.accent} p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)]`}
        >
          <p className="text-xs font-semibold tracking-wide text-text-secondary">{item.label}</p>
          <h3 className="mt-3 text-2xl font-semibold text-text-primary">{item.value}</h3>
          <span className="text-xs font-medium text-brand">{item.trend}</span>
        </motion.div>
      ))}
    </section>

    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-[24px] border border-border bg-surface/95 p-5 shadow-elev-md"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Recent Results</h2>
          <p className="text-sm text-text-secondary">Bugungi eng so'nggi uchta urinish</p>
        </div>
        <button className="text-sm font-semibold text-brand hover:opacity-80">Barchasini ko'rish</button>
      </header>
      <div className="mt-4 divide-y divide-border">
        {recentAttempts.map((attempt, index) => (
          <motion.div
            key={attempt.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="flex items-center gap-4 py-3 text-sm"
          >
            <div className="flex-1">
              <p className="font-semibold text-text-primary">{attempt.student}</p>
              <p className="text-xs text-text-secondary">{attempt.exam}</p>
            </div>
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">{attempt.score}%</span>
            <span className="text-xs text-text-secondary">{attempt.takenAt}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>

    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-[24px] border border-border bg-surface/95 p-5 shadow-elev-md"
    >
      <h2 className="text-base font-semibold text-text-primary">Quick Actions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {quickActions.map((action, index) => (
          <motion.a
            key={action.label}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            href={action.href}
            className="rounded-[20px] border border-border bg-gradient-to-br from-ui-surface via-white to-ui-surface p-4 text-left shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
          >
            <p className="text-sm font-semibold text-text-primary">{action.label}</p>
            <p className="mt-2 text-xs text-text-secondary">{action.description}</p>
          </motion.a>
        ))}
      </div>
    </motion.section>
  </PageContainer>
);

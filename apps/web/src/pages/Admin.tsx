import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/Page";

export const AdminPage = () => (
  <PageContainer>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-[24px] border border-border bg-surface/95 p-6 shadow-elev-sm"
    >
      <h1 className="text-2xl font-semibold text-text-primary">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-text-secondary">
        RBAC ishlamoqda. Bu sahifa faqat admin roliga ega foydalanuvchilar uchun ochiq.
      </p>
    </motion.div>
  </PageContainer>
);


import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, type Role } from "@/store/useAuth";
import { hasRole } from "@/lib/roles";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: Role[];
}>;

const LoadingState = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center text-sm text-text-secondary">
    Yuklanmoqda...
  </div>
);

const AccessDenied = () => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto mt-12 flex max-w-[420px] flex-col items-center gap-4 rounded-[24px] border border-border bg-surface/95 p-6 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <h2 className="text-lg font-semibold text-text-primary">Kirish imkoni cheklangan</h2>
      <p className="text-sm text-text-secondary">
        Ushbu bo'lim faqat administratorlar uchun mo'ljallangan. Agar sizga ruxsat kerak bo'lsa, mentorlar bilan bog'laning.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-ink shadow-elev-sm transition duration-150 ease-out hover:bg-brand-dark"
      >
        Bosh sahifaga qaytish
      </Link>
    </motion.div>
  </AnimatePresence>
);

export const ProtectedRoute = ({ allowedRoles = ["student", "teacher", "admin"], children }: ProtectedRouteProps) => {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);

  if (status === "idle" || status === "loading") {
    return <LoadingState />;
  }

  if (!session) {
    return <LoadingState />;
  }

  if (!hasRole(session.role, allowedRoles)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};


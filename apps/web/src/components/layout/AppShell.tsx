import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Page } from "@/components/layout/Page";
import { BottomNav } from "@/components/layout/BottomNav";

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/": {
    title: "Bosh sahifa",
    subtitle: "Bugungi kayfiyatingiz qanday?"
  },
  "/exams": {
    title: "Imtihonlar",
    subtitle: "Tayyor chiqqan odam doim g'alaba qilar"
  },
  "/results": {
    title: "Natijalar",
    subtitle: "Bu yerda hammasi ochiq va shaffof"
  },
  "/settings": {
    title: "Sozlamalar",
    subtitle: "O'zingizga yoqqancha moslab oling"
  }
};

export const AppShell = () => {
  const location = useLocation();
  const info =
    TITLES[location.pathname] ??
    ({
      title: "UNIT QUIZ",
      subtitle: "Nova LC imtihon ekotizimi"
    } as const);

  const showHeader = location.pathname !== "/";

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-surface-soft via-background to-background text-text-primary transition-colors duration-soft ease-fluid dark:text-text-primary">
      {showHeader ? (
        <Header title={info.title} subtitle={info.subtitle} showBack />
      ) : (
        <div className="h-[env(safe-area-inset-top)]" />
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="flex flex-1"
        >
          <Page>
            <Outlet />
          </Page>
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

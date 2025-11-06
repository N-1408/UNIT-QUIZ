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

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-text-primary transition-colors duration-soft ease-fluid dark:text-text-primary">
      <div className="pointer-events-none absolute inset-x-0 top-[-140px] h-[360px] rounded-b-[48px] bg-mesh-soft opacity-95 blur-0 md:top-[-160px]" />
      <div className="pointer-events-none absolute inset-x-8 top-[-120px] h-[320px] rounded-[48px] bg-mesh-brand blur-[120px] opacity-[0.45] sm:opacity-60" />

      <Header title={info.title} subtitle={info.subtitle} showBack={location.pathname !== "/"} />

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

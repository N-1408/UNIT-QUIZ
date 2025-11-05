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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-transparent text-slate-900 dark:text-slate-100">
      <Header title={info.title} subtitle={info.subtitle} showBack={location.pathname !== "/"} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
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

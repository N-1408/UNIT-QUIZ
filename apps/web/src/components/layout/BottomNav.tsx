import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ClipboardList, Trophy, Settings as SettingsIcon } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Bosh sahifa", icon: Home },
  { to: "/exams", label: "Imtihonlar", icon: ClipboardList },
  { to: "/results", label: "Natijalar", icon: Trophy },
  { to: "/settings", label: "Sozlamalar", icon: SettingsIcon }
] as const;

const pillVariants = {
  inactive: { scale: 1, opacity: 0.9 },
  active: { scale: 1.1, opacity: 1 }
};

export const BottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
    <div className="mx-auto w-full max-w-[360px] px-5 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
      <div className="flex h-14 w-full items-center justify-between rounded-full border border-border/80 bg-white/95 px-3 shadow-elev-md backdrop-blur-xl">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => triggerHaptic("light")}
            className="relative flex h-10 flex-1 items-center justify-center"
          >
            {({ isActive }: { isActive: boolean }) => (
              <motion.div
                className={cn("relative flex h-10 items-center justify-center gap-2 rounded-full px-3 text-xs font-medium",
                  isActive ? "text-brand" : "text-text-secondary"
                )}
                variants={pillVariants}
                animate={isActive ? "active" : "inactive"}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition duration-200 ease-in-out",
                    isActive ? "text-brand" : "text-text-secondary"
                  )}
                />
                {isActive ? <span>{label}</span> : null}
                {isActive ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-brand-light"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                ) : null}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);


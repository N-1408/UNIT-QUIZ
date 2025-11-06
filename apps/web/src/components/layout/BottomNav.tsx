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

const ACTIVE_HALO_LAYOUT_ID = "bottom-nav-active-halo";

export const BottomNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
    <div className="mx-auto w-full max-w-[480px] px-[clamp(16px,4vw,28px)] pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2">
      <div className="flex h-[68px] w-full items-center justify-between rounded-[24px] border border-ui-border/60 bg-ui-surface/80 px-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md transition-colors duration-150 ease-in-out dark:border-ui-border/30 dark:bg-ui-surface/70">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => triggerHaptic("light")}
            className="flex flex-1 justify-center"
          >
            {({ isActive }: { isActive: boolean }) => (
              <motion.button
                type="button"
                className="relative flex h-12 w-[70px] flex-col items-center justify-center"
                animate={{ scale: isActive ? 1 : 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                whileTap={{ scale: 0.88 }}
              >
                {isActive ? (
                  <motion.span
                    layoutId={ACTIVE_HALO_LAYOUT_ID}
                    className="absolute inset-y-1 w-full rounded-full bg-brand-light/80 shadow-[0_10px_26px_rgba(255,107,0,0.2)]"
                    transition={{ type: "spring", stiffness: 520, damping: 32 }}
                  />
                ) : null}
                <Icon
                  className={cn(
                    "h-[1.35rem] w-[1.35rem] transition-colors duration-200 ease-out",
                    isActive ? "text-brand" : "text-text-secondary dark:text-white/70"
                  )}
                />
                <motion.span
                  className="pointer-events-none mt-1 text-[11px] font-semibold tracking-wide text-brand dark:text-white"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 6
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {label}
                </motion.span>
              </motion.button>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);

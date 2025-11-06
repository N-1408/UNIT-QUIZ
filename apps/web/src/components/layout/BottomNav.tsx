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
    <div className="mx-auto w-full max-w-[480px] px-[clamp(16px,4vw,28px)] pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <div className="flex h-[68px] w-full items-center justify-between rounded-[24px] border border-white/40 bg-white/90 px-3 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl">
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
                transition={{ duration: 0.18, ease: "easeInOut" }}
                whileTap={{ scale: 0.88 }}
              >
                {isActive ? (
                  <motion.span
                    layoutId={ACTIVE_HALO_LAYOUT_ID}
                    className="absolute inset-y-1 w-full rounded-full bg-brand-light/70 shadow-[0_4px_12px_rgba(82,114,255,0.28)]"
                    transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  />
                ) : null}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-150 ease-in-out",
                    isActive ? "text-brand" : "text-text-secondary"
                  )}
                />
                <motion.span
                  className="pointer-events-none mt-1 text-[11px] font-semibold tracking-wide text-brand"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 6
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
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

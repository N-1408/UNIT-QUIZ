import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, ClipboardList, Trophy, Settings as SettingsIcon } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Bosh sahifa", icon: Home },
  { to: "/exams", label: "Imtihonlar", icon: ClipboardList },
  { to: "/results", label: "Natijalar", icon: Trophy },
  { to: "/settings", label: "Sozlamalar", icon: SettingsIcon }
] as const;

export const BottomNav = () => (
  <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
    <div className="pointer-events-auto mx-auto w-full max-w-sm px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
      <div className="flex h-14 w-full items-center justify-between rounded-full border border-border bg-surface shadow-elev-md px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => triggerHaptic("light")}
            className="relative flex h-10 flex-1 items-center justify-center"
          >
            {({ isActive }: { isActive: boolean }) => (
              <motion.div
                layout
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-full px-3 text-xs font-medium transition duration-swift ease-fluid",
                  isActive ? "bg-brand-light text-brand shadow-elev-sm" : "text-text-secondary"
                )}
                animate={{ scale: isActive ? 1 : 0.96 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition duration-swift ease-fluid",
                    isActive ? "text-brand" : "text-text-secondary"
                  )}
                />
                <AnimatePresence initial={false}>
                  {isActive ? (
                    <motion.span
                      key={label}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                    >
                      {label}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);

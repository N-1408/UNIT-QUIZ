import { NavLink } from "react-router-dom";
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
  <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
    <div className="pointer-events-auto mx-auto mb-4 w-full max-w-md px-4">
      <div className="rounded-[28px] border border-white/10 bg-surface/70 px-3 py-2 shadow-glass backdrop-blur-xl dark:border-white/5">
        <ul className="flex items-center justify-between">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                onClick={() => triggerHaptic("light")}
                className={({ isActive }: { isActive: boolean }) =>
                  cn(
                    "flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-medium transition duration-soft ease-fluid",
                    isActive ? "text-brand" : "text-muted hover:text-slate-100"
                  )
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-2xl border border-white/5 bg-white/10 shadow-sm backdrop-blur",
                        isActive && "border-brand/40 bg-brand/15 text-brand drop-shadow-glow"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  </nav>
);

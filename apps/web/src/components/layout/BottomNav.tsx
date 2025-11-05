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
  <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stroke/70 bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur md:hidden">
    <ul className="flex items-center justify-between">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <li key={to} className="flex-1">
          <NavLink
            to={to}
            onClick={() => triggerHaptic("light")}
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-medium transition",
                isActive ? "text-brand" : "text-muted hover:text-slate-100"
              )
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border border-transparent",
                    isActive ? "bg-brand/20 text-brand" : "bg-surface-2 text-slate-300"
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
  </nav>
);

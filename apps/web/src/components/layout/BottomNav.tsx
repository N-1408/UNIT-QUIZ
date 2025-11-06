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
      <div className="rounded-[28px] border border-stroke/60 bg-surface px-4 py-3 shadow-elev-lg">
        <ul className="flex items-center justify-between gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                onClick={() => triggerHaptic("light")}
                className={({ isActive }: { isActive: boolean }) =>
                  cn(
                    "flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-medium text-text-secondary transition duration-swift ease-fluid",
                    isActive && "text-brand"
                  )
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-2xl border border-stroke/40 bg-surface-alt text-text-secondary shadow-elev-sm",
                        isActive && "border-brand/20 bg-brand-light text-brand shadow-elev-md"
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

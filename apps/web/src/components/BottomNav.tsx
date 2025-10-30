import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { CheckSquare, Trophy, Settings as SettingsIcon } from "lucide-react";

type TabItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const tabs: TabItem[] = [
  { to: "/", label: "Tests", icon: CheckSquare, end: true },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/settings", label: "Settings", icon: SettingsIcon }
];

export default function BottomNav() {
  const base = "flex h-full flex-col items-center justify-center gap-1 text-[13px]";

  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-20">
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-evenly px-6">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={!!t.end} className="flex-1">
            {({ isActive }) => (
              <div className={`${base} ${isActive ? "active" : ""}`}>
                <t.icon size={20} />
                <span className="text-xs font-medium uppercase tracking-wide">{t.label}</span>
                <span
                  aria-hidden
                  className={`indicator mt-2 w-12 transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

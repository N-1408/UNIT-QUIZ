import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { CheckSquare, Trophy, Settings as SettingsIcon } from "lucide-react";
import { haptic } from "../lib/tg";
import { useI18n } from "../i18n";

type TabItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  end?: boolean;
};

const tabs: TabItem[] = [
  { to: "/", labelKey: "tests", icon: CheckSquare, end: true },
  { to: "/rating", labelKey: "ranking", icon: Trophy },
  { to: "/settings", labelKey: "settings", icon: SettingsIcon }
];

export default function BottomNav() {
  const base = "flex h-full flex-col items-center justify-center gap-1 text-[13px]";
  const { t } = useI18n();

  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-20">
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-evenly px-6">
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={!!tab.end} className="flex-1" onClick={() => haptic.tap()}>
            {({ isActive }) => (
              <div className={`${base} tap ${isActive ? "active" : ""}`}>
                <tab.icon size={20} />
                <span className="text-xs font-medium uppercase tracking-wide">{t(tab.labelKey)}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

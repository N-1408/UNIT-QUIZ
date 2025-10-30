import { NavLink } from "react-router-dom";
import { SquareCheck, Medal, Settings } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Tests", icon: SquareCheck, end: true },
  { to: "/rating", label: "Ranking", icon: Medal },
  { to: "/settings", label: "Settings", icon: Settings }
] as const;

export default function BottomNav() {
  const base = "flex h-full flex-col items-center justify-center gap-1 text-[13px]";

  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-20">
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-evenly px-6">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="flex-1">
            {({ isActive }) => (
              <div className={`${base} ${isActive ? "active" : ""}`}>
                <Icon size={20} />
                <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
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

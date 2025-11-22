import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, BarChart2, User, Shield, Trophy } from "lucide-react";
import { useRoleStore } from "@/store/roleStore";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useRoleStore((state) => state.role);

  const navItems = useMemo(() => {
    const items = [
      { label: "Home", icon: Home, path: "/" },
      { label: "Tests", icon: FileText, path: "/exams" },
      { label: "Rating", icon: Trophy, path: "/leaderboard" },
      { label: "Results", icon: BarChart2, path: "/results" },
    ];

    if (role === "admin") {
      items.push({ label: "Admin", icon: Shield, path: "/admin" });
    } else {
      items.push({ label: "Profile", icon: User, path: "/settings" });
    }

    return items;
  }, [role]);

  // Hide on exam taking pages
  if (location.pathname.startsWith("/exam/")) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="glass-dock pointer-events-auto flex items-center gap-2 rounded-[24px] p-2 transition-all duration-300 hover:scale-105 hover:shadow-glow/20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "group relative flex h-12 w-12 flex-col items-center justify-center rounded-[18px] transition-all duration-300",
                isActive
                  ? "bg-brand text-white shadow-lg shadow-brand/30 scale-110"
                  : "text-slate-400 hover:bg-white/10 hover:text-text-primary dark:hover:bg-white/5"
              )}
            >
              {isActive && (
                <span className="absolute -top-1 right-1 h-2 w-2 rounded-full bg-white shadow-sm animate-pulse" />
              )}
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform duration-300",
                  isActive ? "scale-100" : "group-hover:scale-110",
                  !isActive && "stroke-[1.5px]"
                )}
              />
              {/* Tooltip on Hover */}
              <span className="absolute -top-10 scale-0 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 dark:bg-white dark:text-slate-900">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

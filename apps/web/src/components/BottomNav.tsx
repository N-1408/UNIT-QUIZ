import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Trophy, User, Shield } from "lucide-react";
import { useRoleStore } from "@/store/roleStore";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useRoleStore((state) => state.role);

  const navItems = useMemo(() => {
    const items = [
      { label: "Home", icon: Home, path: "/" },
      { label: "Tests", icon: BookOpen, path: "/exams" },
      { label: "Rating", icon: Trophy, path: "/leaderboard" },
      { label: "Profile", icon: User, path: "/settings" },
    ];

    if (role === "admin") {
      items[3] = { label: "Admin", icon: Shield, path: "/admin" };
    }

    return items;
  }, [role]);

  // Hide on exam taking pages
  if (location.pathname.startsWith("/exam/")) {
    return null;
  }

  const handleNavigation = (path: string) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1e]/80 backdrop-blur-xl border-t border-white/5 pb-safe pt-2">
      <div className="flex items-center justify-around px-2 pb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-16 py-1 transition-all duration-200 active:scale-95",
                isActive ? "text-orange-500" : "text-gray-500 hover:text-gray-400"
              )}
            >
              <div className={cn(
                "relative p-1 rounded-xl transition-all duration-300",
                isActive && "bg-orange-500/10"
              )}>
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive && "fill-current"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-[10px] font-medium mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

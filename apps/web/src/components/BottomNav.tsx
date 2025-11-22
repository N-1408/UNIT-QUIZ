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
      // Central item will be handled separately
      { label: "Results", icon: BarChart2, path: "/results" },
      { label: "Profile", icon: User, path: "/settings" },
    ];

    if (role === "admin") {
      // Replace Profile with Admin for admins, or add it
      items[3] = { label: "Admin", icon: Shield, path: "/admin" };
    }

    return items;
  }, [role]);

  // Hide on exam taking pages
  if (location.pathname.startsWith("/exam/")) {
    return null;
  }

  const handleNavigation = (path: string) => {
    // Haptic Feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto relative bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 shadow-2xl shadow-black/50 flex items-center gap-1">

        {/* Left Items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 mb-1 transition-transform duration-300",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 absolute bottom-1"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </button>
          );
        })}

        {/* Central Action Button (Leaderboard/Rating) */}
        <div className="relative -top-6 mx-2">
          <button
            onClick={() => handleNavigation("/leaderboard")}
            className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 border-4 border-[#1c1c1e] transform transition-transform active:scale-95"
          >
            <Trophy className="w-7 h-7 text-white fill-white/20" />
          </button>
        </div>

        {/* Right Items */}
        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300",
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 mb-1 transition-transform duration-300",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 absolute bottom-1"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
};


import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Library, Medal, UserCircle, Shield } from "lucide-react";
import { useRoleStore } from "@/store/roleStore";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useRoleStore((state) => state.role);

  const navItems = useMemo(() => {
    const items = [
      { label: "Home", icon: LayoutDashboard, path: "/" },
      { label: "Tests", icon: Library, path: "/exams" },
      { label: "Rating", icon: Medal, path: "/leaderboard" },
      { label: "Profile", icon: UserCircle, path: "/settings" },
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

  const handleNav = (path: string) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">
        <div className="relative bg-slate-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-[32px] pb-6 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">

          <div className="relative flex items-center justify-around px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className="relative group flex flex-col items-center justify-center w-16 h-16"
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <div className="absolute -top-2 w-8 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-in fade-in zoom-in duration-300" />
                  )}

                  <div
                    className={cn(
                      "p-2.5 rounded-2xl transition-all duration-300 ease-out",
                      isActive
                        ? "text-white bg-white/10 shadow-inner"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-105"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                      fill={isActive ? "currentColor" : "none"}
                    />
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-medium mt-1 transition-all duration-300",
                      isActive
                        ? "text-white translate-y-0 opacity-100"
                        : "text-slate-500 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-70"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

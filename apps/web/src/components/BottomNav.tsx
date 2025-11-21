import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, BarChart2, User, Shield } from "lucide-react";
import { useRoleStore } from "@/store/roleStore";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useRoleStore((state) => state.role);

  // Hide on exam taking pages
  if (location.pathname.startsWith("/exam/")) {
    return null;
  }

  const navItems = useMemo(() => {
    const items = [
      { label: "Bosh sahifa", icon: Home, path: "/" },
      { label: "Imtihonlar", icon: FileText, path: "/exams" },
      { label: "Natijalar", icon: BarChart2, path: "/results" },
    ];

    if (role === "admin") {
      items.push({ label: "Admin", icon: Shield, path: "/admin" });
    } else {
      items.push({ label: "Profil", icon: User, path: "/settings" });
    }

    return items;
  }, [role]);

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="mx-auto max-w-md rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-2 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

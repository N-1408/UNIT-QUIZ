import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Home, Assignment, BarChart, Person } from "@mui/icons-material";
import { useRoleStore } from "@/store/roleStore";

const BOTTOM_NAV_LABELS = {
  student: ["Bosh sahifa", "Imtihonlar", "Natijalar", "Profil"],
  teacher: ["Bosh sahifa", "Imtihonlar", "Natijalar", "Profil"],
  admin: ["Bosh sahifa", "Imtihonlar", "Natijalar", "Admin"]
};

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useRoleStore((state) => state.role);
  const labels = BOTTOM_NAV_LABELS[role] ?? BOTTOM_NAV_LABELS.student;

  const routes = useMemo(
    () => (role === "admin" ? ["/", "/exams", "/results", "/admin"] : ["/", "/exams", "/results", "/settings"]),
    [role]
  );

  const value = useMemo(() => {
    const current = location.pathname;
    const index = routes.findIndex((route) => current.startsWith(route));
    return index >= 0 ? index : 0;
  }, [location.pathname, routes]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(routes[newValue] ?? "/");
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 56,
        bgcolor: "#FFFFFF",
        borderTop: "1px solid #E5E7EB",
        "& .MuiBottomNavigationAction-root": {
          color: "#6B7280",
          "&.Mui-selected": {
            color: "#FF5F00",
            bgcolor: "rgba(255, 95, 0, 0.08)"
          }
        }
      }}
      showLabels
    >
      <BottomNavigationAction label={labels[0]} icon={<Home />} />
      <BottomNavigationAction label={labels[1]} icon={<Assignment />} />
      <BottomNavigationAction label={labels[2]} icon={<BarChart />} />
      <BottomNavigationAction label={labels[3]} icon={<Person />} />
    </BottomNavigation>
  );
};

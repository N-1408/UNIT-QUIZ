import { create } from "zustand";

export type Role = "student" | "teacher" | "admin";

type RoleStore = {
  role: Role;
  setRole: (role: Role) => void;
};

const getInitialRole = (): Role => {
  if (typeof window === "undefined") return "student";
  const stored = localStorage.getItem("role");
  if (stored === "teacher" || stored === "admin") {
    return stored;
  }
  return "student";
};

export const useRoleStore = create<RoleStore>((set) => ({
  role: getInitialRole(),
  setRole: (role) => {
    localStorage.setItem("role", role);
    set({ role });
  }
}));

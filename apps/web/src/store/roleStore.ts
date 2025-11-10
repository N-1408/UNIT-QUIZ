import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Role = "student" | "teacher" | "admin";

type RoleStore = {
  role: Role;
  setRole: (role: Role) => void;
};

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: "student",
      setRole: (role) => set({ role })
    }),
    {
      name: "role-storage",
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          if (typeof window === "undefined") return null;
          return localStorage.getItem(name);
        },
        setItem: (name: string, value: string) => {
          if (typeof window === "undefined") return;
          localStorage.setItem(name, value);
        },
        removeItem: (name: string) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
        }
      }))
    }
  )
);

import type { Role } from "@/store/useAuth";

export const isAdmin = (role?: Role | null) => role === "admin";
export const isStudent = (role?: Role | null) => role === "student";
export const hasRole = (role: Role | null | undefined, allowed: Role[]) =>
  !!role && allowed.includes(role);


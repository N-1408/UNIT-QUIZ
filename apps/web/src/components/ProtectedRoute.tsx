import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type MeResponse = {
  tg_id?: string | null;
  full_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
};

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: me, isLoading } = useQuery<MeResponse | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("https://unit-quiz.onrender.com/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    },
    retry: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!me) return <Navigate to="/login" />;
  return <>{children}</>;
}

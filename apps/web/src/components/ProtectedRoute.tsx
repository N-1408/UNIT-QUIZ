import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type AuthUser = {
  tg_id: string;
  full_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
};

export default function ProtectedRoute() {
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<AuthUser> => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('not_authenticated');
      }
      return response.json();
    },
    retry: false,
    staleTime: 60_000
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet context={{ user: data }} />;
}

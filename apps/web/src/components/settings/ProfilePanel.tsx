import { useAuthStore } from "@/store/useAuth";

export const ProfilePanel = () => {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/10 p-5 text-sm text-muted shadow-md backdrop-blur-xl">
        Telegram hisobingiz aniqlanmoqda. Bir ozdan so'ng qayta oching.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-lg shadow-black/20 backdrop-blur-xl dark:border-white/5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Profil</p>
          <h3 className="text-lg font-semibold text-slate-100">{session.fullName}</h3>
          <p className="text-xs text-muted">tg_id: {session.tgId}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-brand shadow-sm backdrop-blur">
          {session.role}
        </span>
      </header>
      <button
        type="button"
        onClick={clearSession}
        className="mt-4 text-sm font-medium text-danger underline-offset-4 hover:underline"
      >
        Chiqib ketish
      </button>
    </div>
  );
};

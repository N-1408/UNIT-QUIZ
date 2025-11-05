import { useAuthStore } from "@/store/useAuth";

export const ProfilePanel = () => {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session) {
    return (
      <div className="rounded-3xl border border-dashed border-stroke/70 bg-card/60 p-5 text-sm text-muted">
        Telegram hisobingiz aniqlanmoqda. Bir ozdan so'ng qayta oching.
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card/90 p-5 shadow-sm ring-1 ring-stroke">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Profil</p>
          <h3 className="text-lg font-semibold text-slate-100">{session.fullName}</h3>
          <p className="text-xs text-muted">tg_id: {session.tgId}</p>
        </div>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-brand">{session.role}</span>
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

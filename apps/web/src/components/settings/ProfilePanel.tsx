import { useAuthStore } from "@/store/useAuth";

export const ProfilePanel = () => {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session) {
    return (
      <div className="rounded-[28px] border border-dashed border-stroke/70 bg-surface p-5 text-sm text-text-secondary shadow-elev-sm">
        Telegram hisobingiz aniqlanmoqda. Bir ozdan so'ng qayta oching.
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-stroke/70 bg-surface p-5 shadow-elev-sm">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Profil</p>
          <h3 className="text-lg font-semibold text-text-primary">{session.fullName}</h3>
          <p className="text-xs text-text-secondary">tg_id: {session.tgId}</p>
        </div>
        <span className="rounded-full border border-brand/30 bg-brand-light px-3 py-1 text-xs font-semibold text-brand shadow-elev-sm">
          {session.role}
        </span>
      </header>
      <button
        type="button"
        onClick={clearSession}
        className="mt-4 text-sm font-medium text-danger underline-offset-4 transition duration-swift ease-fluid hover:underline"
      >
        Chiqib ketish
      </button>
    </div>
  );
};

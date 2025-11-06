import { useAuthStore } from "@/store/useAuth";

const placeholderCopy = "Telegram hisobingiz aniqlanmoqda. Bir ozdan so'ng qayta kirib ko'ring.";

export const ProfilePanel = () => {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session) {
    return (
      <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
        {placeholderCopy}
      </div>
    );
  }

  const initials = session.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-base font-semibold text-brand">
        {initials || "TG"}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary">{session.fullName}</h3>
        <p className="text-xs text-text-secondary">tg_id: {session.tgId}</p>
      </div>
      <button
        type="button"
        onClick={clearSession}
        className="text-xs font-semibold text-accent-red underline-offset-4 transition duration-swift ease-fluid hover:underline"
      >
        Chiqish
      </button>
    </div>
  );
};

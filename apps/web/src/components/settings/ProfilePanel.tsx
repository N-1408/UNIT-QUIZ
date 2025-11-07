import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuth";

const placeholderCopy = "Telegram hisobingiz aniqlanmoqda. Bir ozdan so'ng qayta kirib ko'ring.";

export const ProfilePanel = () => {
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!session || status === "loading") {
    return (
      <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
        {status === "loading" ? "Hisob ma'lumotlari yuklanmoqda..." : placeholderCopy}
      </div>
    );
  }

  const initials = session.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const metaLine = useMemo(() => {
    const items: string[] = [];
    if (session.role) {
      const roleLabel =
        session.role === "teacher" ? "Ustoz" : session.role === "admin" ? "Admin" : "Talaba";
      items.push(roleLabel);
    }
    if (session.language) {
      items.push(`Til: ${session.language.toUpperCase()}`);
    }
    if (session.phoneNumber) {
      items.push(session.phoneNumber);
    }
    return items.join(" \u2022 ");
  }, [session.language, session.phoneNumber, session.role]);

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm">
      {session.photoUrl ? (
        <img src={session.photoUrl} alt={session.fullName} className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-base font-semibold text-brand">
          {initials || "TG"}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary">{session.fullName}</h3>
        {session.username ? (
          <p className="text-xs text-text-secondary">@{session.username}</p>
        ) : null}
        <p className="text-xs text-text-secondary">Rol: {session.role}</p>
        <p className="text-xs text-text-secondary">tg_id: {session.tgId}</p>
        {metaLine ? <p className="text-xs text-text-secondary">{metaLine}</p> : null}
        {session.createdAt ? (
          <p className="text-[11px] text-text-muted">
            Ro'yxatdan: {new Date(session.createdAt).toLocaleDateString()}
          </p>
        ) : null}
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

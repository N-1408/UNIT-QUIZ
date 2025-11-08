import { useAuthStore } from "@/store/useAuth";

export const ProfilePanel = () => {
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);

  if (!session || status === "loading") {
    return (
      <div className="rounded-[20px] border border-border bg-surface/95 p-4 text-sm text-text-secondary shadow-elev-sm">
        Hisob ma'lumotlari yuklanmoqda...
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
      {session.photoUrl ? (
        <img src={session.photoUrl} alt={session.fullName} className="h-12 w-12 rounded-full object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-base font-semibold text-brand">
          {initials || "TG"}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary">{session.fullName}</h3>
        {session.username ? <p className="text-xs text-text-secondary">@{session.username}</p> : null}
      </div>
    </div>
  );
};

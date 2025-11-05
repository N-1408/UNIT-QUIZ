import { useCurrentUser } from "../hooks/useCurrentUser";

function getInitials(first?: string | null, last?: string | null) {
  const firstInitial = first?.charAt(0) ?? "";
  const lastInitial = last?.charAt(0) ?? "";
  return (firstInitial + lastInitial).toUpperCase() || "N";
}

export default function Header() {
  const { telegramUser, profile } = useCurrentUser();

  const firstName = profile?.firstName ?? telegramUser?.first_name ?? "Foydalanuvchi";
  const lastName = profile?.lastName ?? telegramUser?.last_name ?? null;
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  const avatarUrl = telegramUser?.photo_url ?? null;

  return (
    <header className="sticky top-0 z-20 px-4 pt-5">
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        <div className="relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(135deg,_#ff5f00,_#ff7b33)] p-5 text-white shadow-[0_28px_50px_rgba(255,95,0,0.25)]">
          <div className="absolute right-6 top-4 h-20 w-20 rounded-full bg-[rgba(255,255,255,0.15)] blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">Nova LC</p>
              <h1 className="text-2xl font-semibold leading-tight">UNIT QUIZ</h1>
              <p className="mt-2 text-sm text-white/80">Assalomu alaykum, {firstName}!</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/40 bg-white/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/90">
                    {getInitials(firstName, lastName)}
                  </div>
                )}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-white">{fullName}</span>
                {telegramUser?.username ? (
                  <span className="text-xs text-white/70">@{telegramUser.username}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

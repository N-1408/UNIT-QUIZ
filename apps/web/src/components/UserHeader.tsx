import { useQuery } from "@tanstack/react-query";

type MeResponse = {
  tg_id?: string | null;
  full_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
};

export default function UserHeader() {
  const { data: me } = useQuery<MeResponse | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("https://unit-quiz.onrender.com/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  if (!me) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-4 shadow-sm">
      {me.photo_url ? (
        <img
          src={me.photo_url}
          alt={me.full_name ?? "Telegram user"}
          className="w-10 h-10 rounded-full border"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--divider)] bg-[var(--bg)] text-sm font-semibold">
          {me.full_name?.[0] || "?"}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-medium" style={{ color: "var(--fg)" }}>
          {me.full_name}
        </span>
        {me.username && (
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            @{me.username}
          </span>
        )}
      </div>
      <button
        onClick={async () => {
          await fetch("https://unit-quiz.onrender.com/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          window.location.href = "/login";
        }}
        className="ml-auto text-sm font-medium text-red-600 underline"
      >
        Logout
      </button>
    </div>
  );
}

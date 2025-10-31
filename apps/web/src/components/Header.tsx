import { useLocation, useNavigate } from "react-router-dom";
import { haptic } from "../lib/tg";

export default function Header() {
  const nav = useNavigate();
  const loc = useLocation();
  const rootRoutes = ["/", "/rating", "/settings"];
  const showBack = !rootRoutes.includes(loc.pathname);

  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{ background: 'color-mix(in oklab, var(--bg) 75%, transparent)', borderColor: 'var(--divider)' }}
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && (
            <button
              className="back-btn tap"
              onClick={() => {
                haptic.tap();
                nav(-1);
              }}
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <img src="https://inter-nation.uz/logo.svg" alt="INTERNATION" className="h-7 brand-logo" />
        </div>
        <div className="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-400">Andijan branch</div>
      </div>
    </header>
  );
}

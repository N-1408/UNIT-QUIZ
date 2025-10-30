export default function Header() {
  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{ background: 'color-mix(in oklab, var(--bg) 75%, transparent)', borderColor: 'var(--divider)' }}
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="https://inter-nation.uz/logo.svg" alt="INTERNATION" className="h-6 brand-logo" />
          <div className="text-sm opacity-70">Mini Test</div>
        </div>
        <div className="text-xs opacity-70">Andijan branch</div>
      </div>
    </header>
  );
}

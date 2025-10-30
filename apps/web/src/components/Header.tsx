export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0b]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
        <img src="https://inter-nation.uz/logo.svg" alt="INTERNATION" className="h-6" />
        <div className="text-sm text-white/60">Mini Test</div>
      </div>
    </header>
  );
}

function Header() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">INTER-NATION.UZ</p>
          <h1 className="text-xl font-semibold text-slate-900">CEFR Up — Mini Test</h1>
        </div>
        <div className="hidden text-sm text-slate-500 sm:block">
          1-bosqich • Telegram Mini App
        </div>
      </div>
    </header>
  );
}

export default Header;

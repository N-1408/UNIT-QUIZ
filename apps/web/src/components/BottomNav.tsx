import { NavLink } from 'react-router-dom';
import { Medal, Settings, SquareCheck } from 'lucide-react';

const base = 'flex-1 flex flex-col items-center justify-center gap-1 transition';
const active = 'text-[var(--brand-yellow)]';
const idle = 'opacity-70';

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t pb-[env(safe-area-inset-bottom)]"
      style={{ background: 'var(--bg)', borderColor: 'var(--divider)' }}
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-3 px-6 pb-[env(safe-area-inset-bottom)]">
        <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
          <SquareCheck size={20} />
          <span className="text-xs">Tests</span>
        </NavLink>
        <NavLink to="/rating" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
          <Medal size={20} />
          <span className="text-xs">Ranking</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
          <Settings size={20} />
          <span className="text-xs">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}

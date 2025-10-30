import { NavLink } from 'react-router-dom';
import { Medal, Settings, SquareCheck } from 'lucide-react';

const tabs = [
  {
    to: '/',
    label: 'Testlar',
    icon: SquareCheck
  },
  {
    to: '/rating',
    label: 'Reyting',
    icon: Medal
  },
  {
    to: '/settings',
    label: 'Sozlamalar',
    icon: Settings
  }
] as const;

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0b0b0b]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-between px-6 py-3">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 text-xs font-medium transition',
                isActive ? 'text-brand-yellow' : 'text-white/50 hover:text-white'
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'rounded-full p-2 transition',
                    isActive ? 'bg-brand-yellow/15 text-brand-yellow' : 'text-white/60'
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

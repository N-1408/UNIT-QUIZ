import { useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FirstVisitModal from './components/FirstVisitModal';
import TestsPage from './pages/Tests';
import RatingPage from './pages/Rating';
import SettingsPage from './pages/Settings';
import TestRunner from './pages/TestRunner';
import TeacherPanel from './pages/TeacherPanel';
import { clearUser, loadUser, saveUser, type RegisteredUser } from './lib/user';
import { useSupabase } from './providers/SupabaseProvider';

export type AppOutletContext = {
  user: RegisteredUser | null;
  updateUser: (user: RegisteredUser | null) => void;
};

function AppLayout({
  user,
  onUserChange
}: {
  user: RegisteredUser | null;
  onUserChange: (user: RegisteredUser | null) => void;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-28 pt-4">
        <Outlet context={{ user, updateUser: onUserChange }} />
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  const { authState, refreshAuth } = useSupabase();
  const [user, setUser] = useState<RegisteredUser | null>(null);

  useEffect(() => {
    const stored = loadUser();
    setUser(stored);
  }, []);

  const updateUser = (value: RegisteredUser | null) => {
    setUser(value);
    if (value) {
      saveUser(value);
    } else {
      clearUser();
    }
  };

  const handleComplete = (data: RegisteredUser) => {
    updateUser(data);
  };

  if (authState.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 text-center text-sm">
        <div className="flex flex-col items-center gap-3 text-[var(--muted)]">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--fg)]" />
          <p>Authorizing via Telegram...</p>
        </div>
      </div>
    );
  }

  if (authState.status === 'developer' || authState.status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 text-center text-sm">
        <div className="flex max-w-xs flex-col items-center gap-4 rounded-2xl border border-[var(--divider)] bg-[var(--card)] p-5 text-[var(--fg)]">
          <div className="text-base font-semibold">Telegram authentication</div>
          <p className="text-sm text-[var(--muted)]">{authState.message}</p>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => refreshAuth(true)}
          >
            Retry authentication
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<AppLayout user={user} onUserChange={updateUser} />}>
          <Route index element={<TestsPage />} />
          <Route path="rating" element={<RatingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="test/:id" element={<TestRunner />} />
        <Route path="teacher" element={<TeacherPanel />} />
      </Routes>
      {!user && <FirstVisitModal onComplete={handleComplete} />}
    </>
  );
}

export default App;

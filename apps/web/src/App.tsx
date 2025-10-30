import { useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FirstVisitModal from './components/FirstVisitModal';
import TestsPage from './pages/Tests';
import RatingPage from './pages/Rating';
import SettingsPage from './pages/Settings';
import TestRunner from './pages/TestRunner';
import TeacherPanel from './pages/TeacherPanel';
import { clearUser, loadUser, saveUser, type RegisteredUser } from './lib/user';

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

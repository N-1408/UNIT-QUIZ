import { Outlet, Route, Routes, Navigate, useOutletContext } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TestsPage from './pages/Tests';
import RatingPage from './pages/Rating';
import SettingsPage from './pages/Settings';
import TestRunner from './pages/TestRunner';
import TeacherPanel from './pages/TeacherPanel';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

export type AuthUser = {
  tg_id: string;
  full_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
};

export type AuthOutletContext = {
  user: AuthUser;
};

function AppLayout() {
  const { user } = useOutletContext<AuthOutletContext>();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-28 pt-4">
        <Outlet context={{ user }} />
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/tests" replace />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test/:id" element={<TestRunner />} />
          <Route path="/teacher" element={<TeacherPanel />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/tests" replace />} />
    </Routes>
  );
}

export default App;

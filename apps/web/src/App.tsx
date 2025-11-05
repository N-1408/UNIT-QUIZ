import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TestsPage from './pages/Tests';
import RatingPage from './pages/Rating';
import SettingsPage from './pages/Settings';
import TestRunner from './pages/TestRunner';
import TeacherPanel from './pages/TeacherPanel';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function AppLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-28 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={(
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to="/tests" replace />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/rating" element={<RatingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/test/:id" element={<TestRunner />} />
        <Route path="/teacher" element={<TeacherPanel />} />
      </Route>
      <Route path="*" element={<Navigate to="/tests" replace />} />
    </Routes>
  );
}

export default App;

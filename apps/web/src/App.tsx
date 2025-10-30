import { Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TestsPage from './pages/Tests';
import RatingPage from './pages/Rating';
import SettingsPage from './pages/Settings';
import TestRunner from './pages/TestRunner';
import TeacherPanel from './pages/TeacherPanel';

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TestsPage />} />
        <Route path="rating" element={<RatingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="test/:id" element={<TestRunner />} />
      <Route path="teacher" element={<TeacherPanel />} />
    </Routes>
  );
}

export default App;

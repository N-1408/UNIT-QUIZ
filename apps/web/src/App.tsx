import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { ExamsPage } from "./pages/Exams";
import { ResultsPage } from "./pages/Results";
import { SettingsPage } from "./pages/Settings";
import { ExamTaking } from "./pages/ExamTaking";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { BottomNav } from "./components/BottomNav";

import { Leaderboard } from "@/pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/exam/:examId" element={<ExamTaking />} />
        <Route path="/admin" element={<TeacherDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

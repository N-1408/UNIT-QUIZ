import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { ExamsPage } from "./pages/Exams";
import { ResultsPage } from "./pages/Results";
import { SettingsPage } from "./pages/Settings";
import { BottomNav } from "./components/BottomNav";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;

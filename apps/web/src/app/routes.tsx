import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/Home";
import { ExamsPage } from "@/pages/Exams";
import { ExamDetailPage } from "@/pages/ExamDetail";
import { AttemptPage } from "@/pages/Attempt";
import { ResultsPage } from "@/pages/Results";
import { SettingsPage } from "@/pages/Settings";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "exams", element: <ExamsPage /> },
      { path: "exams/:examId", element: <ExamDetailPage /> },
      { path: "attempts/:attemptId", element: <AttemptPage /> },
      { path: "results", element: <ResultsPage /> },
      { path: "settings", element: <SettingsPage /> }
    ]
  }
]);

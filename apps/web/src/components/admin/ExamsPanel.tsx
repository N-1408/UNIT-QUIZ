import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Exam = {
  id: string;
  title: string;
  teacher: string;
  group: string;
  status: "pending" | "approved" | "archived";
  questionCount: number;
  createdAt: string;
};

const MOCK_EXAMS: Exam[] = [
  {
    id: "e1",
    title: "Unit 5 Grammar Test",
    teacher: "Alisher",
    group: "Group A",
    status: "pending",
    questionCount: 20,
    createdAt: "2024-01-15"
  },
  {
    id: "e2",
    title: "IELTS Mock Exam",
    teacher: "Zarina",
    group: "Group B",
    status: "approved",
    questionCount: 40,
    createdAt: "2024-01-14"
  }
];

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const ExamsPanel = ({ showSnackbar }: Props) => {
  const [exams, setExams] = useState(MOCK_EXAMS);

  const updateExam = (examId: string, status: Exam["status"]) => {
    setExams((prev) => prev.map((exam) => (exam.id === examId ? { ...exam, status } : exam)));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Imtihonlar boshqaruvi
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Imtihon</TableCell>
            <TableCell>O&apos;qituvchi</TableCell>
            <TableCell>Guruh</TableCell>
            <TableCell>Savollar</TableCell>
            <TableCell>Holat</TableCell>
            <TableCell>Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id} hover>
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {exam.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                  {new Date(exam.createdAt).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>{exam.teacher}</TableCell>
              <TableCell>{exam.group}</TableCell>
              <TableCell>{exam.questionCount}</TableCell>
              <TableCell>
                <Chip
                  label={
                    exam.status === "pending"
                      ? "Kutilmoqda"
                      : exam.status === "approved"
                        ? "Tasdiqlangan"
                        : "Arxivda"
                  }
                  size="small"
                  color={
                    exam.status === "pending"
                      ? "warning"
                      : exam.status === "approved"
                        ? "success"
                        : "default"
                  }
                />
              </TableCell>
              <TableCell>
                {exam.status === "pending" ? (
                  <Button
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    sx={{ color: "#10B981" }}
                    onClick={() => {
                      updateExam(exam.id, "approved");
                      showSnackbar("Imtihon tasdiqlandi", "success");
                    }}
                  >
                    Tasdiqlash
                  </Button>
                ) : null}
                {exam.status !== "archived" ? (
                  <Button
                    size="small"
                    startIcon={<ArchiveIcon />}
                    sx={{ color: "#FF5F00" }}
                    onClick={() => {
                      updateExam(exam.id, "archived");
                      showSnackbar("Imtihon arxivga yuborildi", "success");
                    }}
                  >
                    Arxivlash
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

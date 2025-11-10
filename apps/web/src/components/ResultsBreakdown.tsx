import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import type { calculateScore } from "@/lib/calculateScore";

type Breakdown = ReturnType<typeof calculateScore>["breakdown"];

type ResultsBreakdownProps = {
  breakdown: Breakdown;
  questions: Array<{ id: string; text: string; options: string[] }>;
  onReviewMistakes?: () => void;
};

export const ResultsBreakdown = ({ breakdown, questions, onReviewMistakes }: ResultsBreakdownProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const wrongAnswers = breakdown.filter((entry) => !entry.isCorrect && !entry.isSkipped);
  const skippedAnswers = breakdown.filter((entry) => entry.isSkipped);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) =>
      setExpanded(isExpanded ? panel : false);

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Chip
          icon={<CheckCircleIcon sx={{ color: "#FFFFFF" }} />}
          label={`To'g'ri: ${breakdown.filter((entry) => entry.isCorrect).length}`}
          sx={{ bgcolor: "#10B981", color: "#FFFFFF", fontWeight: 600 }}
        />
        {wrongAnswers.length > 0 ? (
          <Chip
            icon={<CancelIcon sx={{ color: "#FFFFFF" }} />}
            label={`Xato: ${wrongAnswers.length}`}
            sx={{ bgcolor: "#DC2626", color: "#FFFFFF", fontWeight: 600 }}
          />
        ) : null}
        {skippedAnswers.length > 0 ? (
          <Chip
            icon={<RemoveCircleIcon sx={{ color: "#FFFFFF" }} />}
            label={`O'tkazildi: ${skippedAnswers.length}`}
            sx={{ bgcolor: "#9CA3AF", color: "#FFFFFF", fontWeight: 600 }}
          />
        ) : null}
      </Box>

      {wrongAnswers.length > 0 && onReviewMistakes ? (
        <Button
          variant="outlined"
          onClick={onReviewMistakes}
          sx={{ mb: 3, color: "#FF5F00", borderColor: "#FF5F00", fontWeight: 600 }}
        >
          Xatolarni qayta ko'rish
        </Button>
      ) : null}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Savollar bo'yicha tafsilot
      </Typography>

      {breakdown.map((entry, index) => {
        const question = questions.find((q) => q.id === entry.questionId);
        const summaryColor = entry.isCorrect
          ? "#F0FDF4"
          : entry.isSkipped
            ? "#F9FAFB"
            : "#FEF2F2";
        const borderColor = entry.isCorrect ? "#10B981" : entry.isSkipped ? "#9CA3AF" : "#DC2626";

        return (
          <Accordion
            key={entry.questionId}
            expanded={expanded === entry.questionId}
            onChange={handleChange(entry.questionId)}
            sx={{
              mb: 1,
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              "&:before": { display: "none" }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: summaryColor,
                borderLeft: `4px solid ${borderColor}`,
                "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1 }
              }}
            >
              {entry.isCorrect ? (
                <CheckCircleIcon sx={{ color: "#10B981" }} />
              ) : entry.isSkipped ? (
                <RemoveCircleIcon sx={{ color: "#9CA3AF" }} />
              ) : (
                <CancelIcon sx={{ color: "#DC2626" }} />
              )}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {index + 1}. {question?.text?.slice(0, 90)}
                {question && question.text.length > 90 ? "..." : ""}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
                To'liq savol:
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {question?.text}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
                Javoblar:
              </Typography>
              {question?.options?.map((option, optionIndex) => {
                const isCorrectOption = entry.correctAnswer === optionIndex;
                const isUserAnswer = entry.userAnswer === optionIndex && !entry.isSkipped;

                return (
                  <Box
                    key={optionIndex}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: isCorrectOption
                        ? "#10B981"
                        : isUserAnswer
                          ? "#DC2626"
                          : "#E5E7EB",
                      bgcolor: isCorrectOption
                        ? "rgba(16,185,129,0.08)"
                        : isUserAnswer
                          ? "rgba(220,38,38,0.08)"
                          : "#FFFFFF"
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: isCorrectOption || isUserAnswer ? 600 : 400 }}>
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </Typography>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

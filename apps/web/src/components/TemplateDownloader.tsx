import { Download } from "@mui/icons-material";
import { Alert, Box, Button, Typography } from "@mui/material";

export const TemplateDownloader = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/templates/exam-template.xlsx";
    link.download = "UNIT-QUIZ-Template.xlsx";
    link.click();
  };

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        border: "2px dashed #FF5F00",
        borderRadius: 2,
        bgcolor: "rgba(255, 95, 0, 0.05)"
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: "#FF5F00" }}>
        Excel Shablon
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "#6B7280" }}>
        To&apos;g&apos;ri formatlash uchun shablonni yuklab oling.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={handleDownload}
        sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
      >
        Shablonni yuklab olish
      </Button>
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Format: Question, Option_A, Option_B, Option_C, Option_D, Correct (A/B/C/D), Image_URL (ixtiyoriy)
        </Typography>
      </Alert>
    </Box>
  );
};

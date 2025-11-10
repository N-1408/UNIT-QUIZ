import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Modal,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningIcon from "@mui/icons-material/Warning";
import { useDropzone } from "react-dropzone";
import { TemplateDownloader } from "./TemplateDownloader";
import { parseExcelFile, parsePDFFile } from "@/lib/bulkParsers";
import { ResultsBreakdown } from "./ResultsBreakdown";

type PreviewQuestion = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

type BulkImportModalProps = {
  open: boolean;
  onClose: () => void;
  onImport: (questions: PreviewQuestion[]) => void;
};

export const BulkImportModal = ({ open, onClose, onImport }: BulkImportModalProps) => {
  const [tab, setTab] = useState<"excel" | "pdf">("excel");
  const [preview, setPreview] = useState<PreviewQuestion[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const hasCriticalErrors = errors.some((error) => error.startsWith("❌"));

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      setErrors([]);
      setPreview([]);

      try {
        if (tab === "excel") {
          const result = await parseExcelFile(file);
          setPreview(result.questions.slice(0, 5));
          setErrors(result.errors);
        } else {
          const result = await parsePDFFile(file);
          setPreview(result.questions.slice(0, 5));
          setErrors(result.errors);
        }
      } catch (error) {
        setErrors([(error as Error).message ?? "Faylni tahlil qilishda xatolik."]);
      } finally {
        setLoading(false);
      }
    },
    [tab]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      tab === "excel"
        ? { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }
        : { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const breakdownPreview = useMemo(
    () =>
      preview.map((question) => ({
        questionId: question.id,
        isCorrect: false,
        isSkipped: true,
        userAnswer: null,
        correctAnswer: question.correctAnswer
      })),
    [preview]
  );

  const handleImport = () => {
    if (!preview.length || hasCriticalErrors) return;
    onImport(preview);
    onClose();
  };

  const handleClose = () => {
    setPreview([]);
    setErrors([]);
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "#FFFFFF",
          borderRadius: 3,
          boxShadow: 24,
          p: 4
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#FF5F00" }}>
          Ko&apos;p sonli savollar importi
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, value: "excel" | "pdf") => setTab(value)}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<TableChartIcon />} iconPosition="start" label="Excel (tavsiya)" value="excel" />
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="PDF (beta)" value="pdf" />
        </Tabs>

        {tab === "excel" ? (
          <Box sx={{ mb: 3 }}>
            <TemplateDownloader />
            <Alert severity="success" sx={{ mb: 2 }}>
              Excel fayllari <strong>100% ishonchli</strong>. Format to&apos;g&apos;ri bo&apos;lsa, xatolik bo&apos;lmaydi.
            </Alert>
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Alert severity="warning" icon={<WarningIcon />}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ⚠️ Ogohlantirish: PDF fayllar avtomatik o&apos;qiladi, biroq quyidagi holatlar qo&apos;l bilan tekshirilsin:
              </Typography>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li>Jadvaldagi yoki rasmdagi matnlar</li>
                <li>Noto&apos;g&apos;ri belgilanmagan variantlar</li>
                <li>Ikki tilda yozilgan savollar</li>
                <li>Murakkab formatlangan fayllar</li>
              </ul>
            </Alert>
            <Chip label="Beta xususiyat" color="warning" size="small" />
          </Box>
        )}

        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "#FF5F00" : "#E5E7EB",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragActive ? "rgba(255,95,0,0.05)" : "#F9FAFB",
            mb: 3
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="body1" sx={{ color: "#FF5F00", fontWeight: 600 }}>
              Faylni tashlang...
            </Typography>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {tab === "excel" ? ".xlsx faylni" : ".pdf faylni"} shu yerga tashlang
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Yoki faylni tanlash uchun bosing
              </Typography>
              <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 1 }}>
                Maksimal hajm: 5MB
              </Typography>
            </>
          )}
        </Box>

        {errors.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            {errors.map((error, index) => (
              <Alert key={index} severity={error.startsWith("❌") ? "error" : "warning"} sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        ) : null}

        {loading ? (
          <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
            Fayl tahlil qilinmoqda...
          </Typography>
        ) : null}

        {preview.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Namuna ({preview.length} ta savoldan dastlabki ko&apos;rinish)
            </Typography>
            <ResultsBreakdown
              breakdown={breakdownPreview}
              questions={preview.map((question) => ({
                id: question.id,
                text: question.text,
                options: question.options
              }))}
            />
          </Box>
        ) : null}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ flex: 1, color: "#6B7280", borderColor: "#E5E7EB" }}
          >
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            disabled={!preview.length || hasCriticalErrors}
            onClick={handleImport}
            sx={{
              flex: 1,
              bgcolor: "#FF5F00",
              "&:hover": { bgcolor: "#E05500" },
              "&:disabled": { bgcolor: "#E5E7EB", color: "#9CA3AF" }
            }}
          >
            Import {preview.length ? `${preview.length} savol` : ""}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

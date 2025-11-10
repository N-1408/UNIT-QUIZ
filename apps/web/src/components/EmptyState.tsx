import { Assignment, BarChart, Search } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
};

export const EmptyState = ({ icon, title, description, actionText, onAction }: EmptyStateProps) => (
  <Box
    sx={{
      m: 2,
      p: 4,
      borderRadius: 3,
      border: "1px dashed #E5E7EB",
      textAlign: "center",
      bgcolor: "#FFFFFF"
    }}
  >
    <Box sx={{ color: "#FF5F00", mb: 2, display: "flex", justifyContent: "center" }}>{icon}</Box>
    <Typography variant="h6" sx={{ color: "#1F2937", fontWeight: 600, mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: "#6B7280", textAlign: "center", mb: 3 }}>
      {description}
    </Typography>
    {actionText && onAction ? (
      <Button
        variant="contained"
        sx={{
          bgcolor: "#FF5F00",
          color: "#FFFFFF",
          "&:hover": { bgcolor: "#E05500" },
          px: 4,
          py: 1.5,
          borderRadius: 2
        }}
        onClick={onAction}
      >
        {actionText}
      </Button>
    ) : null}
  </Box>
);

export const EmptyExams = ({ onAction }: { onAction: () => void }) => (
  <EmptyState
    icon={<Search sx={{ fontSize: 48 }} />}
    title="Imtihonlar topilmadi"
    description="Hozircha siz uchun mavjud imtihonlar yo'q"
    actionText="Boshqa testlarni ko'rish"
    onAction={onAction}
  />
);

export const EmptyResults = () => (
  <EmptyState
    icon={<BarChart sx={{ fontSize: 48 }} />}
    title="Natijalar yo'q"
    description="Birinchi imtihonni topshiring va yutuqlaringizni kuzatib boring"
  />
);

export const EmptyAssignments = ({ onAction }: { onAction: () => void }) => (
  <EmptyState
    icon={<Assignment sx={{ fontSize: 48 }} />}
    title="Topshiriqlar yo'q"
    description="Hozircha yangi topshiriqlar yuklanmagan"
    actionText="Yangilash"
    onAction={onAction}
  />
);

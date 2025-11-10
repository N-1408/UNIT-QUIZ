import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const CenterOverviewPanel = ({ showSnackbar }: Props) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tezkor amallar
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant="outlined" startIcon={<PeopleIcon />} sx={{ justifyContent: "flex-start" }}>
              Yangi o&apos;quvchilar qo&apos;shish
            </Button>
            <Button variant="outlined" startIcon={<ClassIcon />} sx={{ justifyContent: "flex-start" }}>
              Yangi guruh ochish
            </Button>
            <Button variant="outlined" startIcon={<TrendingUpIcon />} sx={{ justifyContent: "flex-start" }}>
              Oylik hisobot ko&apos;rish
            </Button>
            <Button variant="outlined" startIcon={<EmailIcon />} sx={{ justifyContent: "flex-start" }}>
              Hamma o&apos;quvchilarga xabar yuborish
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Markaz ma&apos;lumotlari
          </Typography>
          <Typography variant="body1">
            <strong>Nomi:</strong> UNIT Center - Tashkent
          </Typography>
          <Typography variant="body1">
            <strong>Manzil:</strong> Chilonzor tumani, 12-mavze
          </Typography>
          <Typography variant="body1">
            <strong>Ochilgan:</strong> 15.01.2023
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Telefon:</strong> +998 90 123 45 67
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
            onClick={() => showSnackbar("Markaz ma'lumotlari yangilandi", "success")}
          >
            O&apos;zgartirish
          </Button>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

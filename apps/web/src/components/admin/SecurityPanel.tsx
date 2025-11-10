import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const SecurityPanel = ({ showSnackbar }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showSnackbar("Parollar mos kelmadi", "error");
      return;
    }
    if (newPassword.length < 8) {
      showSnackbar("Parol kamida 8 ta belgidan iborat bo'lishi kerak", "error");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showSnackbar("Parol muvaffaqiyatli yangilandi", "success");
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Xavfsizlik va ruxsatlar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
                <LockIcon /> Parolni o&apos;zgartirish
              </Typography>
              <TextField
                fullWidth
                label="Joriy parol"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Yangi parol"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Parolni tasdiqlang"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
                onClick={handleChangePassword}
              >
                Parolni yangilash
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
                <SecurityIcon /> Kirish sozlamalari
              </Typography>
              <FormControlLabel
                control={<Switch checked={twoFactor} onChange={(event) => setTwoFactor(event.target.checked)} />}
                label="Ikki bosqichli tasdiqlash (2FA)"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>
                Seans vaqti (daqiqa)
              </Typography>
              <TextField
                type="number"
                value={sessionTimeout}
                onChange={(event) => setSessionTimeout(Number(event.target.value))}
                sx={{ mb: 2 }}
              />
              <Alert severity="info">Tavsiya etilgan qiymat: 30 daqiqa</Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

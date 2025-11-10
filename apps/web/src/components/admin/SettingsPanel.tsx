import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const SettingsPanel = ({ showSnackbar }: Props) => {
  const [centerName, setCenterName] = useState("UNIT Center");
  const [defaultDuration, setDefaultDuration] = useState(60);
  const [currency, setCurrency] = useState("USD");

  const handleSave = () => {
    showSnackbar("Sozlamalar saqlandi", "success");
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Umumiy sozlamalar
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Markaz ma&apos;lumotlari
              </Typography>
              <TextField
                fullWidth
                label="Markaz nomi"
                value={centerName}
                onChange={(event) => setCenterName(event.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField fullWidth label="Billing valyutasi" value={currency} onChange={(event) => setCurrency(event.target.value)} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Imtihon sozlamalari
              </Typography>
              <TextField
                type="number"
                label="Standart imtihon davomiyligi (daqiqa)"
                value={defaultDuration}
                onChange={(event) => setDefaultDuration(Number(event.target.value))}
                fullWidth
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        sx={{ mt: 3, bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
        onClick={handleSave}
      >
        Saqlash
      </Button>
    </Box>
  );
};

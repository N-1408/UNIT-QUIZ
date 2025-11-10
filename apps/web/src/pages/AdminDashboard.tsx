import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Grid,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate } from "react-router-dom";
import { useRoleStore } from "@/store/roleStore";
import { CenterOverviewPanel } from "@/components/admin/CenterOverviewPanel";
import { TeachersPanel } from "@/components/admin/TeachersPanel";
import { StudentsPanel } from "@/components/admin/StudentsPanel";
import { GroupsPanel } from "@/components/admin/GroupsPanel";
import { ExamsPanel } from "@/components/admin/ExamsPanel";
import { SecurityPanel } from "@/components/admin/SecurityPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

type TabPanelProps = {
  children: React.ReactNode;
  value: number;
  index: number;
};

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index}>{value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null}</div>
);

export const AdminDashboard = () => {
  const role = useRoleStore((state) => state.role);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success"
  });

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (role === "student") {
      showSnackbar("Sizga ruxsat yo'q", "error");
      navigate("/");
    }
  }, [role, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB", pb: 8 }}>
      <Box sx={{ bgcolor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1F2937", mb: 1 }}>
          O&apos;quv markaz boshqaruv paneli
        </Typography>
        <Chip
          label={role === "admin" ? "Super Admin" : "Teacher"}
          sx={{ bgcolor: role === "admin" ? "#DC2626" : "#FF5F00", color: "#FFFFFF" }}
        />
      </Box>

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderLeft: "4px solid #FF5F00" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#FF5F00", fontWeight: 700 }}>
                1,247
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Jami O&apos;quvchilar
              </Typography>
              <TrendingUpIcon sx={{ color: "#10B981", fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: "#10B981", ml: 0.5 }}>
                +12%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderLeft: "4px solid #10B981" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#10B981", fontWeight: 700 }}>
                42
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Faol o&apos;qituvchilar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderLeft: "4px solid #6366F1" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#6366F1", fontWeight: 700 }}>
                89
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Guruhlar soni
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderLeft: "4px solid #DC2626" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#DC2626", fontWeight: 700 }}>
                $12,450
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Oylik daromad
              </Typography>
              <MonetizationOnIcon sx={{ color: "#10B981", fontSize: 20 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ bgcolor: "#FFFFFF", borderBottom: "1px solid #E5E7EB" }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab icon={<DashboardIcon />} label="Asosiy" />
        <Tab icon={<PeopleIcon />} label="O&apos;qituvchilar" />
        <Tab icon={<ClassIcon />} label="O&apos;quvchilar" />
        <Tab icon={<AssignmentIcon />} label="Guruhlar" />
        <Tab icon={<BarChartIcon />} label="Imtihonlar" />
        <Tab icon={<SecurityIcon />} label="Xavfsizlik" />
        <Tab icon={<SettingsIcon />} label="Sozlamalar" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <CenterOverviewPanel showSnackbar={showSnackbar} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <TeachersPanel showSnackbar={showSnackbar} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <StudentsPanel showSnackbar={showSnackbar} />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <GroupsPanel showSnackbar={showSnackbar} />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <ExamsPanel showSnackbar={showSnackbar} />
      </TabPanel>
      <TabPanel value={activeTab} index={5}>
        <SecurityPanel showSnackbar={showSnackbar} />
      </TabPanel>
      <TabPanel value={activeTab} index={6}>
        <SettingsPanel showSnackbar={showSnackbar} />
      </TabPanel>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

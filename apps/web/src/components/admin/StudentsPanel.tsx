import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmailIcon from "@mui/icons-material/Email";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

type Student = {
  id: string;
  name: string;
  telegram: string;
  group: string;
  avgScore: number;
  attendance: number;
  lastActive: string;
  status: "active" | "inactive";
};

const MOCK_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Shahzod Yunusov",
    telegram: "@shahzod",
    group: "Group A",
    avgScore: 85,
    attendance: 92,
    lastActive: "2 soat oldin",
    status: "active"
  },
  {
    id: "s2",
    name: "Nodira Karimova",
    telegram: "@nodira",
    group: "Group B",
    avgScore: 78,
    attendance: 88,
    lastActive: "1 kun oldin",
    status: "active"
  }
];

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const StudentsPanel = ({ showSnackbar }: Props) => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.telegram.toLowerCase().includes(search.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleViewProgress = () => {
    if (selectedStudent) {
      alert(`${selectedStudent.name} ning progressi ko'rsatilmoqda...`);
    }
    handleMenuClose();
  };

  const handleSendMessage = () => {
    if (selectedStudent) {
      showSnackbar(`${selectedStudent.telegram} ga xabar yuborildi`, "success");
    }
    handleMenuClose();
  };

  const handleMoveGroup = () => {
    if (!selectedStudent) return;
    const newGroup = prompt("Yangi guruh nomini kiriting:");
    if (newGroup) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id ? { ...student, group: newGroup } : student
        )
      );
      showSnackbar("O'quvchi yangi guruhga ko'chirildi", "success");
    }
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          O&apos;quvchilar nazorati
        </Typography>
        <Button
          variant="contained"
          startIcon={<GroupAddIcon />}
          sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
        >
          O&apos;quvchi qo&apos;shish
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Qidirish..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        sx={{ mb: 3 }}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>O&apos;quvchi</TableCell>
            <TableCell>Guruh</TableCell>
            <TableCell>O&apos;rtacha ball</TableCell>
            <TableCell>Davomat</TableCell>
            <TableCell>So&apos;nggi faollik</TableCell>
            <TableCell>Holat</TableCell>
            <TableCell align="right">Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((student) => (
            <TableRow key={student.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {student.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    {student.telegram}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={student.group} size="small" />
              </TableCell>
              <TableCell>
                <Typography variant="body1" sx={{ color: "#FF5F00", fontWeight: 600 }}>
                  {student.avgScore}%
                </Typography>
              </TableCell>
              <TableCell>{student.attendance}%</TableCell>
              <TableCell>{student.lastActive}</TableCell>
              <TableCell>
                <Chip
                  label={student.status === "active" ? "Faol" : "Nofaol"}
                  color={student.status === "active" ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={(event) => handleMenuOpen(event, student)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewProgress}>
          <ListItemIcon>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          Progress ko&apos;rish
        </MenuItem>
        <MenuItem onClick={handleSendMessage}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          Xabar yuborish
        </MenuItem>
        <MenuItem onClick={handleMoveGroup}>
          <ListItemIcon>
            <GroupAddIcon fontSize="small" />
          </ListItemIcon>
          Guruhga ko&apos;chirish
        </MenuItem>
      </Menu>
    </Box>
  );
};

import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

type Teacher = {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  studentCount: number;
  isActive: boolean;
  groups: string[];
};

const MOCK_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Alisher Karimov",
    email: "alisher@unit.uz",
    subjects: ["Grammar", "IELTS"],
    studentCount: 45,
    isActive: true,
    groups: ["Group A", "Group B"]
  },
  {
    id: "t2",
    name: "Zarina O'rinova",
    email: "zarina@unit.uz",
    subjects: ["Vocabulary", "Speaking"],
    studentCount: 32,
    isActive: true,
    groups: ["Group C"]
  }
];

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const TeachersPanel = ({ showSnackbar }: Props) => {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filtered = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, teacher: Teacher) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacher(teacher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeacher(null);
  };

  const handleResetPassword = () => {
    if (selectedTeacher) {
      showSnackbar(`${selectedTeacher.name} uchun parol tiklandi`, "success");
    }
    handleMenuClose();
  };

  const handleToggleActive = () => {
    if (!selectedTeacher) return;
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === selectedTeacher.id ? { ...teacher, isActive: !teacher.isActive } : teacher
      )
    );
    showSnackbar(
      `${selectedTeacher.name} ${selectedTeacher.isActive ? "deaktivatsiya" : "aktivatsiya"} qilindi`,
      "success"
    );
    handleMenuClose();
  };

  const handleDelete = () => {
    if (!selectedTeacher) return;
    if (window.confirm(`Haqiqatan ham ${selectedTeacher.name} ni o'chirmoqchimisiz?`)) {
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== selectedTeacher.id));
      showSnackbar("O'qituvchi o'chirildi", "success");
    }
    handleMenuClose();
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          O&apos;qituvchilar boshqaruvi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
          onClick={() => setAddDialogOpen(true)}
        >
          O&apos;qituvchi qo&apos;shish
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
            <TableCell>O&apos;qituvchi</TableCell>
            <TableCell>Fanlar</TableCell>
            <TableCell>Guruhlar</TableCell>
            <TableCell>O&apos;quvchilar</TableCell>
            <TableCell>Holat</TableCell>
            <TableCell align="right">Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((teacher) => (
            <TableRow key={teacher.id} hover>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#FFEDD5", color: "#FF5F00", width: 40, height: 40 }}>
                    {initials(teacher.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {teacher.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {teacher.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {teacher.subjects.map((subject) => (
                    <Chip key={subject} label={subject} size="small" sx={{ bgcolor: "#DBEAFE", color: "#1D4ED8" }} />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {teacher.groups.map((group) => (
                    <Chip key={group} label={group} variant="outlined" size="small" />
                  ))}
                </Box>
              </TableCell>
              <TableCell>{teacher.studentCount}</TableCell>
              <TableCell>
                <Chip
                  label={teacher.isActive ? "Faol" : "Nofaol"}
                  color={teacher.isActive ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={(event) => handleMenuOpen(event, teacher)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleResetPassword}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          Parolni tiklash
        </MenuItem>
        <MenuItem onClick={handleToggleActive}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {selectedTeacher?.isActive ? "Deaktivatsiya qilish" : "Aktivatsiya qilish"}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "#DC2626" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "#DC2626" }} />
          </ListItemIcon>
          O&apos;chirish
        </MenuItem>
      </Menu>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>O&apos;qituvchi qo&apos;shish</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="To&apos;liq ism" sx={{ mb: 2, mt: 1 }} />
          <TextField fullWidth label="Email" type="email" sx={{ mb: 2 }} />
          <TextField fullWidth label="Telefon" sx={{ mb: 2 }} />
          <TextField fullWidth label="Mutaxassisliklar (vergul bilan)" placeholder="Grammar, IELTS" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Bekor qilish</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" } }}
            onClick={() => {
              setAddDialogOpen(false);
              showSnackbar("O'qituvchi qo'shildi", "success");
            }}
          >
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

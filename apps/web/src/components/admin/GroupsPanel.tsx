import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Group = {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "IELTS";
};

const MOCK_GROUPS: Group[] = [
  { id: "g1", name: "Group A", teacher: "Alisher Karimov", studentCount: 15, level: "Intermediate" },
  { id: "g2", name: "Group B", teacher: "Zarina O'rinova", studentCount: 20, level: "IELTS" }
];

const TEACHERS = ["Alisher Karimov", "Zarina O'rinova", "Rustam Tursunov"];
const LEVELS: Array<Group["level"]> = ["Beginner", "Intermediate", "Advanced", "IELTS"];

type Props = {
  showSnackbar: (message: string, severity?: "success" | "error") => void;
};

export const GroupsPanel = ({ showSnackbar }: Props) => {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Group["level"]>("Intermediate");

  const handleCreateGroup = () => {
    if (!newGroupName || !selectedTeacher) {
      showSnackbar("Barcha maydonlarni to'ldiring", "error");
      return;
    }
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name: newGroupName,
      teacher: selectedTeacher,
      studentCount: 0,
      level: selectedLevel
    };
    setGroups((prev) => [...prev, newGroup]);
    setNewGroupName("");
    setSelectedTeacher(null);
    showSnackbar("Guruh yaratildi", "success");
  };

  const handleDelete = (groupId: string) => {
    if (window.confirm("Guruhni o'chirmoqchimisiz?")) {
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      showSnackbar("Guruh o'chirildi", "success");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Guruhlar boshqaruvi
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Yangi guruh yaratish
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Guruh nomi"
              value={newGroupName}
              onChange={(event) => setNewGroupName(event.target.value)}
              sx={{ flex: 1, minWidth: 220 }}
            />
            <Autocomplete
              options={TEACHERS}
              value={selectedTeacher}
              onChange={(_, value) => setSelectedTeacher(value)}
              renderInput={(params) => <TextField {...params} label="O'qituvchi" sx={{ minWidth: 200 }} />}
            />
            <Autocomplete
              options={LEVELS}
              value={selectedLevel}
              onChange={(_, value) => setSelectedLevel((value as Group["level"]) ?? "Intermediate")}
              renderInput={(params) => <TextField {...params} label="Daraja" sx={{ minWidth: 150 }} />}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: "#FF5F00", "&:hover": { bgcolor: "#E05500" }, height: 56 }}
              onClick={handleCreateGroup}
            >
              Yaratish
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Guruh</TableCell>
            <TableCell>O'qituvchi</TableCell>
            <TableCell>Daraja</TableCell>
            <TableCell>O'quvchilar</TableCell>
            <TableCell align="right">Amallar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id} hover>
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {group.name}
                </Typography>
              </TableCell>
              <TableCell>{group.teacher}</TableCell>
              <TableCell>
                <Chip label={group.level} color="primary" size="small" />
              </TableCell>
              <TableCell>{group.studentCount} ta</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon fontSize="small" />}
                  onClick={() => handleDelete(group.id)}
                >
                  O'chirish
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

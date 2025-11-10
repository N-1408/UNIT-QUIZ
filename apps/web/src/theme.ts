import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5F00",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#1F2937"
    },
    success: {
      main: "#059669"
    },
    error: {
      main: "#DC2626"
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF"
    }
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontSize: 24, fontWeight: 700 },
    h2: { fontSize: 18, fontWeight: 600 },
    body1: { fontSize: 16, fontWeight: 400 },
    caption: { fontSize: 14, fontWeight: 400 }
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          height: 44
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E5E7EB"
        }
      }
    }
  }
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "@/types/telegram";
import { theme } from "./theme";
import { BottomNav } from "./components/BottomNav";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
        <BottomNav />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

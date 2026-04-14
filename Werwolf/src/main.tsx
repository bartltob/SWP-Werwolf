import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "./Components/Frontend/SettingsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        {" "}
        {/* ← hinzufügen */}
        <App />
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);

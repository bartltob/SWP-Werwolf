import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type SettingsContextType = {
  uiVolume: number;          // 0.0 – 1.0
  setUiVolume: (v: number) => void;
};

// ─── Context ───────────────────────────────────────────────────────────────────
const SettingsContext = createContext<SettingsContextType>({
  uiVolume: 0.5,
  setUiVolume: () => {},
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [uiVolume, setUiVolume] = useState<number>(() => {
    // Persist across page refreshes
    const stored = localStorage.getItem("uiVolume");
    return stored !== null ? parseFloat(stored) : 0.5;
  });

  const handleSetVolume = (v: number) => {
    setUiVolume(v);
    localStorage.setItem("uiVolume", String(v));
  };

  return (
    <SettingsContext.Provider value={{ uiVolume, setUiVolume: handleSetVolume }}>
      {children}
    </SettingsContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useSettings() {
  return useContext(SettingsContext);
}

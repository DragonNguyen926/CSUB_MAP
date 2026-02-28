import React, { createContext, useContext, useMemo, useState } from "react";
//the dark mode thingy
const LIGHT_THEME = {
  accent: "#5F62E6",
  bg: "#F3F5F8",
  card: "#FFFFFF",
  text: "#111111",
  muted: "rgba(20,20,20,0.55)",
  divider: "rgba(20,20,20,0.08)",
  iconBoxBg: "rgba(95,98,230,0.12)",
  avatarBg: "rgba(95,98,230,0.15)",
  pillBg: "rgba(95,98,230,0.12)",
  chevBg: "rgba(0,0,0,0.06)",
  chevText: "rgba(20,20,20,0.45)",
  tileChev: "rgba(20,20,20,0.35)",
};

type Theme = typeof LIGHT_THEME;

const DARK_THEME: Theme = {
  accent: "#8B8DFF",
  bg: "#0B0B0F",
  card: "#15151C",
  text: "#F4F4F7",
  muted: "rgba(244,244,247,0.60)",
  divider: "rgba(244,244,247,0.10)",
  iconBoxBg: "rgba(139,141,255,0.18)",
  avatarBg: "rgba(139,141,255,0.22)",
  pillBg: "rgba(139,141,255,0.18)",
  chevBg: "rgba(255,255,255,0.10)",
  chevText: "rgba(244,244,247,0.55)",
  tileChev: "rgba(244,244,247,0.35)",
};

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo<Theme>(() => (darkMode ? DARK_THEME : LIGHT_THEME), [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
import React, { createContext, useContext, useMemo, useState } from "react"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"

export type AppTheme = {
  background: any
  surface: string
  bg: string
  card: string
  text: string
  muted: string
  accent: string
  divider: string
  tabBar: string
  navCard: string
  navBorder: string
  avatarBg: string
  iconBoxBg: string
  pillBg: string
  chevBg: string
  chevText: string
  tileChev: string
}

type ThemeContextType = {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  resetTheme: () => void
  theme: AppTheme
  navTheme: typeof DefaultTheme
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const lightTheme: AppTheme = {
  surface: "#FFFFFF",
  bg: "#F6F7FB",
  card: "#FFFFFF",
  text: "#171717",
  muted: "#7A7F8C",
  accent: "#5F62E6",
  divider: "#E8EAF1",
  tabBar: "#FFFFFF",
  navCard: "#FFFFFF",
  navBorder: "#E8EAF1",
  avatarBg: "#EEF0FF",
  iconBoxBg: "#F2F4F8",
  pillBg: "#EEF0FF",
  chevBg: "#F2F4F8",
  chevText: "#5F62E6",
  tileChev: "#9AA1B2",
  background: undefined
}

const darkTheme: AppTheme = {
  surface: "#171A21",
  bg: "#0F1115",
  card: "#171A21",
  text: "#F5F7FB",
  muted: "#9AA3B2",
  accent: "#8B8DFF",
  divider: "#242A35",
  tabBar: "#171A21",
  navCard: "#171A21",
  navBorder: "#242A35",
  avatarBg: "#232847",
  iconBoxBg: "#1D2230",
  pillBg: "#232847",
  chevBg: "#222839",
  chevText: "#C9CBFF",
  tileChev: "#A8B0C2",
  background: undefined
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  const resetTheme = () => {
    setDarkMode(false)
  }

  const theme = useMemo(() => {
    return darkMode ? darkTheme : lightTheme
  }, [darkMode])

  const navTheme = useMemo(() => {
    const baseTheme = darkMode ? DarkTheme : DefaultTheme

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: theme.bg,
        card: theme.navCard,
        text: theme.text,
        border: theme.navBorder,
        primary: theme.accent,
      },
    }
  }, [darkMode, theme])

  return (
    <ThemeContext.Provider
      value={{ darkMode, setDarkMode, resetTheme, theme, navTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider")
  }
  return ctx
}
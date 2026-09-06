import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIGHT_COLORS, DARK_COLORS } from "./theme";

const STORAGE_KEY = "nyy_theme_mode"; // "light" | "dark" | "system"

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("system");
  const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme() || "light");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) setMode(saved);
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme || "light");
    });
    return () => sub.remove();
  }, []);

  const resolvedScheme = mode === "system" ? systemScheme : mode;
  const colors = resolvedScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  const setThemeMode = (newMode) => {
    setMode(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const value = useMemo(
    () => ({ colors, mode, resolvedScheme, setThemeMode }),
    [colors, mode, resolvedScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme, ThemeProvider içinde kullanılmalı");
  return ctx;
}

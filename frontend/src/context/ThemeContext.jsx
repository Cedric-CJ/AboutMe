import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Simple theme controller for accent color + motion
// Persists to localStorage and updates CSS variables used by Tailwind (accent color)

const ThemeContext = createContext(null);

const ACCENTS = {
  blue: "200 90% 52%",   // vivid blue
  green: "160 84% 39%",  // teal/green
  red: "0 84% 60%",      // soft red
};

function applyAccent(hsl) {
  const root = document.documentElement;
  root.style.setProperty("--accent", hsl);
  // Also keep primary aligned for visuals
  root.style.setProperty("--primary", hsl);
}

export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState(() => localStorage.getItem("accent") || "blue");
  const [motion, setMotion] = useState(() => (localStorage.getItem("motion") ?? "on") === "on");

  useEffect(() => {
    const hsl = ACCENTS[accent] || ACCENTS.blue;
    applyAccent(hsl);
    localStorage.setItem("accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("motion", motion ? "on" : "off");
  }, [motion]);

  const value = useMemo(() => ({ accent, setAccent, motion, setMotion, ACCENTS }), [accent, motion]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
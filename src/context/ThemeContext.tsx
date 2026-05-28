'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme =
  | 'classic'
  | 'fancy'
  | 'neon'
  | 'minimal'
  | 'dark'
  | 'vibrant'
  | 'glassmorphism'
  | 'retro'
  | 'relax';
export type LightDark = 'light' | 'dark';
export type Audience = 'kid' | 'adult';

const THEMES: Theme[] = [
  'classic',
  'fancy',
  'neon',
  'minimal',
  'dark',
  'vibrant',
  'glassmorphism',
  'retro',
  'relax',
];

function parseTheme(value: string | null): Theme {
  return THEMES.includes(value as Theme) ? (value as Theme) : 'classic';
}

function parseLightDark(value: string | null): LightDark {
  return value === 'light' || value === 'dark' ? value : 'dark';
}

function parseAudience(value: string | null): Audience {
  return value === 'adult' || value === 'kid' ? value : 'kid';
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lightDark: LightDark;
  setLightDark: (mode: LightDark) => void;
  audience: Audience;
  setAudience: (audience: Audience) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('classic');
  const [lightDark, setLightDarkState] = useState<LightDark>('dark');
  const [audience, setAudienceState] = useState<Audience>('kid');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = parseTheme(localStorage.getItem('sahara-theme'));
    const savedLightDark = parseLightDark(localStorage.getItem('sahara-light-dark'));
    const savedAudience = parseAudience(localStorage.getItem('sahara-audience'));

    setThemeState(savedTheme);
    setLightDarkState(savedLightDark);
    setAudienceState(savedAudience);
    
    // Apply to document immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-light-dark', savedLightDark);
    document.documentElement.setAttribute('data-audience', savedAudience);
    
    setMounted(true);
  }, []);

  // Apply theme to document whenever it changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-light-dark', lightDark);
    document.documentElement.setAttribute('data-audience', audience);
  }, [theme, lightDark, audience, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('sahara-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setLightDark = (mode: LightDark) => {
    setLightDarkState(mode);
    localStorage.setItem('sahara-light-dark', mode);
    document.documentElement.setAttribute('data-light-dark', mode);
  };

  const setAudience = (aud: Audience) => {
    setAudienceState(aud);
    localStorage.setItem('sahara-audience', aud);
    document.documentElement.setAttribute('data-audience', aud);
  };

  // Provide default values even before mount
  return (
    <ThemeContext.Provider value={{ theme, setTheme, lightDark, setLightDark, audience, setAudience, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

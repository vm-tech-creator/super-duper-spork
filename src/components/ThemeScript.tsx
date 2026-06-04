/** Runs before paint to apply saved theme / mode / audience and avoid flash. */
'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    const valid = ['classic','fancy','neon','minimal','dark','vibrant','glassmorphism','retro','relax'];
    const stored = localStorage.getItem('sahara-theme') || 'classic';
    const t = valid.indexOf(stored) >= 0 ? stored : 'classic';
    const ld = localStorage.getItem('sahara-light-dark') || 'dark';
    const a = localStorage.getItem('sahara-audience') || 'kid';
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.setAttribute('data-light-dark', ld);
    root.setAttribute('data-audience', a);
  }, []);

  return null;
}

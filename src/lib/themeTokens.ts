/** Use these in inline styles so themes apply everywhere. */
export const themeInline = {
  text: 'var(--text)',
  muted: 'var(--muted)',
  bg: 'var(--bg)',
  bg2: 'var(--bg2)',
  bg3: 'var(--bg3)',
  gold: 'var(--gold)',
  goldDim: 'var(--gold-dim)',
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  soft: 'var(--secondary-soft)',
  border: 'var(--border)',
  surface: 'var(--surface)',
  surfaceElevated: 'var(--surface-elevated)',
  onAccent: 'var(--bg)',
  overlay: 'color-mix(in srgb, var(--bg) 75%, transparent)',
  deep: 'var(--primary)',
  mid: 'var(--secondary)',
  ink: 'var(--bg)',
} as const;

/** NEVER append hex alpha to var() — use this instead. */
export function mix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

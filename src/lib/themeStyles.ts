/** Shared CSS-variable style tokens — every page should use these, not hex codes. */
export const t = {
  accent: 'var(--gold)',
  accentDim: 'var(--gold-dim)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  bg: 'var(--bg)',
  bg2: 'var(--bg2)',
  bg3: 'var(--bg3)',
  border: 'var(--border)',
  surface: 'var(--surface)',
  surfaceElevated: 'var(--surface-elevated)',
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  secondarySoft: 'var(--secondary-soft)',
} as const;

export function getPageThemeStyles() {
  return {
    accentColor: t.accent,
    textPrimary: t.text,
    textSecondary: t.muted,
    cardBg: t.bg3,
    borderColor: t.border,
    glow: 'color-mix(in srgb, var(--gold) 45%, transparent)',
    viewportBg:
      'linear-gradient(165deg, var(--bg) 0%, var(--bg2) 42%, color-mix(in srgb, var(--primary) 55%, var(--bg3)) 100%)',
    contentShell: '',
    meshBlob1:
      'radial-gradient(circle, color-mix(in srgb, var(--gold) 38%, transparent) 0%, transparent 68%)',
    meshBlob2:
      'radial-gradient(circle, color-mix(in srgb, var(--secondary) 42%, transparent) 0%, transparent 68%)',
    sectionCategories: 'border-t border-[var(--border)] bg-[var(--bg2)]',
    sectionVideos: 'bg-[var(--bg)]',
    sectionWhy:
      'border-t border-[var(--border)] bg-gradient-to-b from-[var(--bg2)] to-[var(--bg)]',
    sectionFooter: 'border-t border-[var(--border)] bg-[var(--bg)]',
    modeIcon: '✨',
    modeDescription: 'Your look follows you on every page',
    primaryAction: 'Explore',
    secondaryAction: 'Browse',
  };
}

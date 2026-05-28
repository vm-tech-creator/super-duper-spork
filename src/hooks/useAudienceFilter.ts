import { useTheme } from '@/context/ThemeContext';

export type AudienceTag = 'kid' | 'adult' | 'all';

/** Kid mode hides items tagged adult-only. Adult shows everything. */
export function useAudienceFilter<T extends { audience?: AudienceTag }>(items: T[]): T[] {
  const { audience } = useTheme();
  if (audience === 'adult') return items;
  return items.filter((item) => item.audience !== 'adult');
}

export function audienceLabel(audience?: AudienceTag): string | null {
  if (audience === 'kid') return 'For kids';
  if (audience === 'adult') return 'Adult';
  return null;
}

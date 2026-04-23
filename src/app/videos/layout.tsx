import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LaughTube – Family-Funny Videos | Sahara',
  description:
    'Curated, all-ages funny picks from YouTube—clean comedy, cartoons, and wholesome laughs in a richer-than-YouTube hub.',
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return children;
}

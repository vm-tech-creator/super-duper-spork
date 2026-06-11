import { Suspense } from 'react';
import GameDetailClient from './GameDetailClient';

const GAME_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export function generateStaticParams() {
  return GAME_IDS.map((id) => ({ id: String(id) }));
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <GameDetailClient id={id} />
    </Suspense>
  );
}

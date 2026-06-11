export function getGameLink(id: number): string {
  if (id === 16) return '/games/space';
  if (id === 11) return '/games/rocket';
  return `/games/${id}`;
}

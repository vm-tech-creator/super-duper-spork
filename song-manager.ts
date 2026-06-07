import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

/**
 * The "Already Boring" Song.
 * Represents the generic placeholder state.
 */
const boringSong: OpenGraph = {
  type: 'music.song',
  title: 'Untitled Placeholder',
  description: 'A repetitive tune about empty states and default values.',
  siteName: 'The Boilerplate Orchestra'
};

/**
 * The "Best Songs".
 * A curated list of high-quality tracks for software engineering excellence.
 */
const bestSongs: OpenGraph[] = [
  {
    type: 'music.song',
    title: 'The Flow State',
    description: 'A rhythmic journey through 10x productivity and clean abstractions.',
    musicians: ['The Linting Legends'],
    duration: 300,
  },
  {
    type: 'music.song',
    title: 'Hydration Error Blues',
    description: 'A soul-crushing ballad about server-client mismatches.',
    musicians: ['Next.js & The Hydrators'],
    duration: 240,
  },
  {
    type: 'music.song',
    title: 'Zero Runtime Overhead',
    description: 'An upbeat track that loads faster than a static asset.',
    musicians: ['The CSS-in-JS Refugees'],
    duration: 180,
  }
];

/**
 * Replaces a list of songs with the "already boring song".
 */
export function demoteToBoringPlaylist(): OpenGraph[] {
  console.warn('Demoting playlist... mediocracy initiated.');
  return [boringSong];
}

/**
 * Replaces the boring state with the best songs available.
 */
export function getTheBestPlaylist(): OpenGraph[] {
  return bestSongs;
}
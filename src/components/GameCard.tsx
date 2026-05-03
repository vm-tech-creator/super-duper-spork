'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GameCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  genre: string;
  rating: number;
  players: string;
  releaseDate: string;
  onPlay?: () => void;
}

export default function GameCard({
  id,
  title,
  description,
  imageUrl,
  genre,
  rating,
  players,
  releaseDate,
  onPlay,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gameLink = id === 10 ? '/games/space' : id === 11 ? '/games/rocket' : `/games/${id}`;

  return (
    <Link href={gameLink}>
      <div
        className="relative group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[rgba(255,193,5,.3)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Background Image */}
      <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-[#1a2f5c] to-[#080f1c]">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080f1c] via-[rgba(8,15,28,.4)] to-transparent transition-opacity duration-300"  />
      </div>

      {/* Content */}
      <div className="relative space-y-3 border border-t-0 border-[rgba(73,122,182,.2)] bg-[rgba(8,15,28,.95)] p-5 backdrop-blur-sm">
        {/* Genre Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-[rgba(255,193,5,.15)] px-3 py-1 text-xs font-semibold uppercase tracking-[.05em] text-[#ffc105]">
            {genre}
          </span>
          <span className="flex items-center gap-1 text-sm text-[#ffc105]">
            ★ {rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-['Barlow_Condensed'] text-xl font-black uppercase tracking-[.04em] text-[#e8edf5] line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[#7a93b4] line-clamp-2">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-[#497ab6]">
          <span>👥 {players}</span>
          <span>📅 {releaseDate}</span>
        </div>

        {/* Play Button */}
        <button
          onClick={onPlay}
          className="w-full bg-gradient-to-r from-[#ffc105] to-[#e0a800] text-[#080f1c] border-none px-4 py-3 rounded font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] text-sm transition-all duration-300 hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] hover:translate-y-[-2px] cursor-pointer active:translate-y-0 mt-2"
        >
          Play Now
        </button>
      </div>

      {/* Border Glow on Hover */}
      {isHovered && (
        <div className="pointer-events-none absolute inset-0 rounded-lg border border-[#ffc105] opacity-50" />
      )}
      </div>
    </Link>
  );
}

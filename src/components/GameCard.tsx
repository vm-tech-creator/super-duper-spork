'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGameLink } from '@/utils/gameLinks';

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
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const gameLink = getGameLink(id);

  const handleCardClick = () => {
    router.push(gameLink);
  };

  return (
    <div
      className="group relative h-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--gold)_35%,transparent)]"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-[var(--bg3)] to-[var(--bg)]">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            // fallback: simple SVG placeholder data URL
            target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23737474" font-family="Arial,Helvetica,sans-serif" font-size="20">Image unavailable</text></svg>';
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[color-mix(in_srgb,var(--bg)_40%,transparent)] to-transparent transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative space-y-3 border border-t-0 border-[var(--border)] bg-[var(--surface-elevated)] p-5 backdrop-blur-sm">
        {/* Genre Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-[color-mix(in_srgb,var(--gold)_15%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[.05em] text-[var(--gold)]">
            {genre}
          </span>
          <span className="flex items-center gap-1 text-sm text-[var(--gold)]">
            ★ {rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 font-['Barlow_Condensed'] text-xl font-black uppercase tracking-[.04em] text-[var(--text)]">
          {title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-[var(--secondary)]">
          <span>👥 {players}</span>
          <span>📅 {releaseDate}</span>
        </div>

        {/* Play Button */}
        <button
          className="mt-2 w-full cursor-pointer rounded border-none bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dim)] px-4 py-3 font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[.08em] text-[var(--bg)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_color-mix(in_srgb,var(--gold)_40%,transparent)] active:translate-y-0"
          onClick={(e) => {
            e.stopPropagation();
            if (onPlay) {
              onPlay();
              return;
            }
            handleCardClick();
          }}
        >
          Play Now
        </button>
      </div>

      {/* Border Glow on Hover */}
      {isHovered && (
        <div className="pointer-events-none absolute inset-0 rounded-lg border border-[var(--gold)] opacity-50" />
      )}
    </div>
  );
}

import { BookData } from './books';

export function generateCoverSvg(book: BookData): string {
  const categoryColors: Record<string, { primary: string; secondary: string; dark: string; accent: string }> = {
    preteen: {
      primary: '#06B6D4',
      secondary: '#0EA5E9',
      dark: '#0369A1',
      accent: '#FBBF24',
    },
    teen: {
      primary: '#A855F7',
      secondary: '#EC4899',
      dark: '#7C3AED',
      accent: '#FBBF24',
    },
    adult: {
      primary: '#EAB308',
      secondary: '#F97316',
      dark: '#D97706',
      accent: '#8B5CF6',
    },
  };

  const colors = categoryColors[book.category] || categoryColors.preteen;
  const titleLower = book.title.toLowerCase();
  const titleWords = book.title.split(' ');
  const displayTitle = titleWords.slice(0, 3).join('\n');

  // Determine theme based on book title keywords
  let themeIcon = '📖';
  let pattern = 'dots';

  if (titleLower.includes('forest') || titleLower.includes('quest') || titleLower.includes('enchanted')) {
    themeIcon = '🌲';
    pattern = 'trees';
  } else if (titleLower.includes('ocean') || titleLower.includes('sea') || titleLower.includes('mystery')) {
    themeIcon = '🌊';
    pattern = 'waves';
  } else if (titleLower.includes('sky') || titleLower.includes('star') || titleLower.includes('celestial')) {
    themeIcon = '⭐';
    pattern = 'stars';
  } else if (titleLower.includes('dragon') || titleLower.includes('magic')) {
    themeIcon = '🐉';
    pattern = 'sparkles';
  } else if (titleLower.includes('robot') || titleLower.includes('gear') || titleLower.includes('code')) {
    themeIcon = '⚙️';
    pattern = 'gears';
  } else if (titleLower.includes('love') || titleLower.includes('heart') || titleLower.includes('romance')) {
    themeIcon = '💖';
    pattern = 'hearts';
  } else if (titleLower.includes('dance') || titleLower.includes('music') || titleLower.includes('rhythm')) {
    themeIcon = '🎵';
    pattern = 'circles';
  } else if (titleLower.includes('shadow') || titleLower.includes('silence') || titleLower.includes('darkness')) {
    themeIcon = '🌙';
    pattern = 'moons';
  } else if (titleLower.includes('adventure') || titleLower.includes('journey') || titleLower.includes('travel')) {
    themeIcon = '🗺️';
    pattern = 'paths';
  } else if (titleLower.includes('fire') || titleLower.includes('wild') || titleLower.includes('rebel')) {
    themeIcon = '🔥';
    pattern = 'flames';
  }

  return `
    <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${colors.dark};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0" />
        </linearGradient>
        <radialGradient id="grad3" cx="50%" cy="30%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
        <pattern id="decorPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="white" opacity="0.15" />
        </pattern>
      </defs>

      <!-- Background gradient -->
      <rect width="300" height="400" fill="url(#grad1)" />

      <!-- Overlay pattern -->
      <rect width="300" height="400" fill="url(#decorPattern)" />

      <!-- Subtle gradient overlay -->
      <rect width="300" height="400" fill="url(#grad2)" />

      <!-- Radial highlight -->
      <ellipse cx="150" cy="100" rx="120" ry="80" fill="url(#grad3)" />

      <!-- Large Theme Icon/Shape -->
      <g opacity="0.25" transform="translate(150, 120)">
        <text x="0" y="0" font-size="120" text-anchor="middle" dominant-baseline="middle">${themeIcon}</text>
      </g>

      <!-- Decorative geometric shapes -->
      <circle cx="30" cy="40" r="25" fill="none" stroke="white" stroke-width="1.5" opacity="0.3" />
      <circle cx="270" cy="360" r="20" fill="none" stroke="white" stroke-width="1.5" opacity="0.3" />
      <rect x="50" y="320" width="30" height="30" fill="none" stroke="white" stroke-width="1.5" opacity="0.3" transform="rotate(45 65 335)" />

      <!-- Title container with text -->
      <text x="150" y="200" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${displayTitle.split('\n').map((line, i) => `<tspan x="150" dy="${i === 0 ? 0 : 32}">${escapeXml(line)}</tspan>`).join('')}
      </text>

      <!-- Accent line -->
      <line x1="50" y1="240" x2="250" y2="240" stroke="white" stroke-width="2" opacity="0.5" />

      <!-- Category badge at bottom -->
      <rect x="80" y="310" width="140" height="50" rx="25" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="2" opacity="0.6" />
      <text x="150" y="340" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">
        ${book.category.charAt(0).toUpperCase()}${book.category.slice(1)}
      </text>

      <!-- Decorative elements -->
      <circle cx="25" cy="25" r="4" fill="white" opacity="0.6" />
      <circle cx="275" cy="25" r="4" fill="white" opacity="0.6" />
      <circle cx="25" cy="375" r="4" fill="white" opacity="0.6" />
      <circle cx="275" cy="375" r="4" fill="white" opacity="0.6" />

      <!-- Bottom edge highlight -->
      <line x1="0" y1="395" x2="300" y2="395" stroke="white" stroke-width="1" opacity="0.3" />
    </svg>
  `;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getCoverDataUrl(book: BookData): string {
  const svg = generateCoverSvg(book);
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

# AI Agent Instructions for Sahara Supersite

This file helps AI coding assistants (ChatGPT, Claude, Copilot, etc.) understand the codebase and be immediately productive.

## Project Overview

**Sahara Supersite** is a Next.js-based entertainment platform featuring interactive music creation tools (sequencer, drums, synthesizer, effects). It's a feature-rich learning platform with particle animations, counters, and audio functionality.

See [README.md](README.md) for general project info.

## Tech Stack & Build

- **Framework**: Next.js 16.2.1 with React 19.2.4 + TypeScript 5
- **Styling**: Tailwind CSS v4 + custom CSS variables (dark navy/gold theme)
- **Bundler**: Turbopack (fast mode for `npm run dev`)
- **UI Components**: Radix UI, lucide-react icons, class-variance-authority
- **Type Checking**: Non-strict TypeScript (`"strict": false` in tsconfig.json)
- **Code Quality**: ESLint, Prettier, type-check scripts

### Essential Commands

```bash
npm run dev           # Start dev server (Turbopack)
npm run build        # Production build (uses Portless)
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run portless:publish  # Deploy with Portless
```

⚠️ **Note**: This project uses **Portless** (not standard Next.js build). The `next build` command works, but the deployment pipeline uses `portless:build` and `portless:publish`.

## Directory Structure & Patterns

```
src/app/
├── layout.tsx              # Root layout with global setup
├── page.tsx                # Home page (interactive with particles, counters)
├── globals.css             # Global styles + CSS variables
├── music/
│   ├── page.tsx            # Music listing/player page
│   └── create/
│       ├── page.tsx        # Creator hub
│       ├── sequencer/      # Sequencer tool
│       ├── synthesizer/    # Synthesizer tool
│       ├── drums/          # Drums tool
│       └── effects/        # Effects tool
```

### Styling Convention

- **CSS Variables**: Define custom theme colors in `globals.css` (e.g., `--primary`, `--gold`, `--bg`)
- **Tailwind Config**: Extended in `tailwind.config.js` with custom fonts (Bebas Neue, Barlow) and animations
- **Dark Theme**: Navy/slate blues (`#2b4c7d`, `#497ab6`) with gold accents (`#ffc105`)
- **Animations**: Custom CSS animations prefixed with `fade-up`, `fade-down`, etc.

## Code Patterns & Conventions

### Component Structure
- All interactive pages use `'use client'` directive (React 19 Client Components)
- Heavy use of `useState`, `useRef`, `useEffect` for state management (no Redux/Context API currently)
- Navigation via Next.js `<Link>` component and `useRouter()` hook
- File-based routing: `/src/app/music/page.tsx` → `/music` route

### Key Example: Home Page Pattern
The home page (`src/app/page.tsx`) demonstrates the pattern:
1. Client-side state for UI modes and filters
2. Particle animation system (DOM manipulation + CSS animations)
3. Counter animation logic
4. Scroll event listeners
5. Inline animation styles for dynamic elements

**Implication**: Expect heavy DOM manipulation and inline style generation in components. Extract animation logic to utilities if creating similar features.

### Naming Conventions
- Components: PascalCase (e.g., `SequencerPage`, `MusicPlayer`)
- Files: kebab-case for utilities and pages (e.g., `utils/animation-helpers.ts`)
- CSS classes: lowercase with hyphens, BEM-inspired

## Important Constraints & Pitfalls

### 1. TypeScript Strict Mode Disabled
`"strict": false` in `tsconfig.json` means:
- Type checking is lenient; any-types may slip through
- **Recommendation**: When adding new code, use explicit types anyway for clarity
- Watch for loose prop typing in existing components

### 2. No Strict Type Checking on Props
Existing components may lack full prop typing. If extending components, explicitly define interfaces/types for new props.

### 3. Portless Integration
- Standard `npm run dev` and local `npm run build` work fine
- **Deployment only**: Uses `portless:build` and `portless:publish` commands
- Don't assume standard Next.js static export behavior—Portless may have custom handling

### 4. State Management Complexity
The music page (`src/app/music/page.tsx`) has deeply nested state with many filter combinations:
- Genre, age level, favorites, albums, etc.
- **If expanding**: Consider extracting state to Context or custom hooks early to avoid prop drilling

### 5. Environment Variables
No `.env.local` or environment configuration shown. If adding external APIs/services:
- Create `.env.local` at project root
- Document required env vars in a `.env.example` file
- Update deployment configuration for Portless

## Common Development Tasks

### Adding a New Music Tool
1. Create folder: `src/app/music/create/[tool-name]/`
2. Create `page.tsx` with `'use client'` directive
3. Use existing CSS variables from `globals.css`
4. Import Tailwind utilities and Radix UI components
5. Add navigation link in parent create page

### Styling a New Component
1. Use Tailwind CSS utility classes as primary method
2. For complex animations, add to `tailwind.config.js` animation section
3. Reference global CSS variables for brand colors (e.g., `--primary`, `--gold`)
4. Test dark theme appearance

### Performance Considerations
- Turbopack hot reload is fast; leverage it during development
- Particle animations and counters are heavy on DOM—profile with Chrome DevTools if adding similar features
- Server-side rendering (SSR) is available; use for static content where possible

## Useful Files to Reference

- **[tailwind.config.js](tailwind.config.js)** – Theme colors, fonts, animations
- **[globals.css](src/app/globals.css)** – Global styles and CSS variable definitions
- **[package.json](package.json)** – Dependencies, scripts, project metadata
- **[tsconfig.json](tsconfig.json)** – TypeScript configuration (note: strict: false)
- **[src/app/page.tsx](src/app/page.tsx)** – Reference implementation for particle animations, counters

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Kill Node process: `taskkill /PID <pid> /F` (Windows) |
| TypeScript errors but code works | Check if error is real or strict-mode false issue |
| Styles not applying | Verify Tailwind class name spelling; check globals.css for custom var override |
| Portless deploy fails | Ensure `portless:build` completes locally first |

---

**Last Updated**: April 2026  
**For questions**: Refer to [README.md](README.md) or explore component examples in `src/app/`

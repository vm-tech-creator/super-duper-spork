import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">About This Site</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">A quick guide to the sections and modules that make up this site — what you'll find, who it's for, and how to contribute.</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Books</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Curated markdown books with a built-in reader, bookmarks, and cover images. Book pages are prerendered at build time so reading is fast and reliable.</p>
          <Link href="/books" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">Browse books →</Link>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Games</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Interactive browser games and learning activities built with modern web APIs, canvas, and Three.js where applicable. Designed for engagement and learning.</p>
          <Link href="/games" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">See games →</Link>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Videos & Music</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Media sections include curated videos and a simple music creation area. Watch and create directly in your browser with interactive controls.</p>
          <Link href="/videos" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">Watch →</Link>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Wonders & Maps</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">3D globe visualizations and interactive maps highlighting global wonders and locations, with photos, trivia, and guided questions.</p>
          <Link href="/wonders" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">Explore wonders →</Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Site Modules</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-4">Theme system with presets and user selections</li>
          <li className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-4">Language selector and audience mode (Kid / Adult)</li>
          <li className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-4">Settings menu with preferences and accessibility options</li>
          <li className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-4">Static export build optimized for GitHub Pages deployment</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Who This Site Serves</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">This site is intentionally multi-audience — it's designed to be useful for kids, teens, and adults by adapting content, visuals, and controls to fit different needs:</p>
        <ul className="mt-3 list-disc list-inside text-sm text-[var(--muted)] space-y-2">
          <li><strong>Kids:</strong> Simplified UI, larger controls, and playful learning games help younger learners explore topics safely.</li>
          <li><strong>Teens:</strong> Deeper reading lists, thought questions, and interactive maps that invite exploration and critical thinking.</li>
          <li><strong>Adults:</strong> Long-form fiction, essays, and media with full-text readers and richer study resources.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Accessibility & Settings</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">Accessibility is a priority: theme contrast, text sizing, keyboard navigation, and reader controls are provided. Use the settings menu (top right) to toggle themes, audience mode, and other preferences — these persist locally so your choices stay consistent across visits.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">How To Use This Site</h2>
        <ol className="mt-3 list-decimal list-inside text-sm text-[var(--muted)] space-y-2">
          <li>Browse collections from the top navigation: Books, Games, Videos, and Music.</li>
          <li>Open any book to read in the built-in reader — you can toggle between paginated and full-text views.</li>
          <li>Use the Wonders Map to explore global sites visually on a 3D globe.</li>
          <li>Use the Language selector and Audience mode to tailor content tone and difficulty.</li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Data & Privacy</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">This static site does not collect personal data. Settings are stored locally in your browser (localStorage) to preserve preferences like bookmarks and theme choices. If a server feature is added, it will be documented and opt-in.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Contributing</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Contributions are welcome — send a pull request or open an issue with ideas for new content, accessibility improvements, or additional learning modules.</p>
      </section>
    </main>
  );
}

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">About This Site</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">A quick guide to the sections and modules that make up this site.</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Books</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Curated markdown books with built-in reader and cover images. Pages are prerendered at build time for fast delivery.</p>
          <Link href="/books" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">Browse books →</Link>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Games</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Interactive browser games and learning activities built with modern web APIs and canvas/three.js where applicable.</p>
          <Link href="/games" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">See games →</Link>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Videos & Music</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Media sections include curated videos and a simple music creation area. Watch and create directly in your browser.</p>
          <Link href="/videos" className="mt-4 inline-block text-sm font-semibold text-[var(--gold)]">Watch →</Link>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-sm">
          <h2 className="text-lg font-bold">Wonders & Maps</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">3D globe visualizations and interactive maps highlighting global wonders and locations.</p>
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
        <h2 className="text-2xl font-bold">Contributing</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Contributions are welcome — send a pull request or open an issue with ideas for new content, accessibility improvements, or additional learning modules.</p>
      </section>
    </main>
  );
}

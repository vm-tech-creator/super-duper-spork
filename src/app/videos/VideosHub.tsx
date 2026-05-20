'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SaharaHeader from '@/components/SaharaHeader';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Download,
  Film,
  Heart,
  Home,
  Laugh,
  LayoutGrid,
  ListVideo,
  Menu,
  Mic2,
  MoreHorizontal,
  PanelRight,
  Play,
  Search,
  Settings2,
  Sparkles,
  Star,
  ThumbsUp,
  Upload,
  X,
} from 'lucide-react';

const C = {
  deep: '#2b4c7d',
  mid: '#497ab6',
  soft: '#88a9d8',
  gold: '#ffc105',
  ink: '#080f1c',
} as const;

type VideoItem = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  tags: string[];
  quote: string;
};

const LIBRARY: VideoItem[] = [
  {
    id: 'w0ffwDYo00Q',
    title: "Simon's Cat: Cat Man Do",
    channel: 'SimonsCat',
    duration: '2:40',
    tags: ['Cartoon', 'Cats', 'Classic'],
    quote: 'Silent cartoon timing that lands for kids and grown-ups alike.',
  },
  {
    id: 'KYniUCGPGLs',
    title: 'Masha and the Bear – Recipe for Disaster (Ep. 17)',
    channel: 'Masha and The Bear',
    duration: '6:39',
    tags: ['Animation', 'Slapstick'],
    quote: 'Big, expressive comedy—easy to follow with the official English track.',
  },
  {
    id: 'qf5ah1RGPMc',
    title: 'Shaun the Sheep – Little Sheep of Horrors',
    channel: 'Shaun the Sheep Official',
    duration: 'Full episode',
    tags: ['Stop-motion', 'Wholesome'],
    quote: 'Wordless farm chaos with Aardman timing—spooky title, silly payoff.',
  },
  {
    id: 'IwNQP1JA3gw',
    title: '1000 Marbles on a Giant Marble Run',
    channel: "Jelle's Marble Runs",
    duration: '8:32',
    tags: ['Sports', 'Satisfying'],
    quote: 'Rainbow avalanches and gentle commentary—sporting event energy without roughness.',
  },
  {
    id: 'dMIYsPw1CnI',
    title: 'OK Go – Here It Goes Again',
    channel: 'OK Go',
    duration: '3:02',
    tags: ['Music', 'Rube Goldberg'],
    quote: 'Treadmill choreography that still makes people grin.',
  },
  {
    id: 'UeG1ftTmLAg',
    title: 'Dude Perfect – Ping Pong Trick Shots 3',
    channel: 'Dude Perfect',
    duration: '7:17',
    tags: ['Family', 'Sports comedy'],
    quote: 'Rube-Goldberg ping pong chain reactions—big smiles, no rough humor.',
  },
  {
    id: 'pNW6vgY2Wgc',
    title: 'Marble Survival 100 – New Course & Traps',
    channel: "Jelle's Marble Runs",
    duration: '3:31',
    tags: ['Sports', 'Commentary'],
    quote: 'Greg Woods commentary turns marbles into a family-friendly sportscast.',
  },
  {
    id: 'MtN1YnoL46Q',
    title: 'The Duck Song',
    channel: 'forrestfire101',
    duration: '3:16',
    tags: ['Music', 'Silly'],
    quote: 'A lemonade-stand earworm—absurd in the best way for all ages.',
  },
];

function thumbUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

function ytWatch(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export default function VideosHub() {
  const [search, setSearch] = useState('');
  const [comboOpen, setComboOpen] = useState(false);
  const [comboValue, setComboValue] = useState('');
  const [segment, setSegment] = useState<'all' | 'short' | 'long'>('all');
  const [tab, setTab] = useState<'home' | 'studio' | 'live'>('home');
  const [carousel, setCarousel] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showEmpty, setShowEmpty] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
  const [page, setPage] = useState(1);
  const perPage = 3;
  const [rating, setRating] = useState(4);
  const [toggleNotify, setToggleNotify] = useState(true);
  const [sliderVol, setSliderVol] = useState(72);
  const [pickColor, setPickColor] = useState<string>(C.gold);
  const [pickDate, setPickDate] = useState('2026-04-15');
  const [qty, setQty] = useState(1);
  const [checks, setChecks] = useState({ hd: true, cc: false, kids: true });
  const [radioTheme, setRadioTheme] = useState('cinema');
  const [sortSelect, setSortSelect] = useState('trending');
  const rteRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = LIBRARY.filter(
      (v) =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.channel.toLowerCase().includes(search.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    );
    if (segment === 'short') list = list.filter((v) => v.duration.includes(':') && parseInt(v.duration.split(':')[0]!, 10) < 5);
    if (segment === 'long') list = list.filter((v) => v.duration.includes('10') || v.duration.includes('Compilation'));
    if (showEmpty) return [];
    return list;
  }, [search, segment, showEmpty]);

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));

  const comboOptions = useMemo(
    () => [...new Set(LIBRARY.flatMap((v) => v.tags))].filter((t) => t.toLowerCase().includes(comboValue.toLowerCase())),
    [comboValue],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, segment, showEmpty]);

  const featured = LIBRARY.slice(0, 4);

  const boldRte = () => {
    document.execCommand('bold');
    rteRef.current?.focus();
  };
  const italicRte = () => {
    document.execCommand('italic');
    rteRef.current?.focus();
  };

  return (
    <div
      className="min-h-screen text-[#e8edf5] relative"
      style={{
        background: `linear-gradient(165deg, ${C.ink} 0%, #0f1f38 45%, ${C.deep}ee 100%)`,
      }}
    >
      <SaharaHeader />
      <a
        href="#main-feed"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#ffc105] focus:text-[#080f1c] focus:font-barlow font-bold"
      >
        Skip to video feed
      </a>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[190] rounded-xl px-4 py-3 shadow-2xl border text-sm font-medium animate-in fade-in"
          style={{ background: C.deep, borderColor: C.soft, color: '#fff' }}
        >
          {toast}
        </div>
      )}

      <header
        className="sticky top-0 z-[100] border-b backdrop-blur-xl"
        style={{ background: `${C.deep}e6`, borderColor: `${C.mid}55` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bebas-neue font-black uppercase tracking-wide shrink-0" style={{ color: C.gold }}>
            <span className="grid place-items-center w-9 h-9 rounded-lg text-[#080f1c]" style={{ background: C.gold }}>
              S
            </span>
            <span className="hidden sm:inline">Sahara</span>
          </Link>

          <div className="hidden md:block w-px h-6 shrink-0" style={{ background: `${C.mid}66` }} role="separator" aria-orientation="vertical" />

          <nav aria-label="Breadcrumb" className="hidden md:flex text-sm" style={{ color: C.soft }}>
            <ol className="flex items-center gap-2 list-none m-0 p-0">
              <li>
                <Link href="/" className="hover:underline" style={{ color: C.soft }}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-barlow font-semibold" style={{ color: '#fff' }}>
                LaughTube
              </li>
            </ol>
          </nav>

          <div className="flex-1 max-w-xl mx-auto relative">
            <label htmlFor="video-search" className="sr-only">
              Search videos
            </label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.soft }} aria-hidden />
            <input
              id="video-search"
              type="search"
              placeholder="Search wholesome laughs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full pl-10 pr-4 py-2 text-sm outline-none border"
              style={{ background: `${C.ink}99`, borderColor: `${C.mid}66`, color: '#fff' }}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex rounded-lg overflow-hidden border" style={{ borderColor: `${C.mid}55` }}>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="px-3 py-2 text-xs font-barlow font-semibold uppercase tracking-wider flex items-center gap-1"
                style={{ background: C.mid, color: '#fff' }}
                aria-expanded={drawerOpen}
              >
                <PanelRight className="w-4 h-4" />
                Queue
              </button>
              <button
                type="button"
                onClick={() => showToast('Subscribed to LaughTube Weekly')}
                className="px-3 py-2 text-xs font-barlow font-semibold uppercase tracking-wider flex items-center gap-1"
                style={{ background: C.deep, color: C.gold }}
              >
                <Bell className="w-4 h-4" />
                Subscribe
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="p-2 rounded-lg border"
                style={{ borderColor: `${C.soft}44`, background: `${C.deep}88` }}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {dropdownOpen && (
                <ul
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl border shadow-xl py-1 z-[120] list-none m-0 p-0"
                  style={{ background: C.ink, borderColor: `${C.mid}66` }}
                >
                  <li>
                    <button type="button" role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
                      Report a problem
                    </button>
                  </li>
                  <li>
                    <button type="button" role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
                      Send feedback
                    </button>
                  </li>
                  <li>
                    <button type="button" role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
                      Keyboard shortcuts
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <div className="flex items-center -space-x-2">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-barlow font-bold" style={{ borderColor: C.gold, background: C.mid }}>
                LT
              </span>
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold" style={{ borderColor: C.soft, background: C.deep }}>
                K
              </span>
            </div>
          </div>
        </div>

        <div
          className="max-w-[1400px] mx-auto px-4 pb-2 flex flex-wrap items-center gap-3 border-t"
          style={{ borderColor: `${C.mid}33` }}
        >
          <div role="tablist" aria-label="LaughTube areas" className="flex gap-1 p-1 rounded-lg" style={{ background: `${C.ink}aa` }}>
            {(
              [
                ['home', 'Home', Home],
                ['studio', 'Studio', Clapperboard],
                ['live', 'Live', Mic2],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-barlow font-bold uppercase tracking-wide transition-colors ${
                  tab === id ? 'text-[#080f1c]' : 'text-[#c8d6ea]'
                }`}
                style={{ background: tab === id ? C.gold : 'transparent' }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div
            className="inline-flex rounded-full p-0.5 text-xs font-barlow font-bold"
            style={{ background: `${C.deep}cc`, border: `1px solid ${C.mid}55` }}
            role="group"
            aria-label="Filter by length"
          >
            {(['all', 'short', 'long'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSegment(s)}
                className="px-3 py-1.5 rounded-full capitalize"
                style={{
                  background: segment === s ? C.mid : 'transparent',
                  color: segment === s ? '#fff' : C.soft,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-barlow font-semibold px-2 py-1 rounded-md"
              style={{ color: C.soft, background: `${C.mid}22` }}
              aria-expanded={popoverOpen}
              onClick={() => setPopoverOpen((p) => !p)}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Why LaughTube?
            </button>
            {popoverOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-64 p-3 rounded-xl border shadow-xl z-[110] text-xs leading-relaxed"
                style={{ background: C.ink, borderColor: `${C.mid}66`, color: C.soft }}
              >
                Bigger cards, calmer layout, and tools YouTube buries—queue drawer, watch-later modal, and a focus on
                all-ages picks.
              </div>
            )}
          </div>

          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-barlow font-bold uppercase tracking-wider"
            style={{ background: `${C.gold}22`, color: C.gold, border: `1px solid ${C.gold}55` }}
            title="Curated for classrooms and couches"
          >
            All ages
          </span>
        </div>
      </header>

      <div
        role="alert"
        className="max-w-[1400px] mx-auto px-4 pt-4 flex items-start gap-3 rounded-xl border p-3 text-sm"
        style={{ background: `${C.mid}18`, borderColor: `${C.gold}44`, color: '#fff' }}
      >
        <Laugh className="w-5 h-5 shrink-0 mt-0.5" style={{ color: C.gold }} />
        <div>
          <strong className="font-bebas-neue uppercase tracking-wide text-[#fff]">LaughTube beta</strong>
          <p className="m-0 mt-1 opacity-90">
            Links open YouTube in a new tab. Parents: preview anything new—humor varies by household.
          </p>
        </div>
      </div>

      <section
        className="max-w-[1400px] mx-auto px-4 py-8 grid lg:grid-cols-[1fr_320px] gap-8"
        aria-labelledby="hero-heading"
      >
        <div>
          <div
            className="relative overflow-hidden rounded-2xl border p-8 md:p-12 min-h-[280px] flex flex-col justify-center gap-4"
            style={{
              borderColor: `${C.soft}44`,
              background: `linear-gradient(120deg, ${C.deep}dd 0%, ${C.mid}99 50%, ${C.ink}ee 100%)`,
            }}
          >
            <Film className="w-10 h-10" style={{ color: C.gold }} aria-hidden />
            <h1 id="hero-heading" className="font-bebas-neue text-5xl md:text-6xl m-0 tracking-wide" style={{ color: '#fff' }}>
              LaughTube
            </h1>
            <p className="m-0 max-w-xl text-base md:text-lg" style={{ color: C.soft }}>
              YouTube’s catalog, a calmer stage—carousel hero, crisp cards, and a queue that feels like a real TV night.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => document.getElementById('main-feed')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-barlow font-bold uppercase tracking-wider text-sm"
                style={{ background: C.gold, color: C.ink }}
              >
                <Play className="w-4 h-4 fill-current" />
                Start watching
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-barlow font-semibold text-sm border"
                style={{ borderColor: C.soft, color: '#fff', background: 'transparent' }}
              >
                <Heart className="w-4 h-4" />
                Save for later
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bebas-neue text-xl font-bold uppercase tracking-wide m-0" style={{ color: C.gold }}>
                Featured carousel
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  className="p-2 rounded-lg border"
                  style={{ borderColor: `${C.mid}66`, background: `${C.deep}88` }}
                  onClick={() => setCarousel((c) => (c - 1 + featured.length) % featured.length)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  className="p-2 rounded-lg border"
                  style={{ borderColor: `${C.mid}66`, background: `${C.deep}88` }}
                  onClick={() => setCarousel((c) => (c + 1) % featured.length)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border aspect-video max-h-[420px]" style={{ borderColor: `${C.mid}55` }}>
              <iframe
                title={featured[carousel]!.title}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${featured[carousel]!.id}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-2 text-sm m-0" style={{ color: C.soft }}>
              Now showing: <strong style={{ color: '#fff' }}>{featured[carousel]!.title}</strong>
            </p>
            <div className="flex gap-1 mt-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  className="h-1.5 flex-1 rounded-full transition-all"
                  style={{ background: i === carousel ? C.gold : `${C.soft}44` }}
                  onClick={() => setCarousel(i)}
                />
              ))}
            </div>
          </div>

          <hr className="my-10 border-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.mid}, transparent)` }} />

          <div id="main-feed" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <LayoutGrid className="w-6 h-6" style={{ color: C.gold }} />
              <h2 className="font-bebas-neue text-xl font-bold uppercase tracking-wide m-0">Main feed</h2>
            </div>

            {loadingDemo ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4" aria-busy="true">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border p-3 space-y-3 animate-pulse" style={{ borderColor: `${C.mid}33` }}>
                    <div className="h-36 rounded-lg" style={{ background: `${C.deep}88` }} />
                    <div className="h-4 rounded" style={{ background: `${C.mid}44` }} />
                    <div className="h-3 rounded w-2/3" style={{ background: `${C.soft}33` }} />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="rounded-2xl border border-dashed p-10 text-center"
                style={{ borderColor: `${C.soft}55`, background: `${C.deep}33` }}
              >
                <ListVideo className="w-12 h-12 mx-auto mb-3 opacity-60" />
                <h3 className="m-0 font-barlow font-bold text-lg">No laughs match that filter</h3>
                <p className="mt-2 text-sm m-0" style={{ color: C.soft }}>
                  Try clearing search or toggling the empty-state demo off in the studio panel.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-lg font-barlow font-bold text-sm"
                  style={{ background: C.gold, color: C.ink }}
                  onClick={() => {
                    setShowEmpty(false);
                    setSearch('');
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paged.map((v) => (
                  <article
                    key={v.id}
                    className="rounded-2xl border overflow-hidden flex flex-col shadow-lg transition-transform hover:-translate-y-0.5"
                    style={{ borderColor: `${C.mid}44`, background: `${C.ink}ee` }}
                  >
                    <a href={ytWatch(v.id)} target="_blank" rel="noopener noreferrer" className="block relative group">
                      <img src={thumbUrl(v.id)} alt="" className="w-full aspect-video object-cover" />
                      <span
                        className="absolute bottom-2 right-2 text-[10px] font-barlow font-bold px-1.5 py-0.5 rounded"
                        style={{ background: '#000c', color: '#fff' }}
                      >
                        {v.duration}
                      </span>
                      <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Play className="w-14 h-14 text-white drop-shadow-lg" fill="white" />
                      </span>
                    </a>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div className="flex gap-3">
                        <div
                          className="w-10 h-10 rounded-full grid place-items-center text-xs font-black shrink-0"
                          style={{ background: C.mid, color: '#fff' }}
                          aria-hidden
                        >
                          {v.channel.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="m-0 text-base font-barlow font-bold leading-snug">
                            <a href={ytWatch(v.id)} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:underline">
                              {v.title}
                            </a>
                          </h3>
                          <p className="m-0 mt-1 text-xs" style={{ color: C.soft }}>
                            {v.channel}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {v.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] uppercase font-barlow font-bold px-2 py-0.5 rounded-full"
                                style={{ background: `${C.mid}33`, color: C.soft, border: `1px solid ${C.soft}44` }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <blockquote
                        className="m-0 text-sm pl-3 border-l-4 italic"
                        style={{ borderColor: C.gold, color: '#dbe5f5' }}
                      >
                        {v.quote}
                      </blockquote>
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-barlow font-bold px-2 py-1 rounded-md"
                          style={{ background: `${C.mid}44`, color: '#fff' }}
                          onClick={() => showToast(`Queued: ${v.title}`)}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Queue
                        </button>
                        <a
                          href={ytWatch(v.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold no-underline"
                          style={{ color: C.gold }}
                          title="Opens YouTube in a new tab"
                        >
                          Open on YouTube ↗
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-40"
                style={{ background: C.deep, color: '#fff', border: `1px solid ${C.mid}` }}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className="w-9 h-9 rounded-lg text-sm font-bold"
                  style={{
                    background: n === page ? C.gold : C.deep,
                    color: n === page ? C.ink : '#fff',
                    border: `1px solid ${n === page ? C.gold : C.mid}`,
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-40"
                style={{ background: C.deep, color: '#fff', border: `1px solid ${C.mid}` }}
                disabled={page >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                Next
              </button>
            </nav>
          </div>

          <section className="mt-12 rounded-2xl border p-5" style={{ borderColor: `${C.mid}44`, background: `${C.deep}44` }}>
            <h2 className="font-bebas-neue text-lg font-bold uppercase tracking-wide m-0 mb-4">Creator studio (demo form)</h2>
            <form
              className="grid md:grid-cols-2 gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Playlist idea saved locally (demo only)');
              }}
            >
              <fieldset className="border rounded-xl p-4 m-0" style={{ borderColor: `${C.soft}44` }}>
                <legend className="px-2 font-bold text-sm" style={{ color: C.gold }}>
                  Watch preferences
                </legend>
                <div className="space-y-3 mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checks.hd}
                      onChange={(e) => setChecks((c) => ({ ...c, hd: e.target.checked }))}
                    />
                    Prefer HD thumbnails
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checks.cc}
                      onChange={(e) => setChecks((c) => ({ ...c, cc: e.target.checked }))}
                    />
                    Highlight caption-friendly picks
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checks.kids}
                      onChange={(e) => setChecks((c) => ({ ...c, kids: e.target.checked }))}
                    />
                    Kids-in-room safe mode
                  </label>
                </div>
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold uppercase" style={{ color: C.soft }}>
                    Mood radio
                  </span>
                  {(['cinema', 'chaos', 'cozy'] as const).map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                      <input type="radio" name="mood" checked={radioTheme === m} onChange={() => setRadioTheme(m)} />
                      {m}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-4">
                <div>
                  <label htmlFor="pl-name" className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                    Playlist name
                  </label>
                  <input
                    id="pl-name"
                    type="text"
                    placeholder="Friday Funny Mix"
                    className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
                    style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }}
                  />
                </div>
                <div>
                  <label htmlFor="pl-notes" className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                    Notes
                  </label>
                  <textarea
                    id="pl-notes"
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm border outline-none resize-y"
                    style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }}
                    placeholder="What should the room feel like?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="pl-date" className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                      Watch night
                    </label>
                    <input
                      id="pl-date"
                      type="date"
                      value={pickDate}
                      onChange={(e) => setPickDate(e.target.value)}
                      className="w-full rounded-lg px-2 py-2 text-sm border"
                      style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="pl-color" className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                      Accent color
                    </label>
                    <input
                      id="pl-color"
                      type="color"
                      value={pickColor}
                      onChange={(e) => setPickColor(e.target.value)}
                      className="w-full h-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="vol" className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                    Default player volume ({sliderVol}%)
                  </label>
                  <input
                    id="vol"
                    type="range"
                    min={0}
                    max={100}
                    value={sliderVol}
                    onChange={(e) => setSliderVol(+e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <span
                      className="relative w-10 h-6 rounded-full transition-colors"
                      style={{ background: toggleNotify ? C.gold : `${C.mid}66` }}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={toggleNotify}
                        onChange={(e) => setToggleNotify(e.target.checked)}
                      />
                      <span
                        className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                        style={{ transform: toggleNotify ? 'translateX(16px)' : 'none' }}
                      />
                    </span>
                    Weekly laugh digest
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase" style={{ color: C.soft }}>
                      Clips
                    </span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg font-bold"
                      style={{ background: C.mid, color: '#fff' }}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-black">{qty}</span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-lg font-bold"
                      style={{ background: C.mid, color: '#fff' }}
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="sort" className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                    Sort queue
                  </label>
                  <select
                    id="sort"
                    value={sortSelect}
                    onChange={(e) => setSortSelect(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm border"
                    style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }}
                  >
                    <option value="trending">Trending wholesomeness</option>
                    <option value="short">Short bursts</option>
                    <option value="classic">Classics first</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1" style={{ color: C.soft }}>
                    Upload cover art (demo)
                  </label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer text-sm" style={{ borderColor: `${C.soft}66` }}>
                    <Upload className="w-4 h-4" />
                    Choose file
                    <input type="file" className="sr-only" accept="image/*" />
                  </label>
                </div>
                <div className="rounded-lg border p-3 flex items-center gap-3" style={{ borderColor: `${C.mid}44`, background: `${C.ink}aa` }}>
                  <Download className="w-5 h-5 shrink-0" style={{ color: C.gold }} />
                  <div>
                    <div className="text-xs font-bold uppercase" style={{ color: C.soft }}>
                      Offline kit
                    </div>
                    <a href="#" className="text-sm font-semibold no-underline" style={{ color: '#fff' }} onClick={(e) => e.preventDefault()}>
                      laughtube-checklist.pdf
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-barlow font-bold uppercase tracking-wider"
                  style={{ background: C.gold, color: C.ink }}
                >
                  Save playlist draft
                </button>
              </div>
            </form>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase m-0 mb-2" style={{ color: C.soft }}>
                Mini rich-text editor
              </h3>
              <div className="flex gap-1 mb-2">
                <button type="button" className="px-2 py-1 rounded text-xs font-bold" style={{ background: C.mid, color: '#fff' }} onClick={boldRte}>
                  Bold
                </button>
                <button type="button" className="px-2 py-1 rounded text-xs font-bold" style={{ background: C.mid, color: '#fff' }} onClick={italicRte}>
                  Italic
                </button>
              </div>
              <div
                ref={rteRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[100px] rounded-lg border p-3 text-sm outline-none"
                style={{ borderColor: `${C.mid}66`, background: C.ink }}
              >
                Type your <strong>show notes</strong> here—like a tiny <em>studio teleprompter</em>.
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-xl border" style={{ borderColor: `${C.mid}44` }}>
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Sample analytics</caption>
                <thead>
                  <tr style={{ background: `${C.deep}cc` }}>
                    <th className="text-left p-3 font-barlow uppercase text-xs tracking-wide">Video</th>
                    <th className="text-left p-3 font-barlow uppercase text-xs tracking-wide">Vibe</th>
                    <th className="text-left p-3 font-barlow uppercase text-xs tracking-wide">Laugh meter</th>
                  </tr>
                </thead>
                <tbody>
                  {LIBRARY.slice(0, 4).map((v) => (
                    <tr key={v.id} className="border-t" style={{ borderColor: `${C.mid}33` }}>
                      <td className="p-3 font-medium">{v.title}</td>
                      <td className="p-3" style={{ color: C.soft }}>
                        {v.tags[0]}
                      </td>
                      <td className="p-3">
                        <meter low={0.3} high={0.8} optimum={0.9} value={0.5 + (v.id.charCodeAt(2) % 5) / 10} className="w-full max-w-[140px]">
                          {50 + (v.id.charCodeAt(2) % 40)}%
                        </meter>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase block mb-1" style={{ color: C.soft }}>
                  Rate LaughTube
                </span>
                <div role="group" aria-label="Star rating" className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-label={`${s} stars`}
                      onClick={() => setRating(s)}
                      className="p-0 border-0 bg-transparent cursor-pointer"
                    >
                      <Star className="w-6 h-6" fill={s <= rating ? C.gold : 'none'} stroke={C.gold} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between text-xs mb-1" style={{ color: C.soft }}>
                  <span>Buffering storytime…</span>
                  <span>73%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `${C.mid}33` }}>
                  <div className="h-full rounded-full" style={{ width: '73%', background: `linear-gradient(90deg, ${C.gold}, ${C.soft})` }} />
                </div>
              </div>
            </div>

            <ol className="mt-6 flex items-center gap-2 list-none m-0 p-0 flex-wrap" aria-label="Upload progress">
              {['Draft', 'Review', 'Publish'].map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full grid place-items-center text-xs font-black"
                    style={{
                      background: i <= 1 ? C.gold : `${C.mid}44`,
                      color: i <= 1 ? C.ink : '#fff',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs font-bold uppercase" style={{ color: i <= 1 ? '#fff' : C.soft }}>
                    {step}
                  </span>
                  {i < 2 && <span className="text-xs" style={{ color: C.soft }}>→</span>}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bebas-neue text-lg font-bold uppercase m-0 mb-3">Showy-hidey FAQ</h2>
              <div className="space-y-2">
                {['Why not just YouTube?', 'Are these videos free?', 'Can I suggest a clip?'].map((q, i) => (
                  <div key={q} className="rounded-xl border overflow-hidden" style={{ borderColor: `${C.mid}44` }}>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-bold"
                      style={{ background: `${C.deep}88`, color: '#fff' }}
                      aria-expanded={accordionOpen === i}
                      onClick={() => setAccordionOpen((a) => (a === i ? null : i))}
                    >
                      <span className="flex items-center gap-2">
                        <Menu className="w-4 h-4" style={{ color: C.gold }} />
                        {q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${accordionOpen === i ? 'rotate-180' : ''}`}
                        style={{ color: C.soft }}
                      />
                    </button>
                    {accordionOpen === i && (
                      <div className="px-4 py-3 text-sm" style={{ background: `${C.ink}cc`, color: C.soft }}>
                        {i === 0 && 'LaughTube wraps YouTube with calmer hierarchy, queues, and classroom-minded defaults.'}
                        {i === 1 && 'Yes—each card links to the original free watch page on YouTube.'}
                        {i === 2 && 'Use the feedback items in the ⋮ menu; this demo stores nothing on a server.'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <details className="mt-4 rounded-xl border open:bg-white/5" style={{ borderColor: `${C.soft}55` }}>
                <summary className="cursor-pointer px-4 py-3 font-bold text-sm" style={{ color: C.gold }}>
                  Collapsible details (native disclosure)
                </summary>
                <div className="px-4 pb-3 text-sm" style={{ color: C.soft }}>
                  Native <code className="text-xs">&lt;details&gt;</code> is the most accessible expand/collapse primitive.
                </div>
              </details>
            </div>

            <div>
              <h2 className="font-bebas-neue text-lg font-bold uppercase m-0 mb-3">Tag combobox</h2>
              <div className="relative">
                <label htmlFor="combo" className="sr-only">
                  Filter by tag
                </label>
                <input
                  id="combo"
                  type="text"
                  value={comboValue}
                  onChange={(e) => {
                    setComboValue(e.target.value);
                    setComboOpen(true);
                  }}
                  onFocus={() => setComboOpen(true)}
                  className="w-full rounded-lg px-3 py-2 text-sm border"
                  style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }}
                  placeholder="Type a tag: cartoon, pets…"
                  role="combobox"
                  aria-expanded={comboOpen}
                  aria-autocomplete="list"
                />
                {comboOpen && comboOptions.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute z-50 mt-1 w-full max-h-40 overflow-auto rounded-lg border shadow-lg m-0 p-0 list-none"
                    style={{ background: C.ink, borderColor: `${C.mid}66` }}
                  >
                    {comboOptions.map((opt) => (
                      <li key={opt}>
                        <button
                          type="button"
                          role="option"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                          onClick={() => {
                            setSearch(opt);
                            setComboValue(opt);
                            setComboOpen(false);
                          }}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <h3 className="mt-6 font-bebas-neue text-md font-bold uppercase m-0 mb-2">Topic tree</h3>
              <ul className="m-0 pl-0 list-none text-sm" style={{ color: C.soft }}>
                <li>
                  <span className="font-bold text-white">Animals</span>
                  <ul className="mt-1 ml-4 border-l pl-3" style={{ borderColor: `${C.mid}44` }}>
                    <li>Penguins &amp; pals</li>
                    <li>Dogs being dogs</li>
                  </ul>
                </li>
                <li className="mt-3">
                  <span className="font-bold text-white">Animation</span>
                  <ul className="mt-1 ml-4 border-l pl-3" style={{ borderColor: `${C.mid}44` }}>
                    <li>Silent comedy</li>
                    <li>Stop-motion gags</li>
                  </ul>
                </li>
              </ul>

              <dl className="mt-6 text-sm grid gap-2">
                <div className="flex justify-between gap-4 border-b pb-2" style={{ borderColor: `${C.mid}33` }}>
                  <dt className="m-0 font-bold" style={{ color: C.gold }}>
                    Golden rule
                  </dt>
                  <dd className="m-0" style={{ color: C.soft }}>
                    Funny, never mean-spirited.
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="m-0 font-bold" style={{ color: C.gold }}>
                    Sources
                  </dt>
                  <dd className="m-0" style={{ color: C.soft }}>
                    YouTube embeds &amp; thumbnails.
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border p-4" style={{ borderColor: `${C.mid}44`, background: `${C.deep}55` }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-barlow text-sm font-bold uppercase m-0">Studio toggles</h2>
              <Settings2 className="w-4 h-4" style={{ color: C.soft }} />
            </div>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Demo empty state</span>
              <input type="checkbox" checked={showEmpty} onChange={(e) => setShowEmpty(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between text-sm cursor-pointer mt-2">
              <span>Demo skeleton loaders</span>
              <input
                type="checkbox"
                checked={loadingDemo}
                onChange={(e) => {
                  setLoadingDemo(e.target.checked);
                  if (e.target.checked) window.setTimeout(() => setLoadingDemo(false), 1400);
                }}
              />
            </label>
            <p className="text-xs mt-3 m-0" style={{ color: C.soft }}>
              Spinner while “loading”:
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: C.gold }}
                role="status"
                aria-label="Loading"
              />
              <span className="text-xs" style={{ color: C.soft }}>
                Fetching more joy…
              </span>
            </div>
          </div>

          <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: `${C.mid}44`, background: `${C.ink}dd` }}>
            <h3 className="font-barlow uppercase text-xs font-bold m-0 mb-2" style={{ color: C.gold }}>
              Keyboard tooltip
            </h3>
            <p className="m-0">
              <kbd
                className="px-1.5 py-0.5 rounded border text-xs font-mono"
                style={{ borderColor: `${C.soft}55`, background: `${C.deep}88` }}
                title="Press slash to focus search on big sites—here it is just a demo hint"
              >
                /
              </kbd>{' '}
              focuses search in many apps—here, click the search box.
            </p>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: `${C.mid}44` }}>
            <h3 className="font-barlow uppercase text-xs font-bold m-0 mb-3" style={{ color: C.soft }}>
              Date fields (split)
            </h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold" style={{ color: C.soft }}>
                  Day
                </label>
                <input type="number" min={1} max={31} defaultValue={15} className="w-full mt-1 rounded px-2 py-1 text-sm border" style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold" style={{ color: C.soft }}>
                  Month
                </label>
                <input type="number" min={1} max={12} defaultValue={4} className="w-full mt-1 rounded px-2 py-1 text-sm border" style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase font-bold" style={{ color: C.soft }}>
                  Year
                </label>
                <input type="number" min={2020} max={2030} defaultValue={2026} className="w-full mt-1 rounded px-2 py-1 text-sm border" style={{ background: C.ink, borderColor: `${C.mid}66`, color: '#fff' }} />
              </div>
            </div>
          </div>
        </aside>
      </section>

      <footer className="border-t mt-12 py-10" style={{ borderColor: `${C.mid}44`, background: `${C.ink}ee` }}>
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-bebas-neue font-black text-xl uppercase" style={{ color: C.gold }}>
              LaughTube
            </div>
            <p className="text-sm m-0 mt-2" style={{ color: C.soft }}>
              A Sahara experiment: same open videos, kinder chrome.
            </p>
          </div>
          <ul className="flex flex-wrap gap-4 list-none m-0 p-0 text-sm" style={{ color: C.soft }}>
            <li>
              <a href="https://www.youtube.com/kids" className="no-underline hover:underline" style={{ color: C.soft }} target="_blank" rel="noreferrer">
                YouTube Kids
              </a>
            </li>
            <li>
              <Link href="/" className="no-underline hover:underline" style={{ color: C.soft }}>
                Sahara home
              </Link>
            </li>
          </ul>
        </div>
      </footer>

      {drawerOpen && (
        <div className="fixed inset-0 z-[150]">
          <button type="button" className="absolute inset-0 bg-black/50 border-0 w-full h-full cursor-pointer" aria-label="Close queue" onClick={() => setDrawerOpen(false)} />
          <aside
            className="absolute top-0 right-0 h-full w-full max-w-md shadow-2xl border-l flex flex-col animate-in slide-in-from-right"
            style={{ background: C.ink, borderColor: `${C.mid}66` }}
            role="dialog"
            aria-label="Watch queue"
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: `${C.mid}44` }}>
              <h2 className="m-0 font-['Barlow_Condensed'] text-lg uppercase">Your queue</h2>
              <button type="button" className="p-2 rounded-lg border-0 cursor-pointer" style={{ background: `${C.deep}88` }} onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <ol className="flex-1 overflow-auto m-0 p-4 list-decimal list-inside text-sm space-y-2" style={{ color: C.soft }}>
              {LIBRARY.slice(0, 5).map((v) => (
                <li key={v.id}>
                  <a href={ytWatch(v.id)} target="_blank" rel="noreferrer" className="text-white no-underline hover:underline">
                    {v.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[160] grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-black/60 border-0 cursor-pointer" aria-label="Close" onClick={() => setModalOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{ background: C.deep, borderColor: `${C.gold}55` }}
          >
            <h2 id="modal-title" className="m-0 font-['Barlow_Condensed'] text-xl uppercase" style={{ color: C.gold }}>
              Watch later
            </h2>
            <p className="text-sm mt-2" style={{ color: C.soft }}>
              This modal is a demo—your list lives in your head until we wire real accounts.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: `${C.mid}44`, color: '#fff' }} onClick={() => setModalOpen(false)}>
                Close
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ background: C.gold, color: C.ink }}
                onClick={() => {
                  setModalOpen(false);
                  showToast('Saved to imaginary watch later');
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

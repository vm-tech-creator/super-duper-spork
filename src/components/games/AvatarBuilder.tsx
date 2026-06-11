'use client';

import { useEffect, useMemo, useState } from 'react';
import { SAND_DOLLARS_KEY, getSandDollars, spendSandDollars } from '@/utils/sandDollars';

type AvatarCategory = 'hairstyles' | 'characters' | 'tShirts' | 'shoes' | 'auras' | 'pants' | 'accessory';

interface AvatarItem {
  id: string;
  name: string;
  category: AvatarCategory;
  price: number;
  palette: string;
  summerOffer?: boolean;
}

interface AvatarState {
  equipped: Record<AvatarCategory, string>;
  owned: Record<AvatarCategory, string[]>;
}

const AVATAR_STORAGE_KEY = 'saharaAvatarBuilderV1';
const SUMMER_DISCOUNT = 0.35;
const SUMMER_OFFER_END = 'August 31, 2026';

const CATEGORIES: AvatarCategory[] = [
  'hairstyles',
  'characters',
  'tShirts',
  'shoes',
  'auras',
  'pants',
  'accessory',
];

const CATEGORY_LABELS: Record<AvatarCategory, string> = {
  hairstyles: 'Hairstyles',
  characters: 'Characters',
  tShirts: 'T-Shirts',
  shoes: 'Shoes',
  auras: 'Auras',
  pants: 'Pants',
  accessory: 'Accessory',
};

const SHOP_ITEMS: Record<AvatarCategory, AvatarItem[]> = {
  hairstyles: [
    { id: 'hair-starter', name: 'Starter Fade', category: 'hairstyles', price: 0, palette: '#8b5a2b' },
    { id: 'hair-beach-waves', name: 'Beach Waves', category: 'hairstyles', price: 140, palette: '#c99755', summerOffer: true },
    { id: 'hair-surf-mohawk', name: 'Surf Mohawk', category: 'hairstyles', price: 260, palette: '#f59e0b' },
    { id: 'hair-sunset-bob', name: 'Sunset Bob', category: 'hairstyles', price: 220, palette: '#fb7185', summerOffer: true },
  ],
  characters: [
    { id: 'character-starter', name: 'Rookie Rider', category: 'characters', price: 0, palette: '#60a5fa' },
    { id: 'character-sand-explorer', name: 'Sand Explorer', category: 'characters', price: 280, palette: '#fbbf24' },
    { id: 'character-tide-ranger', name: 'Tide Ranger', category: 'characters', price: 360, palette: '#38bdf8', summerOffer: true },
    { id: 'character-coral-captain', name: 'Coral Captain', category: 'characters', price: 420, palette: '#fb7185' },
    { id: 'character-wizard-legend', name: 'Wizard School Legend', category: 'characters', price: 520, palette: '#7f1d1d', summerOffer: true },
    { id: 'character-sea-demigod', name: 'Sea Demigod', category: 'characters', price: 520, palette: '#2563eb', summerOffer: true },
    { id: 'character-web-swinger', name: 'Web Swinger', category: 'characters', price: 560, palette: '#dc2626' },
    { id: 'character-galaxy-princess', name: 'Galaxy Princess', category: 'characters', price: 560, palette: '#f8fafc' },
    { id: 'character-ring-quester', name: 'Ring Quester', category: 'characters', price: 500, palette: '#22c55e' },
    { id: 'character-night-detective', name: 'Night Detective', category: 'characters', price: 620, palette: '#111827' },
  ],
  tShirts: [
    { id: 'tee-starter', name: 'Starter Tee', category: 'tShirts', price: 0, palette: '#e2e8f0' },
    { id: 'tee-palm-stripe', name: 'Palm Stripe Tee', category: 'tShirts', price: 90, palette: '#84cc16', summerOffer: true },
    { id: 'tee-sunburst', name: 'Sunburst Tee', category: 'tShirts', price: 140, palette: '#f97316' },
    { id: 'tee-lagoon-tank', name: 'Lagoon Tank', category: 'tShirts', price: 180, palette: '#06b6d4' },
  ],
  shoes: [
    { id: 'shoes-starter', name: 'Starter Sneakers', category: 'shoes', price: 0, palette: '#cbd5e1' },
    { id: 'shoes-drift-sandals', name: 'Drift Sandals', category: 'shoes', price: 120, palette: '#fde68a', summerOffer: true },
    { id: 'shoes-tide-runners', name: 'Tide Runners', category: 'shoes', price: 190, palette: '#60a5fa' },
    { id: 'shoes-boardwalk-boots', name: 'Boardwalk Boots', category: 'shoes', price: 250, palette: '#7c3aed' },
  ],
  auras: [
    { id: 'aura-starter', name: 'Starter Glow', category: 'auras', price: 0, palette: '#f8fafc' },
    { id: 'aura-sea-mist', name: 'Sea Mist Aura', category: 'auras', price: 220, palette: '#67e8f9', summerOffer: true },
    { id: 'aura-sunflare', name: 'Sunflare Aura', category: 'auras', price: 320, palette: '#facc15' },
    { id: 'aura-golden-dusk', name: 'Golden Dusk Aura', category: 'auras', price: 380, palette: '#fb923c' },
  ],
  pants: [
    { id: 'pants-starter', name: 'Starter Joggers', category: 'pants', price: 0, palette: '#94a3b8' },
    { id: 'pants-board-shorts', name: 'Board Shorts', category: 'pants', price: 110, palette: '#22d3ee', summerOffer: true },
    { id: 'pants-dune-jeans', name: 'Dune Jeans', category: 'pants', price: 170, palette: '#3b82f6' },
    { id: 'pants-wave-tracks', name: 'Wave Tracks', category: 'pants', price: 230, palette: '#34d399' },
  ],
  accessory: [
    { id: 'accessory-starter', name: 'Starter Band', category: 'accessory', price: 0, palette: '#e5e7eb' },
    { id: 'accessory-shell-bracelet', name: 'Shell Bracelet', category: 'accessory', price: 85, palette: '#f9a8d4', summerOffer: true },
    { id: 'accessory-star-shades', name: 'Star Shades', category: 'accessory', price: 160, palette: '#f43f5e' },
    { id: 'accessory-beach-pack', name: 'Beach Pack', category: 'accessory', price: 210, palette: '#fb7185' },
  ],
};

const createDefaultAvatarState = (): AvatarState => ({
  equipped: CATEGORIES.reduce((acc, category) => {
    acc[category] = SHOP_ITEMS[category][0].id;
    return acc;
  }, {} as Record<AvatarCategory, string>),
  owned: CATEGORIES.reduce((acc, category) => {
    acc[category] = [SHOP_ITEMS[category][0].id];
    return acc;
  }, {} as Record<AvatarCategory, string[]>),
});

const getItemPrice = (item: AvatarItem): number => {
  if (!item.summerOffer || item.price === 0) return item.price;
  return Math.max(1, Math.floor(item.price * (1 - SUMMER_DISCOUNT)));
};

const loadAvatarState = (): AvatarState => {
  if (typeof window === 'undefined') return createDefaultAvatarState();

  const defaults = createDefaultAvatarState();
  const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as Partial<AvatarState>;

    const equipped = CATEGORIES.reduce((acc, category) => {
      const candidate = parsed.equipped?.[category];
      const valid = candidate && SHOP_ITEMS[category].some((item) => item.id === candidate);
      acc[category] = valid ? candidate : defaults.equipped[category];
      return acc;
    }, {} as Record<AvatarCategory, string>);

    const owned = CATEGORIES.reduce((acc, category) => {
      const inputOwned = parsed.owned?.[category] ?? [];
      const validOwned = inputOwned.filter(
        (itemId): itemId is string =>
          typeof itemId === 'string' && SHOP_ITEMS[category].some((item) => item.id === itemId),
      );
      acc[category] = Array.from(new Set([defaults.equipped[category], ...validOwned]));
      return acc;
    }, {} as Record<AvatarCategory, string[]>);

    CATEGORIES.forEach((category) => {
      if (!owned[category].includes(equipped[category])) {
        owned[category] = [...owned[category], equipped[category]];
      }
    });

    return { equipped, owned };
  } catch {
    return defaults;
  }
};

const getEquippedItem = (avatar: AvatarState, category: AvatarCategory): AvatarItem => {
  return (
    SHOP_ITEMS[category].find((item) => item.id === avatar.equipped[category]) ??
    SHOP_ITEMS[category][0]
  );
};

function AvatarPreview({
  equipped,
  pose,
}: {
  equipped: Record<AvatarCategory, AvatarItem>;
  pose: number;
}) {
  const poseStep = pose % 4;
  const poseX = [-2, 2, 0, -1][poseStep];
  const poseY = [0, -3, 2, -1][poseStep];
  const armLift = [0, -9, 5, -4][poseStep];
  const skinTone =
    equipped.characters.id === 'character-sand-explorer'
      ? '#c88752'
      : equipped.characters.id === 'character-tide-ranger'
      ? '#9f6a43'
      : equipped.characters.id === 'character-coral-captain'
      ? '#d59a6f'
      : equipped.characters.id === 'character-galaxy-princess'
      ? '#c98f6b'
      : equipped.characters.id === 'character-ring-quester'
      ? '#e0a879'
      : '#b97a56';

  const renderHair = () => {
    if (equipped.hairstyles.id === 'hair-beach-waves') {
      return (
        <path
          d="M70 82 C72 49 103 37 129 45 C155 53 169 70 165 101 C150 90 133 88 114 91 C95 94 82 91 70 82 Z"
          fill={equipped.hairstyles.palette}
        />
      );
    }

    if (equipped.hairstyles.id === 'hair-surf-mohawk') {
      return (
        <>
          <path d="M88 76 C92 56 108 44 121 44 C139 44 154 57 157 80 C140 73 108 72 88 76 Z" fill="#2f1f1a" />
          <path d="M111 45 L123 17 L136 45 L131 82 L116 82 Z" fill={equipped.hairstyles.palette} />
        </>
      );
    }

    if (equipped.hairstyles.id === 'hair-sunset-bob') {
      return (
        <path
          d="M67 83 C67 52 92 35 121 35 C153 35 174 58 171 93 C169 121 155 134 145 138 L138 92 C122 86 101 87 83 94 L75 138 C65 127 62 105 67 83 Z"
          fill={equipped.hairstyles.palette}
        />
      );
    }

    return (
      <path
        d="M76 82 C82 55 102 43 128 47 C151 51 162 67 164 86 C138 77 106 76 76 82 Z"
        fill={equipped.hairstyles.palette}
      />
    );
  };

  const renderAccessory = () => {
    if (equipped.accessory.id === 'accessory-star-shades') {
      return (
        <>
          <rect x="90" y="93" width="24" height="13" rx="5" fill="#111827" />
          <rect x="126" y="93" width="24" height="13" rx="5" fill="#111827" />
          <path d="M114 99 C119 96 122 96 126 99" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
          <path d="M95 91 L99 84 L103 91 L111 92 L105 97 L107 105 L99 101 L92 105 L94 97 L88 92 Z" fill={equipped.accessory.palette} />
        </>
      );
    }

    if (equipped.accessory.id === 'accessory-shell-bracelet') {
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={66 + i * 5} cy={158 + i} r="3" fill={i % 2 ? '#fff7ed' : equipped.accessory.palette} />
          ))}
        </g>
      );
    }

    if (equipped.accessory.id === 'accessory-beach-pack') {
      return (
        <>
          <rect x="55" y="119" width="34" height="58" rx="12" fill={equipped.accessory.palette} opacity="0.9" />
          <path d="M88 129 C101 138 106 151 105 170" stroke="#132033" strokeWidth="7" strokeLinecap="round" />
        </>
      );
    }

    return <path d="M91 86 C105 80 137 80 152 86" stroke={equipped.accessory.palette} strokeWidth="6" strokeLinecap="round" />;
  };

  const renderCharacterBackLayer = () => {
    if (equipped.characters.id === 'character-wizard-legend') {
      return <path d="M73 126 C62 159 63 207 84 257 L156 257 C177 205 178 158 166 126 Z" fill="#16111f" />;
    }

    if (equipped.characters.id === 'character-ring-quester') {
      return <path d="M68 127 C53 159 55 218 82 264 L158 264 C181 214 183 158 170 127 Z" fill="#14532d" />;
    }

    if (equipped.characters.id === 'character-night-detective') {
      return <path d="M64 124 C40 161 43 219 79 267 L161 267 C198 219 201 161 176 124 Z" fill="#030712" />;
    }

    if (equipped.characters.id === 'character-galaxy-princess') {
      return <path d="M73 139 C89 127 151 127 167 139 L155 205 L85 205 Z" fill="#7c3aed" opacity="0.82" />;
    }

    return null;
  };

  const renderCharacterDetails = () => {
    if (equipped.characters.id === 'character-wizard-legend') {
      return (
        <>
          <path d="M92 128 L120 158 L148 128 L161 194 L79 194 Z" fill={equipped.characters.palette} opacity="0.92" />
          <path d="M117 137 L123 137 L123 192 L117 192 Z" fill="#facc15" />
          <path d="M171 143 L199 109" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />
          <circle cx="202" cy="105" r="5" fill="#facc15" />
        </>
      );
    }

    if (equipped.characters.id === 'character-sea-demigod') {
      return (
        <>
          <path d="M84 128 L156 128 L168 193 L72 193 Z" fill={equipped.characters.palette} opacity="0.9" />
          <path d="M91 159 C104 147 117 172 130 159 C143 147 154 170 166 158" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M120 134 L128 150 L120 168 L112 150 Z" fill="#bfdbfe" />
        </>
      );
    }

    if (equipped.characters.id === 'character-web-swinger') {
      return (
        <>
          <path d="M84 126 L156 126 L169 193 L72 193 Z" fill={equipped.characters.palette} />
          <path d="M92 143 C111 154 132 154 151 143" stroke="#111827" strokeWidth="4" fill="none" />
          <path d="M96 128 L120 193 L145 128 M83 164 L158 164" stroke="#111827" strokeWidth="3" opacity="0.75" />
        </>
      );
    }

    if (equipped.characters.id === 'character-galaxy-princess') {
      return (
        <>
          <path d="M88 127 L152 127 L165 193 L75 193 Z" fill="#fff7ed" opacity="0.95" />
          <path d="M96 149 L120 133 L144 149 L137 192 L103 192 Z" fill={equipped.characters.palette} />
          <path d="M105 78 L114 62 L123 78 L140 80 L127 91 L132 108 L114 99 L97 108 L102 91 L89 80 Z" fill="#facc15" />
        </>
      );
    }

    if (equipped.characters.id === 'character-ring-quester') {
      return (
        <>
          <path d="M90 126 L150 126 L164 193 L76 193 Z" fill="#fef3c7" />
          <path d="M101 135 C113 145 127 145 139 135" stroke={equipped.characters.palette} strokeWidth="7" strokeLinecap="round" />
          <circle cx="120" cy="158" r="10" fill="none" stroke="#facc15" strokeWidth="5" />
        </>
      );
    }

    if (equipped.characters.id === 'character-night-detective') {
      return (
        <>
          <path d="M86 127 L154 127 L168 193 L72 193 Z" fill="#111827" />
          <path d="M99 132 L120 154 L141 132" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
          <path d="M91 88 C103 82 137 82 149 88 L144 102 L96 102 Z" fill="#030712" opacity="0.92" />
        </>
      );
    }

    return (
      <circle
        cx="120"
        cy="158"
        r="13"
        fill={equipped.characters.palette}
        stroke="rgba(255,255,255,.34)"
        strokeWidth="4"
      />
    );
  };

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[rgba(255,193,5,.28)] bg-[#0e1a2c] shadow-inner transition-transform duration-300">
      <svg role="img" aria-label="Current avatar preview" viewBox="0 0 240 300" className="h-full w-full">
        <defs>
          <radialGradient id="avatarAura" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={equipped.auras.palette} stopOpacity="0.72" />
            <stop offset="58%" stopColor={equipped.auras.palette} stopOpacity="0.18" />
            <stop offset="100%" stopColor={equipped.auras.palette} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="avatarGround" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#13324a" />
            <stop offset="48%" stopColor="#0f2437" />
            <stop offset="100%" stopColor="#201a2f" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect width="240" height="300" fill="url(#avatarGround)" />
        <circle cx="120" cy="128" r="103" fill="url(#avatarAura)" />
        <path d="M19 229 C63 211 94 223 121 211 C154 197 187 206 221 191 L221 300 L19 300 Z" fill="#0a1525" opacity="0.52" />
        <path d="M38 240 C78 226 101 238 129 225 C160 211 188 218 212 205" stroke={equipped.auras.palette} strokeWidth="4" strokeLinecap="round" opacity="0.42" />

        <g filter="url(#softShadow)" transform={`translate(${poseX} ${poseY})`}>
          {equipped.accessory.id === 'accessory-beach-pack' && renderAccessory()}
          {renderCharacterBackLayer()}

          <path d={`M82 130 C71 ${135 + armLift} 61 ${149 + armLift} 57 ${166 + armLift}`} stroke={skinTone} strokeWidth="17" strokeLinecap="round" />
          <path d={`M158 130 C169 ${136 + armLift} 177 ${150 + armLift} 181 ${168 + armLift}`} stroke={skinTone} strokeWidth="17" strokeLinecap="round" />
          <path d="M84 126 L156 126 L169 193 L72 193 Z" fill={equipped.tShirts.palette} />
          <path d="M94 124 L120 149 L146 124" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="5" strokeLinecap="round" />
          {renderCharacterDetails()}

          <path d="M83 192 L114 192 L109 255 L78 255 Z" fill={equipped.pants.palette} />
          <path d="M126 192 L157 192 L163 255 L132 255 Z" fill={equipped.pants.palette} />
          <rect x="69" y="247" width="47" height="17" rx="8" fill={equipped.shoes.palette} />
          <rect x="126" y="247" width="47" height="17" rx="8" fill={equipped.shoes.palette} />

          <rect x="104" y="112" width="32" height="24" rx="10" fill={skinTone} />
          <circle cx="120" cy="91" r="45" fill={skinTone} />
          {renderHair()}
          <circle cx="105" cy="98" r="4" fill="#172033" />
          <circle cx="135" cy="98" r="4" fill="#172033" />
          <path d="M109 116 C118 122 129 122 137 116" stroke="#7c3f31" strokeWidth="4" strokeLinecap="round" fill="none" />

          {equipped.accessory.id !== 'accessory-beach-pack' && renderAccessory()}
        </g>

        <rect x="14" y="14" width="212" height="272" rx="18" fill="none" stroke="rgba(255,255,255,.08)" />
      </svg>
    </div>
  );
}

export default function AvatarBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>('hairstyles');
  const [avatar, setAvatar] = useState<AvatarState>(() => createDefaultAvatarState());
  const [sandDollars, setSandDollars] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const [previewPose, setPreviewPose] = useState(0);

  const equippedByCategory = useMemo(
    () =>
      CATEGORIES.reduce((acc, category) => {
        acc[category] = getEquippedItem(avatar, category);
        return acc;
      }, {} as Record<AvatarCategory, AvatarItem>),
    [avatar],
  );

  const equippedItems = useMemo(
    () => CATEGORIES.map((category) => equippedByCategory[category]),
    [equippedByCategory],
  );

  useEffect(() => {
    setAvatar(loadAvatarState());
    setSandDollars(getSandDollars());
    setHasLoadedState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedState) return;
    if (typeof window === 'undefined') return;
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
  }, [avatar, hasLoadedState]);

  useEffect(() => {
    const syncBalance = () => setSandDollars(getSandDollars());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === SAND_DOLLARS_KEY) {
        syncBalance();
      }
    };

    window.addEventListener('sand-dollars-updated', syncBalance as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('sand-dollars-updated', syncBalance as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleItemAction = (item: AvatarItem) => {
    const isOwned = avatar.owned[item.category].includes(item.id);

    if (isOwned) {
      if (avatar.equipped[item.category] === item.id) {
        setNotice(`${item.name} is already equipped.`);
        return;
      }

      setAvatar({
        ...avatar,
        equipped: {
          ...avatar.equipped,
          [item.category]: item.id,
        },
      });
      setPreviewPose((current) => current + 1);
      setNotice(`Equipped ${item.name}.`);
      return;
    }

    const price = getItemPrice(item);
    const didSpend = spendSandDollars(price);

    if (!didSpend) {
      setNotice(`Not enough Sand Dollars. You need ${price}.`);
      return;
    }

    const nextAvatar: AvatarState = {
      equipped: {
        ...avatar.equipped,
        [item.category]: item.id,
      },
      owned: {
        ...avatar.owned,
        [item.category]: [...avatar.owned[item.category], item.id],
      },
    };

    setAvatar(nextAvatar);
    setPreviewPose((current) => current + 1);
    setSandDollars(getSandDollars());
    window.dispatchEvent(new Event('sand-dollars-updated'));
    setNotice(`Purchased ${item.name} for ${price} Sand Dollars.`);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="rounded-xl border border-[rgba(255,193,5,.35)] bg-[rgba(8,15,28,.88)] px-4 py-2 text-sm font-semibold text-[#ffc105]">
          Sand Dollars: {sandDollars}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative rounded-xl border border-[rgba(255,193,5,.45)] bg-gradient-to-r from-[#ffc105] to-[#ffcf3a] px-5 py-2.5 font-['Barlow_Condensed'] text-sm font-black uppercase tracking-[.08em] text-[#0a0f18] transition-all hover:translate-y-[-1px] hover:shadow-[0_8px_24px_rgba(255,193,5,.35)]"
        >
          Avatar Builder
          <span className="absolute -right-2 -top-2 rounded-full bg-[#ff6d3d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-white">
            Summer Offer
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[130] overflow-y-auto bg-[rgba(2,6,23,.82)] p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Avatar Builder"
            className="mx-auto mt-10 mb-8 max-w-6xl rounded-2xl border border-[rgba(255,193,5,.25)] bg-[#070e1b] shadow-[0_28px_80px_rgba(0,0,0,.55)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[rgba(73,122,182,.25)] px-6 py-5">
              <div>
                <h2 className="font-['Barlow_Condensed'] text-3xl font-black uppercase tracking-[.04em] text-[#e8edf5]">
                  Avatar Builder
                </h2>
                <p className="text-sm text-[#8ca6c8]">
                  Spend Sand Dollars from games to unlock your summer style.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-[rgba(73,122,182,.35)] px-3 py-1.5 text-sm font-semibold text-[#8ca6c8] transition-colors hover:border-[#ffc105] hover:text-[#ffc105]"
              >
                Close
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-[rgba(255,193,5,.4)] bg-gradient-to-r from-[rgba(255,193,5,.2)] via-[rgba(255,139,61,.15)] to-[rgba(73,122,182,.2)] p-4">
                <p className="font-['Barlow_Condensed'] text-xl font-black uppercase tracking-[.05em] text-[#ffe19a]">
                  Summer Splash Offer
                </p>
                <p className="text-sm text-[#d6e4f7]">
                  Save {Math.round(SUMMER_DISCOUNT * 100)}% on tagged items through {SUMMER_OFFER_END}.
                </p>
              </div>

              {notice && (
                <div className="rounded-lg border border-[rgba(255,193,5,.35)] bg-[rgba(255,193,5,.12)] px-4 py-2 text-sm font-semibold text-[#ffe19a]">
                  {notice}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                <aside className="space-y-4 rounded-xl border border-[rgba(73,122,182,.25)] bg-[rgba(8,15,28,.9)] p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-['Barlow_Condensed'] text-xl font-black uppercase tracking-[.04em] text-[#ffc105]">
                      Current Loadout
                    </h3>
                    <span className="rounded-md bg-[rgba(255,193,5,.18)] px-2 py-1 text-xs font-bold uppercase tracking-[.08em] text-[#ffe19a]">
                      {sandDollars} SD
                    </span>
                  </div>

                  <AvatarPreview equipped={equippedByCategory} pose={previewPose} />

                  <div className="space-y-2">
                    {equippedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-[rgba(73,122,182,.25)] bg-[rgba(13,23,39,.9)] px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.palette }}
                          />
                          <span className="text-sm font-semibold text-[#dce7f7]">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[.08em] text-[#7fa0ca]">
                          {CATEGORY_LABELS[item.category]}
                        </span>
                      </div>
                    ))}
                  </div>
                </aside>

                <section className="space-y-4 rounded-xl border border-[rgba(73,122,182,.25)] bg-[rgba(8,15,28,.9)] p-4">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <button
                        type="button"
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-[.08em] transition-all ${
                          selectedCategory === category
                            ? 'border-[#ffc105] bg-[rgba(255,193,5,.2)] text-[#ffe19a]'
                            : 'border-[rgba(73,122,182,.35)] bg-[rgba(73,122,182,.12)] text-[#8ca6c8] hover:border-[#ffc105] hover:text-[#ffc105]'
                        }`}
                      >
                        {CATEGORY_LABELS[category]}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {SHOP_ITEMS[selectedCategory].map((item) => {
                      const discountedPrice = getItemPrice(item);
                      const isOwned = avatar.owned[item.category].includes(item.id);
                      const isEquipped = avatar.equipped[item.category] === item.id;
                      const canAfford = sandDollars >= discountedPrice;

                      return (
                        <div
                          key={item.id}
                          className="rounded-lg border border-[rgba(73,122,182,.3)] bg-[rgba(12,20,36,.85)] p-3"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-3.5 w-3.5 rounded-full"
                                  style={{ backgroundColor: item.palette }}
                                />
                                <p className="text-sm font-bold text-[#e7f0fc]">{item.name}</p>
                              </div>
                              <p className="text-xs text-[#7fa0ca]">{CATEGORY_LABELS[item.category]}</p>
                            </div>

                            {item.summerOffer && item.price > 0 && (
                              <span className="rounded-full bg-[#ff6d3d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.08em] text-white">
                                Summer
                              </span>
                            )}
                          </div>

                          <div className="mb-3 text-sm font-semibold text-[#ffc105]">
                            {item.price === 0 ? (
                              <span>Free</span>
                            ) : item.summerOffer ? (
                              <div className="flex items-center gap-2">
                                <span>{discountedPrice} SD</span>
                                <span className="text-xs text-[#7fa0ca] line-through">{item.price} SD</span>
                              </div>
                            ) : (
                              <span>{item.price} SD</span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={isEquipped || (!isOwned && !canAfford)}
                            onClick={() => handleItemAction(item)}
                            className={`w-full rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[.08em] transition-all ${
                              isEquipped
                                ? 'cursor-not-allowed border border-[rgba(73,122,182,.3)] bg-[rgba(73,122,182,.14)] text-[#7fa0ca]'
                                : isOwned
                                ? 'border border-[rgba(255,193,5,.45)] bg-[rgba(255,193,5,.18)] text-[#ffe19a] hover:bg-[rgba(255,193,5,.24)]'
                                : canAfford
                                ? 'bg-gradient-to-r from-[#ffc105] to-[#ffcf3a] text-[#0a0f18] hover:shadow-[0_8px_20px_rgba(255,193,5,.32)]'
                                : 'cursor-not-allowed border border-[rgba(220,38,38,.45)] bg-[rgba(220,38,38,.12)] text-[#fda4af]'
                            }`}
                          >
                            {isEquipped
                              ? 'Equipped'
                              : isOwned
                              ? 'Equip'
                              : `Buy for ${discountedPrice} SD`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

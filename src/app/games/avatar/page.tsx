'use client';

import { useState, useEffect } from 'react';
import { getSandDollars, spendSandDollars } from '@/utils/sandDollars';
import SiteHeader from '@/components/SiteHeader';

// Avatar data
const AVATAR_ITEMS = {
  hair: [
    { id: 'hair1', name: 'Short Brown', price: 0, image: '👨‍🦰' },
    { id: 'hair2', name: 'Long Blonde', price: 50, image: '👩‍🦱' },
    { id: 'hair3', name: 'Curly Black', price: 75, image: '👨‍🦱' },
    { id: 'hair4', name: 'Bald', price: 25, image: '👨‍🦲' },
    { id: 'hair5', name: 'Rainbow Afro', price: 150, image: '👨‍🦳' },
  ],
  head: [
    { id: 'head1', name: 'Baseball Cap', price: 100, image: '🧢' },
    { id: 'head2', name: 'Crown', price: 500, image: '👑' },
    { id: 'head3', name: 'Santa Hat', price: 200, image: '🎅' },
    { id: 'head4', name: 'Graduation Cap', price: 150, image: '🎓' },
    { id: 'head5', name: 'Party Hat', price: 50, image: '🎉' },
  ],
  skin: [
    { id: 'skin1', name: 'Light', price: 0, image: '🏻' },
    { id: 'skin2', name: 'Medium', price: 0, image: '🏼' },
    { id: 'skin3', name: 'Medium Dark', price: 0, image: '🏽' },
    { id: 'skin4', name: 'Dark', price: 0, image: '🏾' },
    { id: 'skin5', name: 'Deep Dark', price: 0, image: '🏿' },
  ],
  pants: [
    { id: 'pants1', name: 'Blue Jeans', price: 0, image: '👖' },
    { id: 'pants2', name: 'Black Pants', price: 25, image: '👖' },
    { id: 'pants3', name: 'Cargo Shorts', price: 75, image: '🩳' },
    { id: 'pants4', name: 'Designer Jeans', price: 200, image: '👖' },
    { id: 'pants5', name: 'Superhero Cape', price: 300, image: '🦸' },
  ],
  shoes: [
    { id: 'shoes1', name: 'Sneakers', price: 0, image: '👟' },
    { id: 'shoes2', name: 'Boots', price: 50, image: '👢' },
    { id: 'shoes3', name: 'Sandals', price: 25, image: '🩴' },
    { id: 'shoes4', name: 'High Heels', price: 100, image: '👠' },
    { id: 'shoes5', name: 'Rocket Boots', price: 400, image: '🚀' },
  ],
  accessories: [
    { id: 'acc1', name: 'Sunglasses', price: 75, image: '🕶️' },
    { id: 'acc2', name: 'Watch', price: 150, image: '⌚' },
    { id: 'acc3', name: 'Necklace', price: 100, image: '📿' },
    { id: 'acc4', name: 'Backpack', price: 125, image: '🎒' },
    { id: 'acc5', name: 'Jetpack', price: 500, image: '🛸' },
  ],
};

const SUMMER_DEALS = [
  {
    id: 'deal1',
    name: 'Harry Potter',
    price: 250,
    image: '🧙‍♂️',
    description: 'Wizard robes and glasses',
    preset: {
      hair: 'hair3',
      head: 'head2',
      skin: 'skin2',
      pants: 'pants4',
      shoes: 'shoes2',
      accessories: 'acc1',
    },
  },
  {
    id: 'deal2',
    name: 'Elon Musk',
    price: 300,
    image: '🚀',
    description: 'SpaceX jumpsuit',
    preset: {
      hair: 'hair4',
      head: 'head1',
      skin: 'skin1',
      pants: 'pants4',
      shoes: 'shoes1',
      accessories: 'acc5',
    },
  },
  {
    id: 'deal3',
    name: 'Super Mario',
    price: 275,
    image: '🍄',
    description: 'Red hat and mustache',
    preset: {
      hair: 'hair1',
      head: 'head5',
      skin: 'skin1',
      pants: 'pants4',
      shoes: 'shoes1',
      accessories: 'acc2',
    },
  },
  {
    id: 'deal4',
    name: 'Wonder Woman',
    price: 350,
    image: '🦸‍♀️',
    description: 'Hero costume',
    preset: {
      hair: 'hair2',
      head: 'head5',
      skin: 'skin3',
      pants: 'pants4',
      shoes: 'shoes3',
      accessories: 'acc3',
    },
  },
  {
    id: 'deal5',
    name: 'Iron Man',
    price: 400,
    image: '🤖',
    description: 'Powered armor suit',
    preset: {
      hair: 'hair4',
      head: 'head1',
      skin: 'skin4',
      pants: 'pants4',
      shoes: 'shoes5',
      accessories: 'acc5',
    },
  },
  {
    id: 'deal6',
    name: 'Batman',
    price: 325,
    image: '🦇',
    description: 'Dark knight outfit',
    preset: {
      hair: 'hair4',
      head: 'head1',
      skin: 'skin4',
      pants: 'pants4',
      shoes: 'shoes2',
      accessories: 'acc4',
    },
  },
];

export default function AvatarPage() {
  const [sandDollars, setSandDollars] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState('hair');
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({
    hair: 'hair1',
    head: '',
    skin: 'skin1',
    pants: 'pants1',
    shoes: 'shoes1',
    accessories: '',
  });

  useEffect(() => {
    setSandDollars(getSandDollars());
  }, []);

  const purchaseItem = (item: any, category?: string) => {
    if (spendSandDollars(item.price)) {
      setSandDollars(getSandDollars());

      if (category === 'summer-deals' && item.preset) {
        setSelectedItems((prev) => ({
          ...prev,
          ...item.preset,
        }));
      } else if (category && category !== 'summer-deals') {
        setSelectedItems((prev) => ({
          ...prev,
          [category]: item.id,
        }));
      }

      // In a real app, you'd save purchased items
      alert(`Purchased ${item.name} for ${item.price} Sand Dollars!`);
    } else {
      alert('Not enough Sand Dollars!');
    }
  };

  const selectItem = (category: string, itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: itemId
    }));
  };

  const renderAvatar = () => {
    const skin = AVATAR_ITEMS.skin.find(s => s.id === selectedItems.skin);
    const hair = selectedItems.hair ? AVATAR_ITEMS.hair.find(h => h.id === selectedItems.hair) : null;
    const head = selectedItems.head ? AVATAR_ITEMS.head.find(h => h.id === selectedItems.head) : null;
    const pants = AVATAR_ITEMS.pants.find(p => p.id === selectedItems.pants);
    const shoes = AVATAR_ITEMS.shoes.find(s => s.id === selectedItems.shoes);
    const accessories = selectedItems.accessories ? AVATAR_ITEMS.accessories.find(a => a.id === selectedItems.accessories) : null;

    // Skin tone colors
    const skinColors = {
      'skin1': '#fdbcb4', // Light
      'skin2': '#e0ac69', // Medium
      'skin3': '#c68642', // Medium Dark
      'skin4': '#8d5524', // Dark
      'skin5': '#61412a', // Deep Dark
    };

    const skinColor = skinColors[selectedItems.skin as keyof typeof skinColors] || '#fdbcb4';

    return (
      <div className="relative w-48 h-72 mx-auto">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-green-100 to-green-200 rounded-lg shadow-lg border-2 border-white/50"></div>

        {/* Body - Torso */}
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-20 h-28 rounded-t-2xl"
          style={{ backgroundColor: skinColor }}
        ></div>

        {/* Shirt */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-blue-500 rounded-t-xl shadow-sm border-t border-blue-400">
          {/* Shirt collar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-blue-600 rounded-t-lg border border-blue-700"></div>
          {/* Shirt details */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-600 rounded-full"></div>
        </div>

        {/* Pants */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gray-700 rounded-b-xl shadow-sm">
          {/* Pant crease */}
          <div className="absolute left-1/2 top-2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-800"></div>
        </div>

        {/* Shoes */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-lg shadow-sm">
          {/* Shoe laces */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-white rounded-full"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-white rounded-full"></div>
        </div>

        {/* Arms */}
        <div
          className="absolute bottom-24 left-6 w-5 h-20 rounded-full shadow-sm"
          style={{ backgroundColor: skinColor }}
        ></div>
        <div
          className="absolute bottom-24 right-6 w-5 h-20 rounded-full shadow-sm"
          style={{ backgroundColor: skinColor }}
        ></div>

        {/* Hands */}
        <div
          className="absolute bottom-6 left-4 w-6 h-6 rounded-full"
          style={{ backgroundColor: skinColor }}
        ></div>
        <div
          className="absolute bottom-6 right-4 w-6 h-6 rounded-full"
          style={{ backgroundColor: skinColor }}
        ></div>

        {/* Head */}
        <div
          className="absolute top-6 left-1/2 transform -translate-x-1/2 w-18 h-18 rounded-full shadow-md border-2 border-white/30"
          style={{ backgroundColor: skinColor }}
        ></div>

        {/* Face Features */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          {/* Eyes */}
          <div className="flex justify-center space-x-3 mb-1">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          {/* Eyebrows */}
          <div className="flex justify-center space-x-4 mb-1">
            <div className="w-3 h-0.5 bg-black rounded-full"></div>
            <div className="w-3 h-0.5 bg-black rounded-full"></div>
          </div>
          {/* Nose */}
          <div className="flex justify-center mb-1">
            <div className="w-1 h-2 bg-orange-800 rounded-sm"></div>
          </div>
          {/* Mouth */}
          <div className="flex justify-center">
            <div className="w-3 h-1 border-b-2 border-black rounded-b-full"></div>
          </div>
        </div>

        {/* Hair */}
        {hair && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-3xl drop-shadow-sm">
            {hair.image}
          </div>
        )}

        {/* Head Accessories */}
        {head && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-2xl drop-shadow-sm">
            {head.image}
          </div>
        )}

        {/* Accessories */}
        {accessories && (
          <div className="absolute top-12 right-2 text-xl drop-shadow-sm">
            {accessories.image}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      <SiteHeader
        links={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
        ]}
        rightSlot={
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/games'}
              className="rounded-xl border border-[#88a9d8]/20 bg-[#080f1c]/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#ffc105] no-underline transition hover:bg-[#0a1222]"
            >
              Back to Games
            </button>
            <div className="rounded-xl border border-[#88a9d8]/20 bg-[#ffc105]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#ffc105]">
              🪙 {sandDollars} Sand Dollars
            </div>
            <button className="rounded-xl border border-[#88a9d8]/20 bg-[#10b981]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#10b981] transition hover:bg-[#10b981]/15">
              Earn More
            </button>
          </div>
        }
      />

      <div className="pt-[92px] max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold mb-4">Your Avatar</h2>
              <div className="mb-4 flex justify-center items-center min-h-80">
                {renderAvatar()}
              </div>
              <div className="text-sm text-gray-300">
                Customize your look below!
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(AVATAR_ITEMS).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory('summer-deals')}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  selectedCategory === 'summer-deals'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-200'
                }`}
              >
                🌞 Summer Deals
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedCategory === 'summer-deals' ? (
                SUMMER_DEALS.map(item => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <div className="font-bold text-sm mb-1">{item.name}</div>
                    <div className="text-xs text-gray-300 mb-2">{item.description}</div>
                    <div className="text-yellow-400 font-bold mb-2">🪙 {item.price}</div>
                    <button
                      onClick={() => purchaseItem(item, 'summer-deals')}
                      className="bg-orange-600 hover:bg-orange-500 px-3 py-1 rounded text-xs transition-colors w-full"
                    >
                      Buy
                    </button>
                  </div>
                ))
              ) : (
                AVATAR_ITEMS[selectedCategory as keyof typeof AVATAR_ITEMS]?.map(item => (
                  <div
                    key={item.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      selectedItems[selectedCategory] === item.id
                        ? 'bg-blue-600/50 border-2 border-blue-400'
                        : 'hover:bg-white/20'
                    }`}
                    onClick={() => selectItem(selectedCategory, item.id)}
                  >
                    <div className="text-4xl mb-2">{item.image}</div>
                    <div className="font-bold text-sm mb-1">{item.name}</div>
                    <div className="text-yellow-400 font-bold text-xs">
                      {item.price === 0 ? 'FREE' : `🪙 ${item.price}`}
                    </div>
                    {item.price > 0 && sandDollars < item.price && (
                      <div className="text-red-400 text-xs mt-1">Can't afford</div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* How to Earn Coins */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">💰 How to Earn Sand Dollars</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-bold text-green-400 mb-2">🎮 Play Games:</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Pac-Man: 50-200 coins (based on score)</li>
                    <li>• Space Program: 100-500 coins (missions)</li>
                    <li>• Rocket Builder: 75-300 coins (success)</li>
                    <li>• Interactive Games: 25-100 coins</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">🎯 Daily Challenges:</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Login daily: 10 coins</li>
                    <li>• Complete 3 games: 50 coins</li>
                    <li>• Share score: 25 coins</li>
                    <li>• Weekly bonus: 100 coins</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
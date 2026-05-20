'use client';

import { useState } from 'react';

interface Item {
  name: string;
  cost: number;
  emoji: string;
  description: string;
}

export default function ElonFortune({ onClose }: { onClose: () => void }) {
  const [balance, setBalance] = useState(250000000000);
  const [purchases, setPurchases] = useState<{ name: string; count: number }[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [recentPurchase, setRecentPurchase] = useState<string | null>(null);
  const [netWorthChange, setNetWorthChange] = useState(0);

  const items: Item[] = [
    { name: 'Diamond-Encrusted Toilet Seat', cost: 500000, emoji: '🚽', description: 'Because regular toilets are for peasants' },
    { name: 'Gold-Plated Tesla', cost: 5000000, emoji: '🚗', description: 'Standard Tesla but with more gold' },
    { name: 'Private Moon Base', cost: 500000000, emoji: '🌙', description: 'Perfect for when Earth gets boring' },
    { name: 'Entire Pizza Industry', cost: 50000000000, emoji: '🍕', description: 'Control the global pizza supply' },
    { name: 'Giant Golden Statue of Yourself', cost: 100000000, emoji: '🏆', description: 'As it should be' },
    { name: 'Unicorn (Cyber Edition)', cost: 1000000, emoji: '🦄', description: 'It has lasers and Wi-Fi' },
    { name: 'All Twitter Bots', cost: 25000000, emoji: '🤖', description: 'Finally, meaningful conversations' },
    { name: 'Replacement for Earth', cost: 1000000000, emoji: '🪐', description: 'Backup planet, just in case' },
    { name: 'World\'s Largest Flamingo Pool Float', cost: 10000000, emoji: '🦩', description: 'Essential for pool parties' },
    { name: 'Lifetime Supply of Memes', cost: 1000000, emoji: '😂', description: 'Infinite entertainment' },
    { name: 'Personal Space Station', cost: 2500000000, emoji: '🛸', description: 'Escape the haters' },
    { name: 'Buy a Small Country', cost: 10000000000, emoji: '🏳️', description: 'Change laws to your liking' },
  ];

  const formatBalance = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const buyItem = (item: Item) => {
    setBalance((prev) => {
      if (prev >= item.cost) {
        const newBalance = prev - item.cost;
        setRecentPurchase(item.name);
        setNetWorthChange(prev - newBalance);
        
        setTimeout(() => setRecentPurchase(null), 3000);
        
        const existing = purchases.find((p) => p.name === item.name);
        if (existing) {
          setPurchases(purchases.map((p) => (p.name === item.name ? { ...p, count: p.count + 1 } : p)));
        } else {
          setPurchases([...purchases, { name: item.name, count: 1 }]);
        }
        setTotalPurchases(prev => prev + 1);
        return newBalance;
      }
      return prev;
    });
  };

  const getSpendingPercentage = () => {
    const initial = 250000000000;
    const spent = initial - balance;
    return ((spent / initial) * 100).toFixed(1);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#080f1c] to-[#001a4d]">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#ffc105] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b border-[rgba(73,122,182,.3)] px-6 py-4 flex items-center justify-between bg-[#080f1c]/80 backdrop-blur z-10">
        <div>
          <h1 className="text-[#ffc105] font-bold text-2xl">💰 Elon's Fortune</h1>
          <p className="text-[#497ab6] text-sm">Spend $250B on ridiculous items!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[#ffc105] font-bold text-xl">{formatBalance(balance)}</div>
            <div className="text-[#7a93b4] text-xs">Net Worth</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/games'}
              className="bg-[#497ab6] text-[#e8edf5] border-none px-3 py-1 rounded text-xs font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
            >
              ← Games
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-[#497ab6] text-[#e8edf5] border-none px-3 py-1 rounded text-xs font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
            >
              🏠 Home
            </button>
            <button
              onClick={onClose}
              className="bg-[#ffc105] text-[#080f1c] border-none px-4 py-1 rounded text-xs font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-all"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Recent purchase notification */}
      {recentPurchase && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-[#ffc105] text-[#080f1c] px-6 py-3 rounded-lg font-bold z-20 animate-bounce shadow-lg">
          🎉 Purchased: {recentPurchase}! (-{formatBalance(netWorthChange)})
        </div>
      )}

      {/* Main content */}
      <div className="absolute top-20 left-0 right-0 bottom-0 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const canBuy = balance >= item.cost;
              const purchased = purchases.find(p => p.name === item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => canBuy && buyItem(item)}
                  disabled={!canBuy}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    canBuy
                      ? 'bg-[#ffc105]/10 border-[#ffc105] hover:bg-[#ffc105]/20 cursor-pointer'
                      : 'bg-[#497ab6]/10 border-[#497ab6]/30 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{item.emoji}</span>
                    {purchased && (
                      <span className="bg-[#ffc105] text-[#080f1c] text-xs font-bold px-2 py-1 rounded">
                        ×{purchased.count}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[#e8edf5] font-bold text-sm mb-1">{item.name}</h3>
                  <p className="text-[#7a93b4] text-xs mb-2">{item.description}</p>
                  <div className={`font-bold ${canBuy ? 'text-[#ffc105]' : 'text-[#7a93b4]'}`}>
                    {formatBalance(item.cost)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stats panel */}
          <div className="bg-[#101e34]/80 backdrop-blur rounded-lg border border-[#497ab6]/30 p-4 h-fit">
            <h2 className="text-[#ffc105] font-bold text-lg mb-4">📊 Statistics</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-[#7a93b4] text-xs mb-1">Total Purchases</div>
                <div className="text-[#e8edf5] font-bold text-xl">{totalPurchases}</div>
              </div>
              
              <div>
                <div className="text-[#7a93b4] text-xs mb-1">Money Spent</div>
                <div className="text-[#ffc105] font-bold text-xl">{formatBalance(250000000000 - balance)}</div>
              </div>
              
              <div>
                <div className="text-[#7a93b4] text-xs mb-1">Spending Progress</div>
                <div className="w-full bg-[#080f1c] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#ffc105] to-[#ff6b6b] h-full transition-all"
                    style={{ width: `${getSpendingPercentage()}%` }}
                  />
                </div>
                <div className="text-[#7a93b4] text-xs mt-1">{getSpendingPercentage()}% of fortune spent</div>
              </div>

              <div className="border-t border-[#497ab6]/30 pt-3">
                <div className="text-[#7a93b4] text-xs mb-2">Recent Purchases</div>
                {purchases.length === 0 ? (
                  <div className="text-[#7a93b4] text-xs italic">No purchases yet</div>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {purchases.slice(-5).reverse().map((p) => (
                      <div key={p.name} className="text-[#e8edf5] text-xs flex justify-between">
                        <span className="truncate">{p.name}</span>
                        <span className="text-[#ffc105]">×{p.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

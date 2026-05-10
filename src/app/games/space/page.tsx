'use client';

import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';

type Screen = 'spacecenter' | 'vab' | 'tracking' | 'launch';

export default function SpaceGame() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('spacecenter');
  const goToScreen = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="w-full h-screen bg-black text-white font-mono overflow-hidden pt-[92px]">
      <SiteHeader
        links={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
        ]}
        rightSlot={
          <a
            href="/games"
            className="rounded-xl border border-[#88a9d8]/20 bg-[#080f1c]/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#ffc105] no-underline transition hover:bg-[#0a1222]"
          >
            Back to Games
          </a>
        }
      />

      {/* KSP-style header */}
      <div className="absolute top-[92px] left-0 right-0 h-16 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-green-600 flex items-center justify-between px-4 z-50">
        <div className="flex items-center space-x-4">
          <div className="text-green-400 text-xl font-bold">SAHARA SPACE PROGRAM</div>
          <div className="text-green-300 text-sm">v1.0.0</div>
        </div>
        <div className="flex items-center space-x-4 text-green-400">
          <div>Funds: §120,000</div>
          <div>Science: 0</div>
          <div>Reputation: 0</div>
        </div>
      </div>

      {/* Main game area */}
      <div className="pt-16 h-full relative">
        {currentScreen === 'spacecenter' && <SpaceCenter onNavigate={goToScreen} />}
        {currentScreen === 'vab' && <VAB onNavigate={goToScreen} />}
        {currentScreen === 'tracking' && <TrackingStation onNavigate={goToScreen} />}
        {currentScreen === 'launch' && <LaunchPad onNavigate={goToScreen} />}
      </div>
    </div>
  );
}

type ScreenNavigation = {
  onNavigate: (screen: Screen) => void;
};

function SpaceCenter({ onNavigate }: ScreenNavigation) {
  return (
    <div className="relative w-full h-full">
      {/* 3D Space Center view placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-green-400">
            <div className="text-6xl mb-4">🚀</div>
            <div className="text-xl">SAHARA SPACE CENTER</div>
            <div className="text-sm text-green-300 mt-2">Kerbin</div>
          </div>
        </div>

        {/* Buildings */}
        <div className="absolute bottom-20 left-20">
          <button
            onClick={() => onNavigate('vab')}
            className="bg-gray-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            VEHICLE ASSEMBLY BUILDING
          </button>
        </div>

        <div className="absolute bottom-20 right-20">
          <button
            onClick={() => onNavigate('launch')}
            className="bg-gray-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            LAUNCH PAD
          </button>
        </div>

        <div className="absolute top-20 right-20">
          <button
            onClick={() => onNavigate('tracking')}
            className="bg-gray-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            TRACKING STATION
          </button>
        </div>
      </div>

      {/* UI Panels */}
      <div className="absolute top-20 left-4 w-80">
        <div className="bg-gray-900 border border-green-600 p-4">
          <div className="text-green-400 font-bold mb-2">MISSION CONTROL</div>
          <div className="text-sm text-green-300 space-y-1">
            <div>Active Missions: 0</div>
            <div>Available Kerbals: 4</div>
            <div>Weather: Clear</div>
            <div>Time: Year 1, Day 1</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 w-80">
        <div className="bg-gray-900 border border-green-600 p-4">
          <div className="text-green-400 font-bold mb-2">ADMINISTRATION</div>
          <div className="text-sm text-green-300 space-y-1">
            <div>Strategy: None</div>
            <div>Upgrades: None</div>
            <div>Facilities: Basic</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VAB({ onNavigate }: ScreenNavigation) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => onNavigate('spacecenter')}
          className="bg-gray-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          ← BACK TO SPACE CENTER
        </button>
      </div>

      <div className="flex h-full pt-16">
        <div className="w-1/4 bg-gray-900 border-r border-green-600 p-4">
          <div className="text-green-400 font-bold mb-4">PARTS</div>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-800 p-2 border border-green-600 cursor-pointer hover:bg-gray-700">
              Command Pod Mk1
            </div>
            <div className="bg-gray-800 p-2 border border-green-600 cursor-pointer hover:bg-gray-700">
              FL-T100 Fuel Tank
            </div>
            <div className="bg-gray-800 p-2 border border-green-600 cursor-pointer hover:bg-gray-700">
              LV-909 Liquid Engine
            </div>
            <div className="bg-gray-800 p-2 border border-green-600 cursor-pointer hover:bg-gray-700">
              AV-R8 Winglet
            </div>
            <div className="bg-gray-800 p-2 border border-green-600 cursor-pointer hover:bg-gray-700">
              TT-38K Radial Decoupler
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-gray-900 border-b border-green-600 p-4">
            <div className="text-green-400 font-bold">VEHICLE ASSEMBLY BUILDING</div>
            <div className="text-sm text-green-300">Current Vessel: Untitled Space Craft</div>
          </div>

          <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-green-400">
              <div className="text-8xl mb-4">🚀</div>
              <div className="text-xl">ROCKET ASSEMBLY AREA</div>
              <div className="text-sm text-green-300 mt-2">Drag parts here to build your rocket</div>
            </div>
          </div>

          <div className="bg-gray-900 border-t border-green-600 p-4 flex justify-between">
            <div className="text-sm text-green-300">
              <div>Mass: 1.2t</div>
              <div>Cost: §1,200</div>
            </div>
            <button className="bg-green-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-green-700 transition-colors">
              LAUNCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingStation({ onNavigate }: ScreenNavigation) {
  return (
    <div className="relative w-full h-full bg-black">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => onNavigate('spacecenter')}
          className="bg-gray-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          ← BACK TO SPACE CENTER
        </button>
      </div>

      <div className="pt-16 h-full flex">
        <div className="w-1/3 bg-gray-900 border-r border-green-600 p-4">
          <div className="text-green-400 font-bold mb-4">MISSIONS</div>
          <div className="text-sm text-green-300">
            No active missions
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
          <div className="text-center text-green-400">
            <div className="text-8xl mb-4">🛰️</div>
            <div className="text-xl">TRACKING STATION</div>
            <div className="text-sm text-green-300 mt-2">Monitor your space missions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaunchPad({ onNavigate }: ScreenNavigation) {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-black">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => onNavigate('spacecenter')}
          className="bg-gray-800 border border-green-600 text-green-400 px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          ← BACK TO SPACE CENTER
        </button>
      </div>

      <div className="pt-16 h-full flex items-center justify-center">
        <div className="text-center text-green-400">
          <div className="text-8xl mb-4">🚀</div>
          <div className="text-xl">LAUNCH PAD</div>
          <div className="text-sm text-green-300 mt-2">Ready for launch</div>
          <button className="mt-4 bg-red-800 border border-red-600 text-red-400 px-6 py-3 hover:bg-red-700 transition-colors text-lg">
            LAUNCH!
          </button>
        </div>
      </div>
    </div>
  );
}
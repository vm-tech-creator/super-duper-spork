'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function LanguageSelector() {
  const { language, setLanguage, t, hasSelectedLanguage, setHasSelectedLanguage } = useLanguage();

  if (hasSelectedLanguage) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#0a2e1a] to-[#0f5132] border border-green-400/30 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
            <Globe className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{t('languageSelection.title')}</h1>
          <p className="text-green-200 text-lg">{t('languageSelection.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`relative p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                language === lang.code
                  ? 'border-green-400 bg-green-500/20'
                  : 'border-green-400/20 bg-green-900/20 hover:border-green-400/40'
              }`}
            >
              <div className="text-4xl mb-3">{lang.flag}</div>
              <div className="text-white font-semibold">{lang.name}</div>
              {language === lang.code && (
                <div className="absolute top-3 right-3">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setHasSelectedLanguage(true)}
          className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all text-lg"
        >
          {t('languageSelection.continue')}
        </button>
      </div>
    </div>
  );
}

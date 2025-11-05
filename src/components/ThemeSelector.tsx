import React from 'react';
import { Palette } from 'lucide-react';

export interface ThemeConfig {
  id: string;
  name: string;
  gradient: string;
  primary: string;
  secondary: string;
  backgroundImage?: string;
  hasPattern?: boolean;
}

export const themes: ThemeConfig[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'from-slate-900 via-purple-900 to-slate-900',
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'from-blue-900 via-cyan-900 to-blue-900',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    backgroundImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-gray-900 via-green-900 to-gray-900',
    primary: '#10B981',
    secondary: '#34D399',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  },
  {
    id: 'rose',
    name: 'Rose',
    gradient: 'from-pink-900 via-rose-900 to-pink-900',
    primary: '#F43F5E',
    secondary: '#FB7185',
  },
  {
    id: 'amber',
    name: 'Amber',
    gradient: 'from-orange-900 via-amber-900 to-orange-900',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'from-slate-950 via-indigo-950 to-slate-950',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    gradient: 'from-pink-950 via-purple-950 to-pink-950',
    primary: '#EC4899',
    secondary: '#F472B6',
    backgroundImage: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    gradient: 'from-purple-950 via-violet-950 to-purple-950',
    primary: '#A78BFA',
    secondary: '#C4B5FD',
    backgroundImage: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=1920&q=80',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'from-emerald-950 via-teal-950 to-cyan-950',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
  },
  {
    id: 'desert',
    name: 'Desert',
    gradient: 'from-orange-950 via-yellow-950 to-red-950',
    primary: '#F97316',
    secondary: '#FB923C',
    backgroundImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    gradient: 'from-indigo-950 via-purple-950 to-pink-950',
    primary: '#8B5CF6',
    secondary: '#D946EF',
    backgroundImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
  },
  {
    id: 'volcano',
    name: 'Volcano',
    gradient: 'from-red-950 via-orange-950 to-red-950',
    primary: '#EF4444',
    secondary: '#F97316',
  },
  {
    id: 'tropical',
    name: 'Tropical',
    gradient: 'from-teal-950 via-green-950 to-emerald-950',
    primary: '#14B8A6',
    secondary: '#10B981',
    backgroundImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    gradient: 'from-gray-950 via-slate-900 to-gray-950',
    primary: '#94A3B8',
    secondary: '#CBD5E1',
  },
  {
    id: 'neon',
    name: 'Neon City',
    gradient: 'from-black via-purple-950 to-black',
    primary: '#FF00FF',
    secondary: '#00FFFF',
    hasPattern: true,
  },
  {
    id: 'autumn',
    name: 'Autumn',
    gradient: 'from-amber-950 via-orange-950 to-red-950',
    primary: '#F59E0B',
    secondary: '#DC2626',
    backgroundImage: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1920&q=80',
  },
];

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
        title="Change Theme"
      >
        <Palette size={20} />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 glass rounded-2xl p-4 shadow-2xl z-50 min-w-[280px] max-h-[80vh] overflow-y-auto">
            <h3 className="font-semibold mb-3">Choose Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`text-left p-3 rounded-lg flex flex-col gap-2 transition-all ${
                    currentTheme === theme.id
                      ? 'bg-white/30 shadow-lg ring-2 ring-white/50'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-md relative overflow-hidden"
                    style={{
                      background: theme.backgroundImage 
                        ? `url(${theme.backgroundImage})` 
                        : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {theme.backgroundImage && (
                      <div className="absolute inset-0 bg-black/40" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


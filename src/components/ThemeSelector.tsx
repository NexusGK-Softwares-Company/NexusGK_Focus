import React from 'react';
import { Palette } from 'lucide-react';

export interface ThemeConfig {
  id: string;
  name: string;
  gradient: string;
  primary: string;
  secondary: string;
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
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-gray-900 via-green-900 to-gray-900',
    primary: '#10B981',
    secondary: '#34D399',
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
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'from-slate-950 via-indigo-950 to-slate-950',
    primary: '#6366F1',
    secondary: '#8B5CF6',
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
          <div className="absolute right-0 mt-2 glass rounded-2xl p-4 shadow-2xl z-50 min-w-[200px]">
            <h3 className="font-semibold mb-3">Choose Theme</h3>
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${
                    currentTheme === theme.id
                      ? 'bg-white/30 shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    }}
                  />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


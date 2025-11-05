import React from 'react';
import { TimerMode } from '../types';
import { Coffee, Clock, Waves } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes: { mode: TimerMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'pomodoro', label: 'NexFocus', icon: <Clock size={18} /> },
    { mode: 'shortBreak', label: 'Short Break', icon: <Coffee size={18} /> },
    { mode: 'longBreak', label: 'Long Break', icon: <Waves size={18} /> },
  ];

  return (
    <div className="flex gap-2 p-2 glass rounded-full mb-8">
      {modes.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
            currentMode === mode
              ? 'bg-white/30 shadow-lg scale-105'
              : 'hover:bg-white/10'
          }`}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};


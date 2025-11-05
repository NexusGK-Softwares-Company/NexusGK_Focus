import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerMode } from '../types';

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  progress: number;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  isRunning,
  progress,
  mode,
  onStart,
  onPause,
  onReset,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getModeText = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'pomodoro':
        return 'from-red-500 to-pink-500';
      case 'shortBreak':
        return 'from-green-500 to-teal-500';
      case 'longBreak':
        return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">{getModeText()}</h2>
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8">
        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-primary" stopColor="currentColor" />
              <stop offset="100%" className="text-secondary" stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl md:text-7xl font-bold font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={onStart}
            className={`bg-gradient-to-r ${getModeColor()} px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-lg`}
          >
            <Play size={24} fill="white" />
            Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="bg-white/20 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-white/30 transition-all shadow-lg"
          >
            <Pause size={24} fill="white" />
            Pause
          </button>
        )}
        
        <button
          onClick={onReset}
          className="bg-white/10 px-6 py-4 rounded-full hover:bg-white/20 transition-all shadow-lg"
          title="Reset"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};


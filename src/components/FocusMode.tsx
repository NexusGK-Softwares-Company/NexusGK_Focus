import React from 'react';
import { Minimize2, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerMode } from '../types';

interface FocusModeProps {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onExit: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  timeLeft,
  isRunning,
  mode,
  onStart,
  onPause,
  onReset,
  onSkip,
  onExit,
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

  const getModeGradient = () => {
    switch (mode) {
      case 'pomodoro':
        return 'from-red-500/20 to-pink-500/20';
      case 'shortBreak':
        return 'from-green-500/20 to-teal-500/20';
      case 'longBreak':
        return 'from-blue-500/20 to-purple-500/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getModeGradient()} opacity-50`} />

      {/* Exit button */}
      <button
        onClick={onExit}
        className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
        title="Exit Focus Mode (Esc)"
      >
        <Minimize2 size={24} />
      </button>

      {/* Timer content */}
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-semibold mb-12 text-white/80">{getModeText()}</h2>
        
        <div className="text-9xl font-bold font-mono mb-16">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm"
              title="Start (Space/K)"
            >
              <Play size={32} fill="white" />
            </button>
          ) : (
            <button
              onClick={onPause}
              className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm"
              title="Pause (Space/K)"
            >
              <Pause size={32} fill="white" />
            </button>
          )}
          
          <button
            onClick={onReset}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
            title="Reset (R)"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={onSkip}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
            title="Skip (S)"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-16 text-sm text-white/40 space-y-2">
          <p>Space/K: Start/Pause • R: Reset • S: Skip • Esc: Exit</p>
        </div>
      </div>
    </div>
  );
};


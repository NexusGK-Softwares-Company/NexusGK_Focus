import React, { useEffect, useRef } from 'react';
import { Minimize2, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { TimerMode } from '../types';
import { ThemeConfig } from './ThemeSelector';

interface FocusModeProps {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  theme: ThemeConfig;
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
  theme,
  onStart,
  onPause,
  onReset,
  onSkip,
  onExit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFullscreenActiveRef = useRef(false);
  const onExitRef = useRef(onExit);

  // Keep the onExit ref updated
  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    // Enter fullscreen when component mounts
    const enterFullscreen = async () => {
      try {
        if (containerRef.current && !document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
          isFullscreenActiveRef.current = true;
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 100);

    // Listen for fullscreen changes (when user presses ESC)
    const handleFullscreenChange = () => {
      // Only exit if we were previously in fullscreen and now we're not
      if (isFullscreenActiveRef.current && !document.fullscreenElement) {
        onExitRef.current();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup: exit fullscreen when component unmounts
    return () => {
      clearTimeout(timer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const handleExit = async () => {
    isFullscreenActiveRef.current = false;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
    onExit();
  };
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

  const getBackgroundStyle = () => {
    if (theme.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    return {};
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-gradient-to-br ${theme.gradient} z-50 flex flex-col items-center justify-center w-screen h-screen`}
      style={getBackgroundStyle()}
    >
      {/* Optional overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Exit button */}
      <button
        onClick={handleExit}
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
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all backdrop-blur-sm shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
            title="Start (Space/K)"
          >
            <Play size={32} fill="white" />
          </button>
        ) : (
          <button
            onClick={onPause}
            className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm shadow-2xl"
            title="Pause (Space/K)"
          >
            <Pause size={32} fill="white" />
          </button>
        )}
        
        <button
          onClick={onReset}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm shadow-xl"
          title="Reset (R)"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={onSkip}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm shadow-xl"
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


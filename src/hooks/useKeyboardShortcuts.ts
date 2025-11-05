import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onStartPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onNextMode: () => void;
  onSettings: () => void;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          config.onStartPause();
          break;
        case 'r':
          e.preventDefault();
          config.onReset();
          break;
        case 's':
          e.preventDefault();
          config.onSkip();
          break;
        case 'n':
          e.preventDefault();
          config.onNextMode();
          break;
        case ',':
          if (e.shiftKey) {
            e.preventDefault();
            config.onSettings();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [config]);
};


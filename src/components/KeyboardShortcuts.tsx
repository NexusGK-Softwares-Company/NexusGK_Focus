import React from 'react';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onClose }) => {
  const shortcuts = [
    { keys: ['Space', 'K'], action: 'Start / Pause timer' },
    { keys: ['R'], action: 'Reset timer' },
    { keys: ['S'], action: 'Skip current session' },
    { keys: ['N'], action: 'Next mode' },
    { keys: ['Shift', ','], action: 'Open settings' },
    { keys: ['Esc'], action: 'Exit focus mode' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Keyboard size={28} />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
            >
              <span className="text-white/80">{shortcut.action}</span>
              <div className="flex gap-2">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <kbd className="px-3 py-1 bg-white/10 rounded-lg text-sm font-mono">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && <span className="text-white/40">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


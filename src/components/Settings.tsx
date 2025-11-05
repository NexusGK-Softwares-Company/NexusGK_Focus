import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export interface SettingsConfig {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

interface SettingsProps {
  settings: SettingsConfig;
  onSave: (settings: SettingsConfig) => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Timer Durations */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary">Timer (minutes)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label>Pomodoro</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.pomodoroDuration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pomodoroDuration: parseInt(e.target.value) || 25,
                    })
                  }
                  className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakDuration: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakDuration: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Long Break Interval</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={localSettings.longBreakInterval}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakInterval: parseInt(e.target.value) || 4,
                    })
                  }
                  className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Auto-start */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-secondary">Auto-start</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Auto-start Breaks</span>
                <input
                  type="checkbox"
                  checked={localSettings.autoStartBreaks}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      autoStartBreaks: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded accent-secondary cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Auto-start Pomodoros</span>
                <input
                  type="checkbox"
                  checked={localSettings.autoStartPomodoros}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      autoStartPomodoros: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded accent-secondary cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* Notifications & Sound */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-accent">Alerts</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Enable Notifications</span>
                <input
                  type="checkbox"
                  checked={localSettings.notificationsEnabled}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      notificationsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded accent-accent cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Enable Sound</span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      soundEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded accent-accent cursor-pointer"
                />
              </label>
            </div>
          </section>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
          >
            <Check size={20} />
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


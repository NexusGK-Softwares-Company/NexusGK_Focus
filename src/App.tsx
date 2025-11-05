import  { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { ModeSelector } from './components/ModeSelector';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { FocusSounds } from './components/FocusSounds';
import { Settings, SettingsConfig } from './components/Settings';
import { ThemeSelector, themes } from './components/ThemeSelector';
import { SessionHistory } from './components/SessionHistory';
import { Goals } from './components/Goals';
import { DataManager } from './components/DataManager';
import { FocusMode } from './components/FocusMode';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { TimerMode, Task, Session, Stats as StatsType } from './types';
import { Settings as SettingsIcon, History, Maximize2, Keyboard } from 'lucide-react';

const DEFAULT_SETTINGS: SettingsConfig = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  notificationsEnabled: true,
  soundEnabled: true,
};

function App() {
  // All user data stored in localStorage
  const [mode, setMode] = useLocalStorage<TimerMode>('currentMode', 'pomodoro');
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', []);
  const [settings, setSettings] = useLocalStorage<SettingsConfig>('settings', DEFAULT_SETTINGS);
  const [currentTheme, setCurrentTheme] = useLocalStorage<string>('theme', 'sunset');
  const [dailyGoal, setDailyGoal] = useLocalStorage<number>('dailyGoal', 8);
  const [streakData, setStreakData] = useLocalStorage<{ lastDate: string; current: number; longest: number }>('streakData', {
    lastDate: '',
    current: 0,
    longest: 0,
  });
  const [pomodoroCount, setPomodoroCount] = useLocalStorage<number>('pomodoroCount', 0);
  
  // UI state (temporary, doesn't need to persist)
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const handleTimerComplete = () => {
    // Play completion sound
    if (settings.soundEnabled) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_c610232a3f.mp3');
      audio.play();
    }

    // Send notification
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: mode === 'pomodoro' ? 'Time for a break!' : 'Time to focus!',
        icon: 'https://res.cloudinary.com/dzj1fusx1/image/upload/v1762343830/NexFocus_Logo_tntzfw.png',
      });
    }

    // Save session
    const duration = mode === 'pomodoro' 
      ? settings.pomodoroDuration 
      : mode === 'shortBreak' 
      ? settings.shortBreakDuration 
      : settings.longBreakDuration;

    const newSession: Session = {
      id: Date.now().toString(),
      mode,
      duration,
      completedAt: new Date(),
    };
    setSessions([...sessions, newSession]);

    // Update streak
    if (mode === 'pomodoro') {
      updateStreak();
    }

    // Auto-switch modes
    if (mode === 'pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      const nextMode = newCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
    } else {
      setMode('pomodoro');
    }
  };

  const autoStart = mode === 'pomodoro' 
    ? settings.autoStartPomodoros 
    : settings.autoStartBreaks;

  const { timeLeft, isRunning, progress, start, pause, reset, skip } = useTimer(
    mode,
    {
      pomodoro: settings.pomodoroDuration,
      shortBreak: settings.shortBreakDuration,
      longBreak: settings.longBreakDuration,
    },
    handleTimerComplete,
    autoStart
  );

  // Update streak tracking
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastDate = streakData.lastDate;
    
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newCurrent = lastDate === yesterday ? streakData.current + 1 : 1;
      const newLongest = Math.max(newCurrent, streakData.longest);
      
      setStreakData({
        lastDate: today,
        current: newCurrent,
        longest: newLongest,
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notificationsEnabled]);

  // Apply theme
  useEffect(() => {
    const theme = themes.find((t) => t.id === currentTheme) || themes[0];
    document.body.className = `bg-gradient-to-br ${theme.gradient} text-white min-h-screen`;
    
    // Apply background image if theme has one
    if (theme.backgroundImage) {
      document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${theme.backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    }
  }, [currentTheme]);

  // Keyboard shortcuts
  const handleStartPause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleNextMode = () => {
    const modes: TimerMode[] = ['pomodoro', 'shortBreak', 'longBreak'];
    const currentIndex = modes.indexOf(mode);
    setMode(modes[(currentIndex + 1) % modes.length]);
  };

  useKeyboardShortcuts({
    onStartPause: handleStartPause,
    onReset: reset,
    onSkip: skip,
    onNextMode: handleNextMode,
    onSettings: () => setShowSettings(true),
  });

  // Update document title
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - NexusGK Focus`;
  }, [timeLeft]);

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Data management
  const handleExport = () => {
    const data = {
      tasks,
      sessions,
      settings,
      dailyGoal,
      streakData,
      pomodoroCount,
      currentMode: mode,
      theme: currentTheme,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusgk-focus-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (dataString: string) => {
    try {
      const data = JSON.parse(dataString);
      if (data.tasks) setTasks(data.tasks);
      if (data.sessions) setSessions(data.sessions);
      if (data.settings) setSettings(data.settings);
      if (data.dailyGoal) setDailyGoal(data.dailyGoal);
      if (data.streakData) setStreakData(data.streakData);
      if (data.pomodoroCount !== undefined) setPomodoroCount(data.pomodoroCount);
      if (data.currentMode) setMode(data.currentMode);
      if (data.theme) setCurrentTheme(data.theme);
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
      console.error('Import error:', error);
    }
  };

  const handleClearData = () => {
    setTasks([]);
    setSessions([]);
    setSettings(DEFAULT_SETTINGS);
    setDailyGoal(8);
    setStreakData({ lastDate: '', current: 0, longest: 0 });
    setPomodoroCount(0);
    setMode('pomodoro');
    setCurrentTheme('sunset');
    alert('All data cleared successfully!');
  };

  // Calculate stats
  const todaysSessions = sessions.filter(
    (session) =>
      new Date(session.completedAt).toDateString() === new Date().toDateString()
  );

  const todaysPomodoros = todaysSessions.filter(s => s.mode === 'pomodoro').length;

  const stats: StatsType = {
    totalSessions: sessions.length,
    totalMinutes: sessions.reduce((acc, session) => acc + session.duration, 0),
    todaySessions: todaysSessions.length,
    todayMinutes: todaysSessions.reduce((acc, session) => acc + session.duration, 0),
  };

  // Get current theme
  const currentThemeConfig = themes.find((t) => t.id === currentTheme) || themes[0];

  // Focus Mode
  if (showFocusMode) {
    return (
      <FocusMode
        timeLeft={timeLeft}
        isRunning={isRunning}
        mode={mode}
        theme={currentThemeConfig}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
        onExit={() => setShowFocusMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
                title="Keyboard Shortcuts"
              >
                <Keyboard size={20} />
                <span className="hidden sm:inline">Shortcuts</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <img 
                src="https://res.cloudinary.com/dzj1fusx1/image/upload/v1762343830/NexFocus_Logo_tntzfw.png" 
                alt="NexFocus Logo" 
                className="w-22 h-22 md:w-24 md:h-24 object-contain rounded-full border-2 justify-center items-center"
              />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                NexusGK Focus
              </h1>
            </div>
            
            <div className="flex gap-2">
              <ThemeSelector
                currentTheme={currentTheme}
                onThemeChange={setCurrentTheme}
              />
              <button
                onClick={() => setShowHistory(true)}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
                title="Session History"
              >
                <History size={20} />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
                title="Settings"
              >
                <SettingsIcon size={20} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
          <p className="text-white/60">Boost your productivity with the NexFocus Technique</p>
        </header>

        {/* Stats */}
        <Stats stats={stats} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Timer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-center">
              <ModeSelector currentMode={mode} onModeChange={setMode} />
            </div>
            
            <div className="relative">
              <Timer
                timeLeft={timeLeft}
                isRunning={isRunning}
                progress={progress}
                mode={mode}
                onStart={start}
                onPause={pause}
                onReset={reset}
              />
              <button
                onClick={() => setShowFocusMode(true)}
                className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/20 transition-all"
                title="Focus Mode (F)"
              >
                <Maximize2 size={20} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FocusSounds />
              <Goals
                dailyGoal={dailyGoal}
                completedToday={todaysPomodoros}
                currentStreak={streakData.current}
                longestStreak={streakData.longest}
                onSetGoal={setDailyGoal}
              />
            </div>
          </div>

          {/* Right Column - Tasks & Data */}
          <div className="space-y-6">
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
            <DataManager
              onExport={handleExport}
              onImport={handleImport}
              onClearData={handleClearData}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 pb-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://res.cloudinary.com/dzj1fusx1/image/upload/v1762343830/NexFocus_Logo_tntzfw.png" 
                    alt="NexFocus Logo" 
                    className="w-10 h-10 object-contain"
                  />
                  <h3 className="text-xl font-bold">NexusGK Focus</h3>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  The future of productivity happens with NexFocus. Beautiful focus timer built for developers and creators.
                </p>
                <div className="flex gap-3">
                  <a 
                    href="https://github.com/nexusgk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com/nexusgk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://linkedin.com/company/nexusgk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><button onClick={() => setShowFocusMode(true)} className="hover:text-white transition-colors">Focus Mode</button></li>
                  <li><button onClick={() => setShowSettings(true)} className="hover:text-white transition-colors">Settings</button></li>
                  <li><button onClick={() => setShowHistory(true)} className="hover:text-white transition-colors">Session History</button></li>
                  <li><button onClick={() => setShowKeyboardShortcuts(true)} className="hover:text-white transition-colors">Keyboard Shortcuts</button></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><a href="https://github.com/nexusgk/nexusgk-focus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="https://github.com/nexusgk/nexusgk-focus/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="https://github.com/nexusgk/nexusgk-focus/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report Issue</a></li>
                  <li><a href="https://github.com/nexusgk/nexusgk-focus/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MIT License</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
              <p>© 2025 NexusGK. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span>Built with</span>
                <span className="text-red-400">♥</span>
                <span>using React, TypeScript & Tailwind CSS</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {showSettings && (
        <Settings
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      
      {showHistory && (
        <SessionHistory
          sessions={sessions}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showKeyboardShortcuts && (
        <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
      )}
    </div>
  );
}

export default App;


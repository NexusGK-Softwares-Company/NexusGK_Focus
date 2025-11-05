import React, { useState, useEffect } from 'react';
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
  const [mode, setMode] = useState<TimerMode>('pomodoro');
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
  
  const [pomodoroCount, setPomodoroCount] = useState(0);
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
        icon: '/vite.svg',
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
      theme: currentTheme,
      exportedAt: new Date().toISOString(),
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
      if (data.theme) setCurrentTheme(data.theme);
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleClearData = () => {
    setTasks([]);
    setSessions([]);
    setSettings(DEFAULT_SETTINGS);
    setDailyGoal(8);
    setStreakData({ lastDate: '', current: 0, longest: 0 });
    setPomodoroCount(0);
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

  // Focus Mode
  if (showFocusMode) {
    return (
      <FocusMode
        timeLeft={timeLeft}
        isRunning={isRunning}
        mode={mode}
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
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NexusGK Focus
            </h1>
            
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
          <p className="text-white/60">Boost your productivity with the Pomodoro Technique</p>
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
        <footer className="text-center text-white/40 text-sm mt-8">
          <p>Inspired by <a href="https://beefocus.su/pomodoro" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">BeeFocus</a></p>
          <p className="mt-2">Built with React, TypeScript & Tailwind CSS</p>
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


import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { ModeSelector } from './components/ModeSelector';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { FocusSounds } from './components/FocusSounds';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TimerMode, Task, Session, Stats as StatsType } from './types';
import { Settings, Github } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', []);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const handleTimerComplete = () => {
    // Play completion sound
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_c610232a3f.mp3');
    audio.play();

    // Send notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: mode === 'pomodoro' ? 'Time for a break!' : 'Time to focus!',
        icon: '/vite.svg',
      });
    }

    // Save session
    const newSession: Session = {
      id: Date.now().toString(),
      mode,
      duration: mode === 'pomodoro' ? 25 : mode === 'shortBreak' ? 5 : 15,
      completedAt: new Date(),
    };
    setSessions([...sessions, newSession]);

    // Auto-switch modes
    if (mode === 'pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setMode(newCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      setMode('pomodoro');
    }
  };

  const { timeLeft, isRunning, progress, start, pause, reset } = useTimer(
    mode,
    handleTimerComplete
  );

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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

  // Calculate stats
  const stats: StatsType = {
    totalSessions: sessions.length,
    totalMinutes: sessions.reduce((acc, session) => acc + session.duration, 0),
    todaySessions: sessions.filter(
      (session) =>
        new Date(session.completedAt).toDateString() === new Date().toDateString()
    ).length,
    todayMinutes: sessions
      .filter(
        (session) =>
          new Date(session.completedAt).toDateString() === new Date().toDateString()
      )
      .reduce((acc, session) => acc + session.duration, 0),
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            NexusGK Focus
          </h1>
          <p className="text-white/60">Boost your productivity with the Pomodoro Technique</p>
        </header>

        {/* Stats */}
        <Stats stats={stats} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Timer Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <ModeSelector currentMode={mode} onModeChange={setMode} />
            </div>
            <Timer
              timeLeft={timeLeft}
              isRunning={isRunning}
              progress={progress}
              mode={mode}
              onStart={start}
              onPause={pause}
              onReset={reset}
            />
            <FocusSounds />
          </div>

          {/* Tasks Section */}
          <div>
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white/40 text-sm">
          <p>Inspired by <a href="https://beefocus.su/pomodoro" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">BeeFocus</a></p>
          <p className="mt-2">Built with React, TypeScript & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;


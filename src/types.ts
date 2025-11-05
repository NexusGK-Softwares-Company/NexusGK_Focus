export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodorosCompleted: number;
  pomodorosEstimated: number;
  notes?: string;
}

export interface Session {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
  taskId?: string;
}

export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  todaySessions: number;
  todayMinutes: number;
}

export interface Theme {
  name: string;
  gradient: string;
  primary: string;
  secondary: string;
}


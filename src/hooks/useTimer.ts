import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode } from '../types';

interface TimerDurations {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export const useTimer = (
  mode: TimerMode,
  durations: TimerDurations,
  onComplete: () => void,
  autoStart: boolean = false
) => {
  const DURATIONS = {
    pomodoro: durations.pomodoro * 60,
    shortBreak: durations.shortBreak * 60,
    longBreak: durations.longBreak * 60,
  };

  const [timeLeft, setTimeLeft] = useState(DURATIONS[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(DURATIONS[mode]);
    if (autoStart) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [mode, autoStart]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return DURATIONS[mode];
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, onComplete]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  }, [mode, DURATIONS]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    onComplete();
  }, [onComplete]);

  const progress = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;

  return { timeLeft, isRunning, progress, start, pause, reset, skip };
};


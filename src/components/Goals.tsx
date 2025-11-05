import React from 'react';
import { Target, TrendingUp, Flame } from 'lucide-react';

interface GoalsProps {
  dailyGoal: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  onSetGoal: (goal: number) => void;
}

export const Goals: React.FC<GoalsProps> = ({
  dailyGoal,
  completedToday,
  currentStreak,
  longestStreak,
  onSetGoal,
}) => {
  const progress = (completedToday / dailyGoal) * 100;
  const [isEditing, setIsEditing] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState(dailyGoal);

  const handleSave = () => {
    onSetGoal(newGoal);
    setIsEditing(false);
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Target size={24} className="text-primary" />
          Daily Goal
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="20"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value) || 1)}
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
            />
            <span>pomodoros/day</span>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg transition-all"
          >
            Save Goal
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>
                {completedToday} / {dailyGoal} pomodoros
              </span>
              <span>{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-400" />
                <span className="text-sm text-white/60">Current Streak</span>
              </div>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-400" />
                <span className="text-sm text-white/60">Best Streak</span>
              </div>
              <p className="text-2xl font-bold">{longestStreak} days</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Check, Trash2, Edit2, Circle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask({
        title: newTaskTitle,
        completed: false,
        pomodorosCompleted: 0,
        pomodorosEstimated: estimatedPomodoros,
      });
      setNewTaskTitle('');
      setEstimatedPomodoros(1);
      setIsAdding(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Tasks</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-full flex items-center gap-2 transition-all"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What are you working on?"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
            autoFocus
          />
          <div className="flex items-center gap-3">
            <label className="text-sm">Est. Pomodoros:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="ml-auto bg-secondary hover:bg-secondary-dark px-6 py-2 rounded-lg transition-all"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTaskTitle('');
              }}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-center text-white/60 py-8">No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`glass-hover p-4 rounded-xl flex items-center gap-3 group ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={16} />
                  </div>
                ) : (
                  <Circle size={24} className="text-white/40 hover:text-white/80" />
                )}
              </button>
              
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </p>
                <p className="text-sm text-white/60">
                  {task.pomodorosCompleted} / {task.pomodorosEstimated} pomodoros
                </p>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Session } from '../types';
import { Clock, Coffee, Waves, Calendar } from 'lucide-react';

interface SessionHistoryProps {
  sessions: Session[];
  onClose: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, onClose }) => {
  const groupSessionsByDate = () => {
    const groups: { [key: string]: Session[] } = {};
    
    sessions.forEach((session) => {
      const date = new Date(session.completedAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    });

    return Object.entries(groups).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'pomodoro':
        return <Clock size={16} className="text-red-400" />;
      case 'shortBreak':
        return <Coffee size={16} className="text-green-400" />;
      case 'longBreak':
        return <Waves size={16} className="text-blue-400" />;
    }
  };

  const getModeName = (mode: string) => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const groupedSessions = groupSessionsByDate();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Calendar size={32} />
            Session History
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            Close
          </button>
        </div>

        {groupedSessions.length === 0 ? (
          <p className="text-center text-white/60 py-12">
            No sessions yet. Complete your first pomodoro to see it here!
          </p>
        ) : (
          <div className="space-y-6">
            {groupedSessions.map(([date, sessions]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold mb-3 text-secondary">
                  {date === new Date().toLocaleDateString() ? 'Today' : date}
                </h3>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="glass-hover p-4 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getModeIcon(session.mode)}
                        <div>
                          <p className="font-medium">{getModeName(session.mode)}</p>
                          <p className="text-sm text-white/60">
                            {session.duration} minutes
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">
                        {new Date(session.completedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-white/60 pl-4">
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''} •{' '}
                  {sessions.reduce((acc, s) => acc + s.duration, 0)} minutes
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


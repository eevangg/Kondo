import React from 'react';
import { Sparkles, CheckCircle2, Flame, Plus, Clock, Trash2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CleaningTab({
  roommates,
  cleaningTasks,
  onOpenModal,
  onToggleTaskCleaned,
  onDeleteCleaningTask
}) {
  const handleMarkCleaned = (task) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onToggleTaskCleaned(task.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-purple)" /> Household Cleaning Tracker
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track "Last Cleaned" timestamps, recurring room schedules, and build cleaning streaks together.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('cleaning')}>
          <Plus size={16} /> Add Cleaning Task
        </button>
      </div>

      {/* Chore Cards Grid */}
      <div className="grid-cols-2">
        {cleaningTasks.map((task) => {
          const cleaner = roommates.find((r) => r.id === task.last_cleaned_by);
          const lastCleanedDate = task.last_cleaned_at
            ? new Date(task.last_cleaned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Never';

          return (
            <div key={task.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{task.task_name}</h4>
                  <span className="badge badge-purple" style={{ marginTop: '0.2rem' }}>
                    {task.area} • Every {task.interval_days} days
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.8rem', gap: '0.2rem' }}>
                    <Flame size={14} color="#f59e0b" /> {task.streak || 0} Streak
                  </span>
                  <button
                    onClick={() => onDeleteCleaningTask(task.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Timestamp Details */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--accent-secondary)" /> Last Cleaned: <strong>{lastCleanedDate}</strong>
                {cleaner && <span style={{ color: cleaner.avatar_color }}>by {cleaner.name}</span>}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleMarkCleaned(task)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <CheckCircle2 size={16} /> Log as Cleaned Today!
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

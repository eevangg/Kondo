import React from 'react';
import { Sparkles, CheckCircle2, Flame, Plus, Clock, Trash2, Send, CheckSquare, Square } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CleaningTab({
  roommates,
  dailyRoutine,
  cleaningTasks,
  onToggleDailyItem,
  onOpenModal,
  onToggleTaskCleaned,
  onDeleteCleaningTask
}) {
  const bathroomTask = cleaningTasks.find((t) => t.area === 'Bathroom' || t.task_name.toLowerCase().includes('bathroom')) || cleaningTasks[0];
  const bathroomCleaner = roommates.find((r) => r.id === bathroomTask?.last_cleaned_by);
  const bathroomLastDate = bathroomTask?.last_cleaned_at
    ? new Date(bathroomTask.last_cleaned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Never';

  const handleMarkCleaned = (task) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onToggleTaskCleaned(task.id);
  };

  const handleShareTelegramRoutine = () => {
    let text = `🧹 *HOUSEHOLD CLEANING STATUS*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    text += `*DAILY ROUTINE*\n`;
    dailyRoutine.forEach((item) => {
      text += `${item.is_done ? '✅' : '❌'} ${item.title}\n`;
    });

    if (bathroomTask) {
      text += `\n*BATHROOM CLEANED LOG*\n`;
      text += `🧼 ${bathroomTask.task_name}: ${bathroomLastDate} ${bathroomCleaner ? `by ${bathroomCleaner.name}` : ''}\n`;
    }

    navigator.clipboard.writeText(text);
    alert('Routine summary copied to clipboard! Paste into your Telegram group chat.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header Card */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-purple)" /> Daily Routine & Bathroom Cleaning Tracker
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily checklist for trash & kitchen, timestamped logs for bathroom cleaning, and Telegram updates.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleShareTelegramRoutine}>
            <Send size={14} /> Share Routine to Telegram
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('cleaning')}>
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* 2 Column Layout: Daily Reminders vs Long-Term Cleaning Log */}
      <div className="grid-cols-2">
        
        {/* Column 1: Daily Checklist Widget */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckSquare size={18} color="var(--accent-secondary)" /> Daily Checklist
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resets Daily</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dailyRoutine.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleDailyItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  background: item.is_done ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.25)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (item.is_done ? 'rgba(16,185,129,0.3)' : 'var(--border-glass)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.is_done ? (
                  <CheckSquare size={20} color="var(--status-success)" />
                ) : (
                  <Square size={20} color="var(--text-muted)" />
                )}
                <span style={{ fontSize: '0.95rem', fontWeight: 600, textDecoration: item.is_done ? 'line-through' : 'none', color: item.is_done ? 'var(--text-muted)' : 'var(--text-main)' }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Bathroom Log & Deep Clean Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cleaningTasks.map((task) => {
            const cleaner = roommates.find((r) => r.id === task.last_cleaned_by);
            const lastCleanedDate = task.last_cleaned_at
              ? new Date(task.last_cleaned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Never';

            return (
              <div key={task.id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{task.task_name}</h4>
                    <span className="badge badge-purple" style={{ marginTop: '0.2rem' }}>
                      {task.area} • Every {task.interval_days} days
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem', gap: '0.2rem' }}>
                      <Flame size={12} color="#f59e0b" /> {task.streak || 0} Streak
                    </span>
                    <button
                      onClick={() => onDeleteCleaningTask(task.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="var(--accent-secondary)" /> Last Cleaned: <strong>{lastCleanedDate}</strong>
                  {cleaner && <span style={{ color: cleaner.avatar_color }}>by {cleaner.name}</span>}
                </div>

                <button
                  onClick={() => handleMarkCleaned(task)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={14} /> Log as Cleaned Today!
                </button>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

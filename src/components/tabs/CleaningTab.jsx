import React from 'react';
import { Sparkles, CheckCircle2, Plus, Flame, Trash2, Send } from 'lucide-react';
import { sendTelegramMessage } from '../../lib/telegram';

export default function CleaningTab({
  roommates,
  dailyRoutine,
  cleaningTasks,
  onToggleDailyItem,
  onOpenModal,
  onToggleTaskCleaned,
  onDeleteCleaningTask,
  onShowToast
}) {
  const handleShareCleaningTelegram = async (task) => {
    const cleaner = roommates.find((r) => r.id === task.last_cleaned_by);
    const cleanerName = cleaner ? cleaner.name : 'Roommate';
    const text = `🧹 ${cleanerName} cleaned ${task.task_name}!`;

    const result = await sendTelegramMessage(text);
    if (onShowToast) {
      onShowToast({
        type: result.success ? 'success' : 'error',
        message: result.success ? result.message : result.error
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* SECTION 1: Daily Routine Checklist */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--status-success)" /> Daily Household Checklist
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Quick daily routine tasks for you and your roommate.
            </p>
          </div>
        </div>

        <div className="grid-cols-2">
          {dailyRoutine.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleDailyItem(item.id)}
              className="sub-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                opacity: item.is_done ? 0.75 : 1
              }}
            >
              <input
                type="checkbox"
                checked={item.is_done}
                onChange={() => {}}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                textDecoration: item.is_done ? 'line-through' : 'none',
                color: item.is_done ? 'var(--text-muted)' : 'var(--text-main)'
              }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Deep Cleaning Schedule */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-purple)" /> Deep Cleaning Log & Streaks
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Track bathroom cleanings and major chore rotations.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('cleaning')}>
            <Plus size={14} /> Add Chore Task
          </button>
        </div>

        <div className="grid-cols-2">
          {cleaningTasks.map((task) => {
            const lastCleaner = roommates.find((r) => r.id === task.last_cleaned_by);
            
            // Format DATE ONLY (No time string!)
            let lastDate = 'Not logged yet';
            if (task.last_cleaned_at) {
              const d = new Date(task.last_cleaned_at);
              lastDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            }

            return (
              <div key={task.id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-purple" style={{ marginBottom: '0.2rem' }}>{task.area}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{task.task_name}</h4>
                  </div>
                  <button
                    onClick={() => onDeleteCleaningTask(task.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="sub-card" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Last cleaned: <strong style={{ color: lastCleaner ? lastCleaner.avatar_color : 'var(--text-main)' }}>{lastDate}</strong>
                  {lastCleaner && ` by ${lastCleaner.name}`}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--status-warning)', fontWeight: 700 }}>
                    <Flame size={15} /> {task.streak || 0} Cleaning Streak
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleShareCleaningTelegram(task)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', gap: '0.2rem' }}
                      title="Share Cleaning Update to Telegram"
                    >
                      <Send size={12} /> Telegram
                    </button>
                    <button
                      onClick={() => onToggleTaskCleaned(task.id)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                      <CheckCircle2 size={13} /> Mark Cleaned
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

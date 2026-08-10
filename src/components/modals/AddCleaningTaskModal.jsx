import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

export default function AddCleaningTaskModal({ isOpen, onClose, onAddCleaningTask }) {
  const [taskName, setTaskName] = useState('');
  const [area, setArea] = useState('Bathroom');
  const [intervalDays, setIntervalDays] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName) return;

    onAddCleaningTask({
      task_name: taskName,
      area,
      interval_days: parseInt(intervalDays, 10),
      last_cleaned_at: null,
      last_cleaned_by: null,
      streak: 0
    });

    setTaskName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Household Chore</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Chore Title</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Deep Clean Shower, Mop Kitchen Floor, Take Trash Out"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Area / Room</label>
              <select className="glass-input" value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="Bathroom">Bathroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Living Room">Living Room</option>
                <option value="Balcony / Exterior">Balcony / Exterior</option>
                <option value="Common Area">Common Area</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Repeat Frequency</label>
              <select className="glass-input" value={intervalDays} onChange={(e) => setIntervalDays(e.target.value)}>
                <option value={1}>Daily</option>
                <option value={3}>Every 3 Days</option>
                <option value={7}>Weekly (7 Days)</option>
                <option value={14}>Bi-Weekly (14 Days)</option>
                <option value={30}>Monthly (30 Days)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Save Chore</button>
          </div>
        </form>
      </div>
    </div>
  );
}

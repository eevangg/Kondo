import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check, Bell } from 'lucide-react';

export default function AddEventModal({ isOpen, onClose, activeRoommateId, onAddEvent }) {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [reminderTiming, setReminderTiming] = useState('1 day before');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !eventDate) return;

    onAddEvent({
      title,
      event_date: eventDate,
      category,
      reminder_timing: reminderTiming,
      notes,
      added_by: activeRoommateId
    });

    setTitle('');
    setEventDate('');
    setReminderTiming('1 day before');
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Household Event</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Event Title</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Maintenance Visit, Professional Cleaning, Pest Control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Date & Time</label>
              <input
                type="datetime-local"
                className="glass-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Maintenance">Maintenance Visit</option>
                <option value="Cleaning">Professional Cleaning</option>
                <option value="Condo Admin">Condo Admin / Inspection</option>
                <option value="Deliveries">Deliveries & Visitors</option>
                <option value="General">General Event</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <Bell size={14} color="var(--accent-secondary)" /> Telegram Bot Reminder Timing
            </label>
            <select className="glass-input" value={reminderTiming} onChange={(e) => setReminderTiming(e.target.value)}>
              <option value="Immediate">Instant Alert (Notify on create)</option>
              <option value="1 hour before">1 Hour Before Event</option>
              <option value="1 day before">1 Day Before Event</option>
              <option value="Morning of event (8:00 AM)">Morning of Event (8:00 AM)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Notes / Instructions (Optional)</label>
            <textarea
              className="glass-input"
              rows={2}
              placeholder="e.g. Technician arriving at 9:00 AM, please ensure unit is open"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
}

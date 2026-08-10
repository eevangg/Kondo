import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Check, Send } from 'lucide-react';

export default function PresenceModal({ isOpen, onClose, activeRoommate, presenceState, onSavePresence }) {
  const currentPresence = presenceState[activeRoommate.id] || { status: 'At Condo', return_time: null };

  const [status, setStatus] = useState(currentPresence.status);
  const [returnTime, setReturnTime] = useState(currentPresence.return_time || '');

  useEffect(() => {
    setStatus(currentPresence.status);
    setReturnTime(currentPresence.return_time || '');
  }, [currentPresence, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePresence(activeRoommate.id, {
      status,
      return_time: status === 'Away' ? (returnTime || null) : null
    });
    onClose();
  };

  const handleCopyTelegram = () => {
    let text = `📍 *ROOMMATE PRESENCE UPDATE*\n`;
    text += `👤 *${activeRoommate.name}*: ${status === 'Away' ? '🔴 Away' : '🟢 At Condo'}\n`;
    if (status === 'Away' && returnTime) {
      const formatted = new Date(returnTime).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      text += `⏱️ *Expected Back*: ${formatted}\n`;
    }

    navigator.clipboard.writeText(text);
    alert('Presence status copied to clipboard for Telegram!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color={activeRoommate.avatar_color} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Presence Status</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Current Location for <strong style={{ color: activeRoommate.avatar_color }}>{activeRoommate.name}</strong>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${status === 'At Condo' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatus('At Condo')}
                style={{ flex: 1, gap: '0.4rem', justifyContent: 'center' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> At Condo
              </button>
              <button
                type="button"
                className={`btn ${status === 'Away' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setStatus('Away')}
                style={{ flex: 1, gap: '0.4rem', justifyContent: 'center' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Away
              </button>
            </div>
          </div>

          {status === 'Away' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Expected Return Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                className="glass-input"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {returnTime
                  ? 'Status will automatically revert to "At Condo" when this time passes.'
                  : 'If left blank, status will remain "Away" until you manually change it back.'}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={handleCopyTelegram} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
              <Send size={12} /> Telegram
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm"><Check size={14} /> Save Status</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, MapPin, Send } from 'lucide-react';
import { sendTelegramMessage } from '../../lib/telegram';

export default function PresenceModal({ isOpen, onClose, activeRoommate, presenceState, onSavePresence, onShowToast }) {
  const currentPresence = presenceState[activeRoommate.id] || { status: 'At Condo', return_time: null };
  
  const [status, setStatus] = useState(currentPresence.status);
  const [hasReturnTime, setHasReturnTime] = useState(Boolean(currentPresence.return_time));
  const [returnTime, setReturnTime] = useState(
    currentPresence.return_time ? new Date(currentPresence.return_time).toISOString().slice(0, 16) : ''
  );

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalPresence = {
      status,
      return_time: status === 'Away' && hasReturnTime && returnTime ? new Date(returnTime).toISOString() : null
    };

    onSavePresence(activeRoommate.id, finalPresence);

    // Telegram Notification
    let text = `🏠 *HOMESYNC PRESENCE UPDATE*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    if (status === 'Away') {
      text += `🔴 *${activeRoommate.name}* is currently *Away* from the condo.\n`;
      if (finalPresence.return_time) {
        const returnFormatted = new Date(finalPresence.return_time).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        text += `⏱️ *Expected Return*: ${returnFormatted}\n`;
      }
    } else {
      text += `🟢 *${activeRoommate.name}* is now *At Condo*!\n`;
    }

    const result = await sendTelegramMessage(text);
    if (onShowToast) {
      onShowToast({
        type: result.success ? 'success' : 'error',
        message: result.success ? result.message : result.error
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Update Condo Presence Status</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Your Current Status</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${status === 'At Condo' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatus('At Condo')}
                style={{ flex: 1, padding: '0.6rem' }}
              >
                🟢 At Condo
              </button>
              <button
                type="button"
                className={`btn ${status === 'Away' ? 'badge-danger' : 'btn-secondary'}`}
                onClick={() => setStatus('Away')}
                style={{ flex: 1, padding: '0.6rem' }}
              >
                🔴 Away (Weekend / Trip)
              </button>
            </div>
          </div>

          {status === 'Away' && (
            <div className="sub-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={hasReturnTime}
                  onChange={(e) => setHasReturnTime(e.target.checked)}
                />
                Set Expected Return Date & Time
              </label>

              {hasReturnTime && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="glass-input"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    required={hasReturnTime}
                  />
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    *Status will automatically flip back to "At Condo" when this time passes.
                  </p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Send size={15} /> Save & Send Telegram Alert
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

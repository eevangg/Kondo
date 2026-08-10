import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';

export default function PinSecurityModal({ isOpen, onClose, targetRoommate, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !targetRoommate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === targetRoommate.pin || pin === '1234') { // Fallback demo PIN
      setError('');
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect 4-Digit PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color={targetRoommate.avatar_color} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Security Verification</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', textAlign: 'center' }}>
          Enter PIN for <strong style={{ color: targetRoommate.avatar_color }}>{targetRoommate.name}</strong> to authenticate:
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input
              type="password"
              maxLength={4}
              className="glass-input"
              style={{ fontSize: '1.8rem', letterSpacing: '0.5em', textAlign: 'center' }}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.8rem', color: 'var(--status-danger)', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Verify PIN</button>
          </div>
        </form>
      </div>
    </div>
  );
}

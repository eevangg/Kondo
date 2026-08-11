import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function PinSecurityModal({ isOpen, onClose, targetRoommate, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !targetRoommate) return null;

  const handlePinChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setPin(cleaned);
    setError('');

    // AUTO-SUBMIT when 6th digit is typed!
    if (cleaned.length === 6) {
      if (cleaned === targetRoommate.pin) {
        onSuccess();
        setPin('');
        setError('');
        onClose();
      } else {
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 6) return;

    if (pin === targetRoommate.pin) {
      onSuccess();
      setPin('');
      setError('');
      onClose();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <Lock size={26} color={targetRoommate.avatar_color} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--text-main)' }}>
          Switch Profile to <span style={{ color: targetRoommate.avatar_color }}>{targetRoommate.name}</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Enter {targetRoommate.name}'s 6-digit PIN (Auto-submits on 6th digit)
        </p>

        {error && (
          <div style={{ fontSize: '0.8rem', color: 'var(--status-danger)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <AlertTriangle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoFocus
            className="glass-input"
            style={{ textAlign: 'center', fontSize: '1.6rem', letterSpacing: '0.4rem', fontWeight: 800 }}
            placeholder="••••••"
            value={pin}
            onChange={(e) => handlePinChange(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.25rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

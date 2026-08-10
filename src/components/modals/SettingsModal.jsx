import React, { useState } from 'react';
import { X, Settings, Key, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  activeRoommate,
  onUpdatePin,
  onShowToast
}) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  if (!isOpen) return null;

  const handleUpdatePinSubmit = (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (currentPin !== activeRoommate.pin) {
      setPinError('Incorrect current PIN. Please try again.');
      return;
    }

    if (newPin.length < 6) {
      setPinError('New PIN must be 6 digits.');
      return;
    }

    onUpdatePin(activeRoommate.id, newPin);
    setPinSuccess('🔑 Security PIN updated successfully!');
    setCurrentPin('');
    setNewPin('');
    if (onShowToast) onShowToast({ type: 'success', message: 'Security PIN updated successfully!' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Security Settings</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Change Security PIN Form */}
        <div className="sub-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
            <Key size={18} color="var(--status-warning)" /> Change Security PIN ({activeRoommate?.name})
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Enter your current 6-digit PIN and choose a new PIN.
          </p>

          {pinError && (
            <div style={{ fontSize: '0.8rem', color: 'var(--status-danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={15} /> {pinError}
            </div>
          )}

          {pinSuccess && (
            <div style={{ fontSize: '0.8rem', color: 'var(--status-success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={15} /> {pinSuccess}
            </div>
          )}

          <form onSubmit={handleUpdatePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Current PIN
              </label>
              <input
                type="password"
                maxLength={6}
                className="glass-input"
                placeholder="••••••"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                New PIN
              </label>
              <input
                type="password"
                maxLength={6}
                className="glass-input"
                placeholder="••••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm"><Check size={14} /> Update Security PIN</button>
            </div>
          </form>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Done</button>
        </div>

      </div>
    </div>
  );
}

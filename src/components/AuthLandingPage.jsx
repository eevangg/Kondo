import React, { useState } from 'react';
import { Lock, ShieldCheck, UserCheck, AlertTriangle, Sparkles } from 'lucide-react';

export default function AuthLandingPage({ roommates, onLoginSuccess }) {
  const [selectedRoommateId, setSelectedRoommateId] = useState(roommates[0]?.id || 'r1');
  const [pin, setPin] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [error, setError] = useState('');

  const selectedRoommate = roommates.find((r) => r.id === selectedRoommateId) || roommates[0];

  const handlePinChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setPin(cleaned);
    setError('');

    // Auto-Submit on typing 6th digit!
    if (cleaned.length === 6) {
      if (cleaned === selectedRoommate.pin) {
        onLoginSuccess(selectedRoommate.id, stayLoggedIn);
        setPin('');
        setError('');
      } else {
        setError('Incorrect 6-digit security PIN. Please try again.');
        setPin('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 6) return;

    if (pin === selectedRoommate.pin) {
      onLoginSuccess(selectedRoommate.id, stayLoggedIn);
      setPin('');
      setError('');
    } else {
      setError('Incorrect 6-digit security PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.18), transparent 45%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15), transparent 45%), var(--bg-surface)'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2rem 1.75rem',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-glass)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <img
              src="/favicon.svg"
              alt="Kondo Logo"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))'
              }}
            />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Kondo
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Condo OS Security Portal
          </p>
        </div>

        {/* Profile Selector Cards */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select Roommate Profile:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {roommates.map((r) => {
              const isSelected = r.id === selectedRoommateId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoommateId(r.id);
                    setPin('');
                    setError('');
                  }}
                  className="sub-card"
                  style={{
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    border: isSelected ? `2px solid ${r.avatar_color}` : '1px solid var(--border-sub-card)',
                    background: isSelected ? 'var(--bg-glass-strong)' : 'var(--bg-sub-card)',
                    cursor: 'pointer',
                    borderRadius: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: r.avatar_color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    {r.initials}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{r.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.telegram_handle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Verification Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem', textAlign: 'center' }}>
              Enter 6-Digit PIN for <span style={{ color: selectedRoommate.avatar_color }}>{selectedRoommate.name}</span>
            </label>
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
          </div>

          {error && (
            <div style={{ fontSize: '0.8rem', color: 'var(--status-danger)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* Stay Logged In Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <input
              type="checkbox"
              id="stayLogged"
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="stayLogged" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Stay logged in on this browser (Remember Me)
            </label>
          </div>
        </form>

      </div>
    </div>
  );
}

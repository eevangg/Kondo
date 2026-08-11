import React from 'react';
import { Home, UserCheck, Sparkles, MapPin, Sun, Moon, Settings, LogOut } from 'lucide-react';

export default function Navbar({
  roommates,
  activeRoommateId,
  presenceState,
  theme,
  onToggleTheme,
  onOpenPresenceModal,
  onOpenSettingsModal,
  onLogout
}) {
  const activeRoommate = roommates.find((r) => r.id === activeRoommateId) || roommates[0];
  const presence = presenceState[activeRoommate.id] || { status: 'At Condo', return_time: null };
  const isAway = presence.status === 'Away';

  let returnSubtext = '';
  if (isAway && presence.return_time) {
    returnSubtext = new Date(presence.return_time).toLocaleString(undefined, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <header className="glass-card" style={{ borderRadius: '20px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/homesync_logo.jpg"
            alt="HomeSync Logo"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.35)',
              border: '1px solid var(--border-glass)',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                HomeSync
              </h1>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                <Sparkles size={11} /> Roommate OS
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Shared Expense, Pantry, Chore & Maintenance Hub
            </p>
          </div>
        </div>

        {/* Right Section: Clean Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Active User Presence Button */}
          <button
            onClick={onOpenPresenceModal}
            className={`btn btn-sm ${isAway ? 'badge-danger' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', gap: '0.35rem', padding: '0.35rem 0.75rem' }}
            title="Click to update your status"
          >
            <MapPin size={13} color={isAway ? 'var(--status-danger)' : 'var(--status-success)'} />
            <span>{isAway ? 'Status: Away' : 'Status: At Condo'}</span>
            {returnSubtext && (
              <span style={{ fontSize: '0.68rem', opacity: 0.85, marginLeft: '0.15rem' }}>
                ({returnSubtext})
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle Slider Switch */}
          <div
            onClick={() => onToggleTheme()}
            className="theme-slider-track"
            role="switch"
            aria-checked={theme === 'dark'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleTheme();
              }
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <div className={`theme-slider-icon-bg ${theme === 'light' ? 'hidden' : ''}`}>
              <Sun size={12} color="#ffffff" />
            </div>

            <div className={`theme-slider-icon-bg ${theme === 'dark' ? 'hidden' : ''}`}>
              <Moon size={12} color="#ffffff" />
            </div>

            <div className="theme-slider-thumb">
              {theme === 'dark' ? (
                <Moon size={13} color="#ffffff" className="theme-knob-icon-moon" />
              ) : (
                <Sun size={13} color="#ffffff" className="theme-knob-icon-sun" />
              )}
            </div>
          </div>

          {/* Security Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%', width: '36px', height: '36px' }}
            title="Security PIN Settings"
          >
            <Settings size={17} color="var(--accent-primary)" />
          </button>

          {/* Static Logged In Profile Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--bg-glass-strong)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${activeRoommate.avatar_color}`
            }}
          >
            <UserCheck size={14} color={activeRoommate.avatar_color} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Logged in:</span>
            <strong style={{ color: activeRoommate.avatar_color, fontSize: '0.85rem', fontWeight: 700 }}>
              {activeRoommate.name}
            </strong>
          </div>

          {/* Log Out Button */}
          <button
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.7rem', gap: '0.3rem', borderRadius: 'var(--radius-md)', color: 'var(--status-danger)', fontSize: '0.78rem', fontWeight: 600 }}
            title="Log Out & Lock App"
          >
            <LogOut size={15} /> Log Out
          </button>

        </div>
      </div>
    </header>
  );
}

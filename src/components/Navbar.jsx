import React from 'react';
import { Home, UserCheck, Sparkles, MapPin, Sun, Moon, Settings, LogOut } from 'lucide-react';

export default function Navbar({
  roommates,
  activeRoommateId,
  setActiveRoommateId,
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
    <header className="glass-card" style={{ borderRadius: '0 0 20px 20px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src="/homesync_logo.jpg"
            alt="HomeSync Logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.35)',
              border: '1px solid var(--border-glass)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                HomeSync
              </h1>
              <span className="badge badge-purple">
                <Sparkles size={12} /> Roommate OS
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Shared Expense, Pantry, Chore & Maintenance Hub
            </p>
          </div>
        </div>

        {/* Right Section: Clean Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Active User Presence Button */}
          <button
            onClick={onOpenPresenceModal}
            className={`btn btn-sm ${isAway ? 'badge-danger' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', gap: '0.4rem', padding: '0.4rem 0.85rem' }}
            title="Click to update your status"
          >
            <MapPin size={14} color={isAway ? 'var(--status-danger)' : 'var(--status-success)'} />
            <span>{isAway ? 'My Status: Away' : 'My Status: At Condo'}</span>
            {returnSubtext && (
              <span style={{ fontSize: '0.7rem', opacity: 0.85, marginLeft: '0.2rem' }}>
                ({returnSubtext})
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
            title="Security PIN Settings"
          >
            <Settings size={18} color="var(--accent-primary)" />
          </button>

          {/* Active Roommate Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass-strong)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
            <UserCheck size={16} color={activeRoommate.avatar_color} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Logged as:</span>
            <select
              value={activeRoommateId}
              onChange={(e) => setActiveRoommateId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeRoommate.avatar_color,
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {roommates.map((r) => (
                <option key={r.id} value={r.id} style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Log Out Button */}
          <button
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px', color: 'var(--status-danger)' }}
            title="Log Out & Lock App"
          >
            <LogOut size={18} />
          </button>

        </div>
      </div>
    </header>
  );
}

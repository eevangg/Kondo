import React from 'react';
import { Home, Database, UserCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({
  roommates,
  activeRoommateId,
  setActiveRoommateId,
  isSupabaseConnected,
  onOpenConfigModal
}) {
  const activeRoommate = roommates.find((r) => r.id === activeRoommateId) || roommates[0];

  return (
    <header className="glass-card" style={{ borderRadius: '0 0 20px 20px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Home size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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

        {/* Right Section: Database Status & Active Roommate Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Supabase Status Pill */}
          <button
            onClick={onOpenConfigModal}
            className="btn btn-secondary btn-sm"
            title="Configure Supabase Database"
            style={{ fontSize: '0.8rem', gap: '0.4rem' }}
          >
            <Database size={15} color={isSupabaseConnected ? '#10b981' : '#f59e0b'} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {isSupabaseConnected ? (
                <>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                  Supabase Live
                </>
              ) : (
                <>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                  Configure Supabase
                </>
              )}
            </span>
          </button>

          {/* Active Roommate Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
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
                <option key={r.id} value={r.id} style={{ background: '#111827', color: '#ffffff' }}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </header>
  );
}

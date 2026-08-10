import React, { useState } from 'react';
import { Database, X, Check, Key, ExternalLink, Code } from 'lucide-react';

export default function SupabaseConfigModal({ isOpen, onClose, onSave }) {
  const [url, setUrl] = useState(localStorage.getItem('homesync_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('homesync_supabase_anon_key') || '');
  const [showSchema, setShowSchema] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('homesync_supabase_url', url.trim());
    localStorage.setItem('homesync_supabase_anon_key', key.trim());
    onSave(url.trim(), key.trim());
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('homesync_supabase_url');
    localStorage.removeItem('homesync_supabase_anon_key');
    setUrl('');
    setKey('');
    onSave('', '');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Supabase Cloud Connection</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          HomeSync connects directly to your <strong>Supabase</strong> project to provide real-time updates across all roommate devices.
        </p>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Supabase Project URL
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              className="glass-input"
              placeholder="eyJhY... (anon key)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          {/* Database SQL Info Box */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 700, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code size={16} /> Database Migration Script
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                Supabase Dashboard <ExternalLink size={12} />
              </a>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Run the included <code>supabase_schema.sql</code> file in your Supabase SQL Editor to create all 8 roommate tables automatically.
            </p>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            {url && (
              <button type="button" onClick={handleClear} className="btn btn-danger btn-sm">
                Disconnect
              </button>
            )}
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Save & Connect
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

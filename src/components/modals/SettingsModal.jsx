import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Database, Send, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials } from '../../lib/supabase';
import { getTelegramCredentials, saveTelegramCredentials, sendTelegramMessage } from '../../lib/telegram';

export default function SettingsModal({
  isOpen,
  onClose,
  activeRoommate,
  onUpdatePin,
  onSavedSupabase,
  onSavedTelegram,
  onShowToast
}) {
  // Supabase state
  const initialSupa = getSupabaseCredentials();
  const [supaUrl, setSupaUrl] = useState(initialSupa.url);
  const [supaKey, setSupaKey] = useState(initialSupa.key);

  // Telegram state
  const initialTele = getTelegramCredentials();
  const [teleToken, setTeleToken] = useState(initialTele.token);
  const [teleChatId, setTeleChatId] = useState(initialTele.chatId);
  const [testingTele, setTestingTele] = useState(false);

  // PIN state (Auto-submits on typing 4th digit of new PIN)
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  if (!isOpen) return null;

  const isAdminAndre = activeRoommate?.id === 'r1' || activeRoommate?.name === 'Andre';

  // Handle New PIN Input & Auto-Submit
  const handleNewPinChange = (val) => {
    // Only allow numbers, max 4 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setNewPin(cleaned);
    setPinError('');
    setPinSuccess('');

    if (cleaned.length === 4) {
      if (currentPin !== activeRoommate.pin) {
        setPinError('Incorrect current PIN. Please try again.');
        setCurrentPin('');
        setNewPin('');
        return;
      }

      // Valid PIN - Auto Submit!
      onUpdatePin(activeRoommate.id, cleaned);
      setPinSuccess('🔑 Security PIN updated successfully!');
      setCurrentPin('');
      setNewPin('');
      if (onShowToast) onShowToast({ type: 'success', message: 'Security PIN updated successfully!' });
    }
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(supaUrl, supaKey);
    if (onSavedSupabase) onSavedSupabase();
    if (onShowToast) onShowToast({ type: 'success', message: 'Supabase credentials saved!' });
  };

  const handleSaveTelegram = (e) => {
    e.preventDefault();
    saveTelegramCredentials(teleToken, teleChatId);
    if (onSavedTelegram) onSavedTelegram();
    if (onShowToast) onShowToast({ type: 'success', message: 'Telegram Bot settings saved!' });
  };

  const handleTestTelegram = async () => {
    if (!teleToken || !teleChatId) {
      if (onShowToast) onShowToast({ type: 'error', message: 'Please enter Bot Token & Chat ID before testing.' });
      return;
    }

    setTestingTele(true);
    saveTelegramCredentials(teleToken, teleChatId);
    const result = await sendTelegramMessage('🤖 *HomeSync Test Message*: Telegram Bot connection successful!');
    setTestingTele(false);

    if (onShowToast) {
      onShowToast({
        type: result.success ? 'success' : 'error',
        message: result.success ? result.message : result.error
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {isAdminAndre ? 'System Settings & Security' : 'Security Settings'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* SECTION 1: Change Security PIN (Available for both roommates) */}
          <div className="sub-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <Key size={18} color="var(--status-warning)" /> Change Security PIN ({activeRoommate?.name})
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Type your old 4-digit PIN first. The new PIN will <strong>auto-submit</strong> immediately upon typing the 4th digit!
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Current PIN (4 digits)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  className="glass-input"
                  placeholder="••••"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  New PIN (Auto-submits)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  disabled={currentPin.length < 4}
                  className="glass-input"
                  placeholder={currentPin.length < 4 ? 'Enter old PIN first' : '••••'}
                  value={newPin}
                  onChange={(e) => handleNewPinChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ADMIN ONLY SECTIONS (Andre) */}
          {isAdminAndre && (
            <>
              {/* SECTION 2: Supabase Credentials */}
              <div className="sub-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <Database size={18} color="var(--status-success)" /> Supabase Database Credentials
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Connect your live Supabase project to enable real-time multi-device syncing.
                </p>

                <form onSubmit={handleSaveSupabase} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Project URL</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supaUrl}
                      onChange={(e) => setSupaUrl(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Anon Public Key</label>
                    <input
                      type="password"
                      className="glass-input"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supaKey}
                      onChange={(e) => setSupaKey(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <button type="submit" className="btn btn-primary btn-sm"><Check size={14} /> Save Supabase Keys</button>
                  </div>
                </form>
              </div>

              {/* SECTION 3: Telegram Bot Setup */}
              <div className="sub-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <Send size={18} color="var(--accent-secondary)" /> Telegram Bot Configuration
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Automated messaging bot credentials for your group chat.
                </p>

                <form onSubmit={handleSaveTelegram} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Bot Token (@BotFather)</label>
                    <input
                      type="password"
                      className="glass-input"
                      placeholder="7123456789:ABCdefGhI..."
                      value={teleToken}
                      onChange={(e) => setTeleToken(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Group Chat ID (@myidbot)</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="-100123456789 (include minus - sign)"
                      value={teleChatId}
                      onChange={(e) => setTeleChatId(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <button type="button" onClick={handleTestTelegram} disabled={testingTele} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
                      <Send size={13} /> {testingTele ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm"><Check size={14} /> Save Telegram Keys</button>
                  </div>
                </form>
              </div>
            </>
          )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Done</button>
        </div>

      </div>
    </div>
  );
}

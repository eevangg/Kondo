import React, { useState } from 'react';
import { X, Send, Check, Key, MessageSquare, ExternalLink } from 'lucide-react';
import { getTelegramCredentials, saveTelegramCredentials, clearTelegramCredentials, sendTelegramMessage } from '../../lib/telegram';

export default function TelegramConfigModal({ isOpen, onClose, onSaved }) {
  const initial = getTelegramCredentials();
  const [token, setToken] = useState(initial.token);
  const [chatId, setChatId] = useState(initial.chatId);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveTelegramCredentials(token, chatId);
    if (onSaved) onSaved();
    onClose();
  };

  const handleTest = async () => {
    if (!token || !chatId) {
      alert('Please enter both Bot Token and Chat ID before testing.');
      return;
    }

    setTesting(true);
    saveTelegramCredentials(token, chatId);
    const success = await sendTelegramMessage('🤖 *HomeSync Test Message*: Telegram Bot connection successful!');
    setTesting(false);
  };

  const handleDisconnect = () => {
    clearTelegramCredentials();
    setToken('');
    setChatId('');
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Send size={22} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Telegram Bot Integration</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Connect your Telegram Bot to send automated parent bill statements, event notifications, and presence status updates directly to your group chat!
        </p>

        {/* Credentials Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Telegram Bot Token (from @BotFather)
            </label>
            <input
              type="password"
              className="glass-input"
              placeholder="7123456789:ABCdefGhI..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Group Chat ID (from @myidbot)
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="-100123456789 (must include minus - sign)"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
          </div>

          {/* Quick Guide Card */}
          <div className="sub-card" style={{ fontSize: '0.8rem', background: 'var(--bg-glass-strong)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>Quick Setup Reminder:</span>
            </div>
            <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li>Bot Token: Send <code>/newbot</code> to <strong>@BotFather</strong> on Telegram.</li>
              <li>Chat ID: Add <strong>@myidbot</strong> to your group and send <code>/getgroupid@myidbot</code>.</li>
              <li>Add your new bot to your group chat as a member!</li>
            </ol>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {initial.isConfigured && (
              <button type="button" onClick={handleDisconnect} className="btn btn-danger btn-sm">
                Disconnect Bot
              </button>
            )}
            <button type="button" onClick={handleTest} disabled={testing} className="btn btn-secondary btn-sm" style={{ gap: '0.3rem' }}>
              <Send size={14} /> {testing ? 'Sending...' : 'Test Connection'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm"><Check size={14} /> Save Telegram Settings</button>
          </div>
        </form>

      </div>
    </div>
  );
}

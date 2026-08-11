import React, { useState } from 'react';
import { X, ArrowUpRight, Check, ArrowRightLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CURRENCY_SYMBOL } from '../../lib/defaultData';

export default function SettleUpModal({ isOpen, onClose, roommates, expenses, settlements, onSettleUp }) {
  const r1 = roommates[0] || { id: 'r1', name: 'Andre' };
  const r2 = roommates[1] || { id: 'r2', name: 'Gerard' };

  let r1PaidTotal = 0;
  let r2PaidTotal = 0;

  expenses.forEach((exp) => {
    const amt = Number(exp.amount) || 0;
    if (exp.paid_by === r1.id) {
      r1PaidTotal += exp.split_type === 'full' ? amt : amt / 2;
    } else if (exp.paid_by === r2.id) {
      r2PaidTotal += exp.split_type === 'full' ? amt : amt / 2;
    }
  });

  settlements.forEach((s) => {
    const amt = Number(s.amount) || 0;
    if (s.payer_id === r1.id && s.payee_id === r2.id) r1PaidTotal += amt;
    else if (s.payer_id === r2.id && s.payee_id === r1.id) r2PaidTotal += amt;
  });

  const netBalance = r1PaidTotal - r2PaidTotal; // > 0: r2 owes r1, < 0: r1 owes r2
  const defaultPayerId = netBalance > 0 ? r2.id : r1.id;
  const defaultPayeeId = netBalance > 0 ? r1.id : r2.id;
  const suggestedAmount = Math.abs(netBalance).toFixed(2);

  const [payerId, setPayerId] = useState(defaultPayerId);
  const [payeeId, setPayeeId] = useState(defaultPayeeId);
  const [amount, setAmount] = useState(suggestedAmount);
  const [note, setNote] = useState('Settled shared balance via GCash / Maya');

  if (!isOpen) return null;

  const payer = roommates.find((r) => r.id === payerId) || r1;
  const payee = roommates.find((r) => r.id === payeeId) || r2;

  const handleSwapRoles = () => {
    setPayerId(payeeId);
    setPayeeId(payerId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onSettleUp({
      payer_id: payerId,
      payee_id: payeeId,
      amount: parseFloat(amount),
      note
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpRight size={20} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Settle Up Balances</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="sub-card" style={{ fontSize: '0.85rem' }}>
            Calculated Net Owed Balance: <strong style={{ color: 'var(--status-success)' }}>{CURRENCY_SYMBOL}{suggestedAmount}</strong>
          </div>

          {/* Single Swap Button & Role Indicator */}
          <div className="sub-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-glass-strong)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                  Payer (Sending)
                </span>
                <strong style={{ fontSize: '1.05rem', color: payer.avatar_color }}>{payer.name}</strong>
              </div>

              <button
                type="button"
                onClick={handleSwapRoles}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Click to swap Payer and Recipient"
              >
                <ArrowRightLeft size={18} color="var(--accent-primary)" />
              </button>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                  Recipient (Receiving)
                </span>
                <strong style={{ fontSize: '1.05rem', color: payee.avatar_color }}>{payee.name}</strong>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              *Click <ArrowRightLeft size={12} style={{ display: 'inline', margin: '0 2px' }} /> button to automatically swap who is paying whom.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Settlement Amount ({CURRENCY_SYMBOL})</label>
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              step="0.01"
              min="0"
              className="glass-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Payment Note</label>
            <input
              type="text"
              className="glass-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Record Settlement</button>
          </div>
        </form>
      </div>
    </div>
  );
}

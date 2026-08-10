import React, { useState } from 'react';
import { X, ArrowUpRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SettleUpModal({ isOpen, onClose, roommates, expenses, settlements, onSettleUp }) {
  const r1 = roommates[0] || { id: 'r1', name: 'Alex' };
  const r2 = roommates[1] || { id: 'r2', name: 'Sam' };

  let r1PaidTotal = 0;
  let r2PaidTotal = 0;

  expenses.forEach((exp) => {
    const amt = Number(exp.amount) || 0;
    if (exp.paid_by === r1.id) r1PaidTotal += amt / 2;
    else if (exp.paid_by === r2.id) r2PaidTotal += amt / 2;
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
  const [note, setNote] = useState('Settled shared balance via Venmo/Zelle');

  if (!isOpen) return null;

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
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontSize: '0.85rem' }}>
            Current Calculated Owed Balance: <strong style={{ color: 'var(--status-success)' }}>${suggestedAmount}</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Payer (Who Paid?)</label>
              <select className="glass-input" value={payerId} onChange={(e) => setPayerId(e.target.value)}>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Payee (Recipient)</label>
              <select className="glass-input" value={payeeId} onChange={(e) => setPayeeId(e.target.value)}>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Settlement Amount ($)</label>
            <input
              type="number"
              step="0.01"
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

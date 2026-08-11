import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';

export default function AddBillModal({ isOpen, onClose, roommates, activeRoommateId, onAddBill }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [paidBy, setPaidBy] = useState(activeRoommateId);
  const [isRecurring, setIsRecurring] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !dueDate) return;

    onAddBill({
      title,
      amount: parseFloat(amount),
      due_date: dueDate,
      category,
      paid_by: paidBy,
      is_paid: false,
      is_recurring: isRecurring,
      recurrence_interval: 'Monthly'
    });

    setTitle('');
    setAmount('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--status-warning)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Household Bill</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Bill Title</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Electric & Water, Fiber WiFi, Monthly Rent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Amount ($)</label>
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                step="0.01"
                min="0"
                className="glass-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Due Date</label>
              <input
                type="date"
                className="glass-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Utilities">Utilities (Electric/Water)</option>
                <option value="Internet">Internet / WiFi</option>
                <option value="Rent">Rent</option>
                <option value="Subscriptions">Streaming / Subscriptions</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Primary Payer</label>
              <select className="glass-input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="is_recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="is_recurring" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Recurring Monthly Bill
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Save Bill</button>
          </div>
        </form>
      </div>
    </div>
  );
}

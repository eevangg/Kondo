import React, { useState, useEffect } from 'react';
import { X, Calendar, Check } from 'lucide-react';

export default function EditBillModal({ isOpen, onClose, bill, roommates, onUpdateBill }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Utilities');
  const [paidBy, setPaidBy] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);
  const [recurrenceInterval, setRecurrenceInterval] = useState('Monthly');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (bill) {
      setTitle(bill.title || '');
      setAmount(bill.amount !== undefined && bill.amount !== null ? bill.amount : '');
      setDueDate(bill.due_date || '');
      setCategory(bill.category || 'Utilities');
      setPaidBy(bill.paid_by || (roommates[0] ? roommates[0].id : ''));
      setIsRecurring(bill.is_recurring !== undefined ? bill.is_recurring : true);
      setRecurrenceInterval(bill.recurrence_interval || 'Monthly');
      setRemarks(bill.remarks || '');
    }
  }, [bill, roommates]);

  if (!isOpen || !bill) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || amount === '' || !dueDate) return;

    onUpdateBill({
      ...bill,
      title,
      amount: parseFloat(amount),
      due_date: dueDate,
      category,
      paid_by: paidBy || null,
      is_recurring: isRecurring,
      recurrence_interval: recurrenceInterval,
      remarks
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Edit Household Bill</h2>
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
                <option value="Monthly Dues">Monthly Dues</option>
                <option value="Subscriptions">Streaming / Subscriptions</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Primary Payer</label>
              <select className="glass-input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                <option value="">Unassigned</option>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Remarks / Notes</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Account No. 12345, due on 1st of month"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="edit_is_recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="edit_is_recurring" style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Recurring Bill
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

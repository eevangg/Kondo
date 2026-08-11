import React, { useState } from 'react';
import { X, Receipt, Check } from 'lucide-react';

export default function AddExpenseModal({ isOpen, onClose, roommates, activeRoommateId, onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [paidBy, setPaidBy] = useState(activeRoommateId);
  const [splitType, setSplitType] = useState('equal'); // 'equal' (50/50) or 'full' (100% owed to payer)

  if (!isOpen) return null;

  const payerObj = roommates.find((r) => r.id === paidBy) || roommates[0];
  const roommateObj = roommates.find((r) => r.id !== paidBy) || roommates[1];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAddExpense({
      description,
      amount: parseFloat(amount),
      category,
      paid_by: paidBy,
      split_type: splitType,
      expense_date: new Date().toISOString().split('T')[0]
    });

    setDescription('');
    setAmount('');
    setSplitType('equal');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Log Shared Expense</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Description</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Coffee for both of us, Groceries, Toiletries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Total Amount (₱)</label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Groceries">Groceries</option>
                <option value="Household">Household Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Dining & Coffee">Dining & Coffee</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Paid By</label>
              <select className="glass-input" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Expense Split Option</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${splitType === 'equal' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSplitType('equal')}
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                Equal 50/50 Split
              </button>
              <button
                type="button"
                className={`btn btn-sm ${splitType === 'full' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSplitType('full')}
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                100% Owed to {payerObj.name}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {splitType === 'equal'
                ? `Split 50/50: Each person pays 50% of the cost.`
                : `100% Owed: ${payerObj.name} paid, so ${roommateObj.name} owes ${payerObj.name} the full amount.`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Log Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}

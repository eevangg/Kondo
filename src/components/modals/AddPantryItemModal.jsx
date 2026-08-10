import React, { useState } from 'react';
import { X, ShoppingBag, Check, Bell } from 'lucide-react';

export default function AddPantryItemModal({ isOpen, onClose, onAddPantryItem }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dry Goods');
  const [stockLevel, setStockLevel] = useState('Full');
  const [expirationDate, setExpirationDate] = useState('');
  const [reminderDaysBefore, setReminderDaysBefore] = useState(1);
  const [autoAddShopping, setAutoAddShopping] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    onAddPantryItem({
      name,
      category,
      stock_level: stockLevel,
      expiration_date: expirationDate || null,
      reminder_days_before: Number(reminderDaysBefore),
      auto_add_shopping: autoAddShopping
    });

    setName('');
    setCategory('Dry Goods');
    setStockLevel('Full');
    setExpirationDate('');
    setReminderDaysBefore(1);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Pantry Item</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Item Name</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Eggs & Milk, Drinking Water Gallons, Rice"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Fridge">Fridge</option>
                <option value="Freezer">Freezer</option>
                <option value="Dry Goods">Dry Goods</option>
                <option value="Household Essentials">Household Essentials</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Initial Stock Level</label>
              <select className="glass-input" value={stockLevel} onChange={(e) => setStockLevel(e.target.value)}>
                <option value="Full">Full</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Out">Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Expiration Date (Optional)</label>
            <input
              type="date"
              className="glass-input"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          {expirationDate && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                <Bell size={14} color="var(--accent-secondary)" /> Telegram Expiration Reminder Timing
              </label>
              <select className="glass-input" value={reminderDaysBefore} onChange={(e) => setReminderDaysBefore(e.target.value)}>
                <option value={0}>On Expiration Day</option>
                <option value={1}>1 Day Before Expiration</option>
                <option value={3}>3 Days Before Expiration</option>
                <option value={7}>1 Week Before Expiration</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <input
              type="checkbox"
              id="autoAdd"
              checked={autoAddShopping}
              onChange={(e) => setAutoAddShopping(e.target.checked)}
            />
            <label htmlFor="autoAdd" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              Auto-add to Shopping List when stock becomes Low or Out
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Save Pantry Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

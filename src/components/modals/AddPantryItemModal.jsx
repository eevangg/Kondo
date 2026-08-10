import React, { useState } from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';

export default function AddPantryItemModal({ isOpen, onClose, onAddPantryItem }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pantry');
  const [stockLevel, setStockLevel] = useState('Full');
  const [expirationDate, setExpirationDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    onAddPantryItem({
      name,
      category,
      stock_level: stockLevel,
      expiration_date: expirationDate || null,
      auto_add_shopping: true
    });

    setName('');
    setExpirationDate('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Kitchen Pantry Item</h2>
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
              placeholder="e.g. Oat Milk, Coffee Beans, Olive Oil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
              <select className="glass-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Dairy/Refrigerated">Dairy / Cold</option>
                <option value="Pantry">Pantry Staples</option>
                <option value="Produce">Produce / Fresh</option>
                <option value="Household Supplies">Household Supplies</option>
                <option value="Snacks">Snacks & Beverages</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Initial Stock</label>
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

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

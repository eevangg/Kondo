import React, { useState } from 'react';
import { ShoppingBag, Plus, Check, Trash2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function PantryShoppingTab({
  pantryItems,
  shoppingItems,
  onOpenModal,
  onUpdatePantryStock,
  onToggleShoppingCompleted,
  onRestockFromShopping,
  onDeletePantryItem,
  onDeleteShoppingItem
}) {
  const [activeView, setActiveView] = useState('pantry');

  const lowOrOutCount = pantryItems.filter((i) => i.stock_level === 'Low' || i.stock_level === 'Out').length;
  const pendingShoppingCount = shoppingItems.filter((i) => !i.is_completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner Controls */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeView === 'pantry' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('pantry')}
          >
            <ShoppingBag size={16} /> Kitchen Pantry ({pantryItems.length})
            {lowOrOutCount > 0 && <span className="badge badge-warning" style={{ marginLeft: '0.3rem' }}>{lowOrOutCount} Low</span>}
          </button>
          <button
            className={`btn ${activeView === 'shopping' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('shopping')}
          >
            Shared Shopping List ({pendingShoppingCount})
          </button>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('pantry')}>
          <Plus size={14} /> Add Pantry Item
        </button>
      </div>

      {/* VIEW 1: Kitchen Pantry Inventory */}
      {activeView === 'pantry' && (
        <div className="grid-cols-2">
          {pantryItems.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '1.25rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category: {item.category}</span>
                </div>
                <button
                  onClick={() => onDeletePantryItem(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {item.expiration_date && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={12} color="var(--status-warning)" /> Expires: {item.expiration_date}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Level:</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {['Full', 'Medium', 'Low', 'Out'].map((level) => {
                    const isActive = item.stock_level === level;
                    let badgeClass = 'btn-secondary';
                    if (isActive) {
                      if (level === 'Full') badgeClass = 'badge-success';
                      else if (level === 'Medium') badgeClass = 'badge-info';
                      else if (level === 'Low') badgeClass = 'badge-warning';
                      else if (level === 'Out') badgeClass = 'badge-danger';
                    }

                    return (
                      <button
                        key={level}
                        onClick={() => onUpdatePantryStock(item.id, level)}
                        className={`btn btn-sm ${isActive ? badgeClass : 'btn-secondary'}`}
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Shared Grocery & Shopping List */}
      {activeView === 'shopping' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Grocery Shopping Checklist</h3>

            {shoppingItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <ShoppingBag size={36} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p>Shopping list is empty!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {shoppingItems.map((s) => (
                  <div
                    key={s.id}
                    className="sub-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: s.is_completed ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="checkbox"
                        checked={s.is_completed}
                        onChange={() => onToggleShoppingCompleted(s.id)}
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                      />
                      <div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: s.is_completed ? 'line-through' : 'none' }}>
                          {s.name}
                        </span>
                        <span className="badge badge-purple" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>
                          {s.category}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {s.pantry_item_id && (
                        <button
                          onClick={() => onRestockFromShopping(s)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                        >
                          <RefreshCw size={12} /> Restock to Pantry
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteShoppingItem(s.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

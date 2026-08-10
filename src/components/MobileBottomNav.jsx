import React from 'react';
import { LayoutDashboard, Calendar, Receipt, ShoppingBag, Sparkles, Plus } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onSwitchTab, onOpenAddExpense }) {
  return (
    <>
      {/* Mobile Floating Action Button (FAB +) */}
      <button
        onClick={onOpenAddExpense}
        className="mobile-fab-btn"
        title="Log Expense Quickly"
      >
        <Plus size={24} color="#ffffff" />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => onSwitchTab('overview')}
        >
          <LayoutDashboard size={20} />
          <span>Home</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => onSwitchTab('events')}
        >
          <Calendar size={20} />
          <span>Events</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => onSwitchTab('expenses')}
        >
          <Receipt size={20} />
          <span>Expenses</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'pantry' ? 'active' : ''}`}
          onClick={() => onSwitchTab('pantry')}
        >
          <ShoppingBag size={20} />
          <span>Pantry</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'cleaning' ? 'active' : ''}`}
          onClick={() => onSwitchTab('cleaning')}
        >
          <Sparkles size={20} />
          <span>Routine</span>
        </button>
      </nav>
    </>
  );
}

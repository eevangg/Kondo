import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardHeader from './components/DashboardHeader';
import SupabaseConfigModal from './components/SupabaseConfigModal';

import OverviewTab from './components/tabs/OverviewTab';
import ExpensesBillsTab from './components/tabs/ExpensesBillsTab';
import PantryShoppingTab from './components/tabs/PantryShoppingTab';
import CleaningTab from './components/tabs/CleaningTab';
import MaintenanceTab from './components/tabs/MaintenanceTab';

import AddExpenseModal from './components/modals/AddExpenseModal';
import AddBillModal from './components/modals/AddBillModal';
import AddPantryItemModal from './components/modals/AddPantryItemModal';
import AddCleaningTaskModal from './components/modals/AddCleaningTaskModal';
import AddMaintenanceModal from './components/modals/AddMaintenanceModal';
import SettleUpModal from './components/modals/SettleUpModal';

import {
  INITIAL_ROOMMATES,
  INITIAL_BILLS,
  INITIAL_EXPENSES,
  INITIAL_PANTRY,
  INITIAL_SHOPPING,
  INITIAL_CLEANING,
  INITIAL_MAINTENANCE
} from './lib/defaultData';
import { supabase, isSupabaseConnected, getSupabaseCredentials } from './lib/supabase';
import { LayoutDashboard, Receipt, ShoppingBag, Sparkles, Wrench } from 'lucide-react';

export default function App() {
  // Navigation & Roommate Context State
  const [activeTab, setActiveTab] = useState('overview');
  const [activeRoommateId, setActiveRoommateId] = useState('r1');
  const [dbConnected, setDbConnected] = useState(isSupabaseConnected);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'expense', 'bill', 'pantry', 'cleaning', 'maintenance', 'settle'

  // Application Data States (Initialized with LocalStorage or Defaults)
  const [roommates, setRoommates] = useState(INITIAL_ROOMMATES);

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('homesync_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('homesync_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [settlements, setSettlements] = useState(() => {
    const saved = localStorage.getItem('homesync_settlements');
    return saved ? JSON.parse(saved) : [];
  });

  const [pantryItems, setPantryItems] = useState(() => {
    const saved = localStorage.getItem('homesync_pantry');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [shoppingItems, setShoppingItems] = useState(() => {
    const saved = localStorage.getItem('homesync_shopping');
    return saved ? JSON.parse(saved) : INITIAL_SHOPPING;
  });

  const [cleaningTasks, setCleaningTasks] = useState(() => {
    const saved = localStorage.getItem('homesync_cleaning');
    return saved ? JSON.parse(saved) : INITIAL_CLEANING;
  });

  const [maintenanceIssues, setMaintenanceIssues] = useState(() => {
    const saved = localStorage.getItem('homesync_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('homesync_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('homesync_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('homesync_settlements', JSON.stringify(settlements)); }, [settlements]);
  useEffect(() => { localStorage.setItem('homesync_pantry', JSON.stringify(pantryItems)); }, [pantryItems]);
  useEffect(() => { localStorage.setItem('homesync_shopping', JSON.stringify(shoppingItems)); }, [shoppingItems]);
  useEffect(() => { localStorage.setItem('homesync_cleaning', JSON.stringify(cleaningTasks)); }, [cleaningTasks]);
  useEffect(() => { localStorage.setItem('homesync_maintenance', JSON.stringify(maintenanceIssues)); }, [maintenanceIssues]);

  // Attempt Supabase Fetch & Subscription if configured
  useEffect(() => {
    const creds = getSupabaseCredentials();
    setDbConnected(creds.isConfigured);

    if (creds.isConfigured && supabase) {
      const fetchData = async () => {
        try {
          const { data: bData } = await supabase.from('bills').select('*');
          if (bData && bData.length) setBills(bData);

          const { data: eData } = await supabase.from('expenses').select('*');
          if (eData && eData.length) setExpenses(eData);

          const { data: pData } = await supabase.from('pantry_items').select('*');
          if (pData && pData.length) setPantryItems(pData);

          const { data: sData } = await supabase.from('shopping_items').select('*');
          if (sData && sData.length) setShoppingItems(sData);

          const { data: cData } = await supabase.from('cleaning_tasks').select('*');
          if (cData && cData.length) setCleaningTasks(cData);

          const { data: mData } = await supabase.from('maintenance_issues').select('*');
          if (mData && mData.length) setMaintenanceIssues(mData);
        } catch (err) {
          console.warn('Supabase fetch notice (falling back to local state):', err.message);
        }
      };

      fetchData();
    }
  }, [dbConnected]);

  // --- Handlers ---
  const handleSaveSupabaseConfig = (url, key) => {
    const creds = getSupabaseCredentials();
    setDbConnected(creds.isConfigured);
  };

  // Bills Handlers
  const handleAddBill = (newBill) => {
    const item = { ...newBill, id: 'b_' + Date.now() };
    setBills((prev) => [item, ...prev]);
  };
  const handleToggleBillPaid = (id, isPaid) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, is_paid: isPaid } : b)));
  };
  const handleDeleteBill = (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  // Expenses & Settlements Handlers
  const handleAddExpense = (newExp) => {
    const item = { ...newExp, id: 'e_' + Date.now() };
    setExpenses((prev) => [item, ...prev]);
  };
  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };
  const handleSettleUp = (newSettlement) => {
    const item = { ...newSettlement, id: 's_' + Date.now(), settled_at: new Date().toISOString() };
    setSettlements((prev) => [item, ...prev]);
  };

  // Pantry & Shopping Handlers
  const handleAddPantryItem = (newItem) => {
    const item = { ...newItem, id: 'p_' + Date.now() };
    setPantryItems((prev) => [item, ...prev]);

    if (item.stock_level === 'Low' || item.stock_level === 'Out') {
      setShoppingItems((prev) => [
        { id: 'shop_' + Date.now(), name: item.name, category: item.category, is_completed: false, pantry_item_id: item.id, added_by: activeRoommateId },
        ...prev
      ]);
    }
  };

  const handleUpdatePantryStock = (id, newLevel) => {
    setPantryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, stock_level: newLevel };
          if ((newLevel === 'Low' || newLevel === 'Out') && !shoppingItems.some((s) => s.pantry_item_id === id && !s.is_completed)) {
            setShoppingItems((sPrev) => [
              { id: 'shop_' + Date.now(), name: item.name, category: item.category, is_completed: false, pantry_item_id: item.id, added_by: activeRoommateId },
              ...sPrev
            ]);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleDeletePantryItem = (id) => {
    setPantryItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleShoppingCompleted = (id) => {
    setShoppingItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_completed: !s.is_completed } : s)));
  };

  const handleRestockFromShopping = (shopItem) => {
    if (shopItem.pantry_item_id) {
      handleUpdatePantryStock(shopItem.pantry_item_id, 'Full');
    }
    setShoppingItems((prev) => prev.map((s) => (s.id === shopItem.id ? { ...s, is_completed: true } : s)));
  };

  const handleDeleteShoppingItem = (id) => {
    setShoppingItems((prev) => prev.filter((s) => s.id !== id));
  };

  // Cleaning Handlers
  const handleAddCleaningTask = (newTask) => {
    const item = { ...newTask, id: 'c_' + Date.now() };
    setCleaningTasks((prev) => [item, ...prev]);
  };

  const handleToggleTaskCleaned = (id) => {
    setCleaningTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            last_cleaned_at: new Date().toISOString(),
            last_cleaned_by: activeRoommateId,
            streak: (task.streak || 0) + 1
          };
        }
        return task;
      })
    );
  };

  const handleDeleteCleaningTask = (id) => {
    setCleaningTasks((prev) => prev.filter((c) => c.id !== id));
  };

  // Maintenance Handlers
  const handleAddMaintenanceIssue = (newIssue) => {
    const item = { ...newIssue, id: 'm_' + Date.now() };
    setMaintenanceIssues((prev) => [item, ...prev]);
  };

  const handleUpdateMaintenanceStatus = (id, newStatus) => {
    setMaintenanceIssues((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
  };

  const handleDeleteMaintenanceIssue = (id) => {
    setMaintenanceIssues((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="app-container">
      
      {/* Top Navbar */}
      <Navbar
        roommates={roommates}
        activeRoommateId={activeRoommateId}
        setActiveRoommateId={setActiveRoommateId}
        isSupabaseConnected={dbConnected}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Executive Dashboard Header */}
      <DashboardHeader
        roommates={roommates}
        activeRoommateId={activeRoommateId}
        bills={bills}
        expenses={expenses}
        settlements={settlements}
        pantryItems={pantryItems}
        maintenanceIssues={maintenanceIssues}
        onOpenModal={(type) => setActiveModal(type)}
      />

      {/* Main Tab Navigation Bar */}
      <div className="glass-card" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('overview')}
          style={{ flex: 1, minWidth: '130px' }}
        >
          <LayoutDashboard size={16} /> Executive Overview
        </button>
        <button
          className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('expenses')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Receipt size={16} /> Expenses & Bills
        </button>
        <button
          className={`btn ${activeTab === 'pantry' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('pantry')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <ShoppingBag size={16} /> Pantry & Shopping
        </button>
        <button
          className={`btn ${activeTab === 'cleaning' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('cleaning')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Sparkles size={16} /> Cleaning Tracker
        </button>
        <button
          className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('maintenance')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Wrench size={16} /> Home Repairs
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <OverviewTab
          roommates={roommates}
          bills={bills}
          expenses={expenses}
          pantryItems={pantryItems}
          cleaningTasks={cleaningTasks}
          maintenanceIssues={maintenanceIssues}
          onSwitchTab={setActiveTab}
          onOpenModal={(type) => setActiveModal(type)}
          onToggleBillPaid={handleToggleBillPaid}
          onToggleTaskCleaned={handleToggleTaskCleaned}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesBillsTab
          roommates={roommates}
          activeRoommateId={activeRoommateId}
          bills={bills}
          expenses={expenses}
          settlements={settlements}
          onOpenModal={(type) => setActiveModal(type)}
          onToggleBillPaid={handleToggleBillPaid}
          onDeleteExpense={handleDeleteExpense}
          onDeleteBill={handleDeleteBill}
        />
      )}

      {activeTab === 'pantry' && (
        <PantryShoppingTab
          pantryItems={pantryItems}
          shoppingItems={shoppingItems}
          onOpenModal={(type) => setActiveModal(type)}
          onUpdatePantryStock={handleUpdatePantryStock}
          onToggleShoppingCompleted={handleToggleShoppingCompleted}
          onRestockFromShopping={handleRestockFromShopping}
          onDeletePantryItem={handleDeletePantryItem}
          onDeleteShoppingItem={handleDeleteShoppingItem}
        />
      )}

      {activeTab === 'cleaning' && (
        <CleaningTab
          roommates={roommates}
          cleaningTasks={cleaningTasks}
          onOpenModal={(type) => setActiveModal(type)}
          onToggleTaskCleaned={handleToggleTaskCleaned}
          onDeleteCleaningTask={handleDeleteCleaningTask}
        />
      )}

      {activeTab === 'maintenance' && (
        <MaintenanceTab
          roommates={roommates}
          maintenanceIssues={maintenanceIssues}
          onOpenModal={(type) => setActiveModal(type)}
          onUpdateMaintenanceStatus={handleUpdateMaintenanceStatus}
          onDeleteMaintenanceIssue={handleDeleteMaintenanceIssue}
        />
      )}

      {/* Dialog Modals */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveSupabaseConfig}
      />

      <AddExpenseModal
        isOpen={activeModal === 'expense'}
        onClose={() => setActiveModal(null)}
        roommates={roommates}
        activeRoommateId={activeRoommateId}
        onAddExpense={handleAddExpense}
      />

      <AddBillModal
        isOpen={activeModal === 'bill'}
        onClose={() => setActiveModal(null)}
        roommates={roommates}
        activeRoommateId={activeRoommateId}
        onAddBill={handleAddBill}
      />

      <AddPantryItemModal
        isOpen={activeModal === 'pantry'}
        onClose={() => setActiveModal(null)}
        onAddPantryItem={handleAddPantryItem}
      />

      <AddCleaningTaskModal
        isOpen={activeModal === 'cleaning'}
        onClose={() => setActiveModal(null)}
        onAddCleaningTask={handleAddCleaningTask}
      />

      <AddMaintenanceModal
        isOpen={activeModal === 'maintenance'}
        onClose={() => setActiveModal(null)}
        roommates={roommates}
        activeRoommateId={activeRoommateId}
        onAddMaintenanceIssue={handleAddMaintenanceIssue}
      />

      <SettleUpModal
        isOpen={activeModal === 'settle'}
        onClose={() => setActiveModal(null)}
        roommates={roommates}
        expenses={expenses}
        settlements={settlements}
        onSettleUp={handleSettleUp}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardHeader from './components/DashboardHeader';
import ToastNotification from './components/ToastNotification';
import AuthLandingPage from './components/AuthLandingPage';
import MobileBottomNav from './components/MobileBottomNav';

import OverviewTab from './components/tabs/OverviewTab';
import ExpensesBillsTab from './components/tabs/ExpensesBillsTab';
import PantryShoppingTab from './components/tabs/PantryShoppingTab';
import CleaningTab from './components/tabs/CleaningTab';
import MaintenanceTab from './components/tabs/MaintenanceTab';
import EventsTab from './components/tabs/EventsTab';

import AddExpenseModal from './components/modals/AddExpenseModal';
import AddBillModal from './components/modals/AddBillModal';
import AddPantryItemModal from './components/modals/AddPantryItemModal';
import AddCleaningTaskModal from './components/modals/AddCleaningTaskModal';
import AddMaintenanceModal from './components/modals/AddMaintenanceModal';
import SettleUpModal from './components/modals/SettleUpModal';
import ParentBillExportModal from './components/modals/ParentBillExportModal';
import PresenceModal from './components/modals/PresenceModal';
import AddEventModal from './components/modals/AddEventModal';
import SettingsModal from './components/modals/SettingsModal';

import {
  CURRENCY_SYMBOL,
  INITIAL_ROOMMATES,
  INITIAL_EVENTS,
  INITIAL_BILLS,
  INITIAL_EXPENSES,
  INITIAL_PANTRY,
  INITIAL_SHOPPING,
  INITIAL_DAILY_ROUTINE,
  INITIAL_CLEANING,
  INITIAL_MAINTENANCE
} from './lib/defaultData';
import { supabase, isSupabaseConnected } from './lib/supabase';
import { sendTelegramMessage } from './lib/telegram';
import { LayoutDashboard, Receipt, ShoppingBag, Sparkles, Wrench, Calendar as CalendarIcon } from 'lucide-react';

export default function App() {
  // Roommates State with Automatic 6-Digit Migration
  const [roommates, setRoommates] = useState(() => {
    const saved = localStorage.getItem('homesync_roommates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((r) => ({
          ...r,
          pin: (r.pin && String(r.pin).length === 6) ? String(r.pin) : (r.id === 'r1' ? '123456' : '567890')
        }));
      } catch (e) {
        return INITIAL_ROOMMATES;
      }
    }
    return INITIAL_ROOMMATES;
  });

  useEffect(() => {
    localStorage.setItem('homesync_roommates', JSON.stringify(roommates));
  }, [roommates]);

  // Authentication & Session Persistence State
  const [authRoommateId, setAuthRoommateId] = useState(() => {
    return localStorage.getItem('homesync_auth_user') || sessionStorage.getItem('homesync_auth_user') || null;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [activeRoommateId, setActiveRoommateId] = useState(() => authRoommateId || 'r1');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Login Success Handler
  const handleLoginSuccess = (roommateId, stayLoggedIn) => {
    setAuthRoommateId(roommateId);
    setActiveRoommateId(roommateId);

    if (stayLoggedIn) {
      localStorage.setItem('homesync_auth_user', roommateId);
      sessionStorage.removeItem('homesync_auth_user');
    } else {
      sessionStorage.setItem('homesync_auth_user', roommateId);
      localStorage.removeItem('homesync_auth_user');
    }

    const rm = roommates.find((r) => r.id === roommateId);
    handleShowToast({ type: 'success', message: `Welcome back, ${rm ? rm.name : 'Roommate'}!` });
  };

  // Logout Handler
  const handleLogout = () => {
    setAuthRoommateId(null);
    localStorage.removeItem('homesync_auth_user');
    sessionStorage.removeItem('homesync_auth_user');
    handleShowToast({ type: 'success', message: 'Logged out & app locked.' });
  };

  // In-App Toast State
  const [toast, setToast] = useState(null);
  const handleShowToast = (toastObj) => setToast(toastObj);

  // Light / Dark Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('homesync_theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('homesync_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Presence Modal State
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);

  // Events State
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('homesync_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Presence State
  const [presenceState, setPresenceState] = useState(() => {
    const saved = localStorage.getItem('homesync_presence');
    return saved ? JSON.parse(saved) : {
      r1: { status: 'At Condo', return_time: null },
      r2: { status: 'At Condo', return_time: null }
    };
  });

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

  const [dailyRoutine, setDailyRoutine] = useState(() => {
    const saved = localStorage.getItem('homesync_daily_routine');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_ROUTINE;
  });

  const [cleaningTasks, setCleaningTasks] = useState(() => {
    const saved = localStorage.getItem('homesync_cleaning');
    return saved ? JSON.parse(saved) : INITIAL_CLEANING;
  });

  const [maintenanceIssues, setMaintenanceIssues] = useState(() => {
    const saved = localStorage.getItem('homesync_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  // LocalStorage Persistence
  useEffect(() => { localStorage.setItem('homesync_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('homesync_presence', JSON.stringify(presenceState)); }, [presenceState]);
  useEffect(() => { localStorage.setItem('homesync_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('homesync_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('homesync_settlements', JSON.stringify(settlements)); }, [settlements]);
  useEffect(() => { localStorage.setItem('homesync_pantry', JSON.stringify(pantryItems)); }, [pantryItems]);
  useEffect(() => { localStorage.setItem('homesync_shopping', JSON.stringify(shoppingItems)); }, [shoppingItems]);
  useEffect(() => { localStorage.setItem('homesync_daily_routine', JSON.stringify(dailyRoutine)); }, [dailyRoutine]);
  useEffect(() => { localStorage.setItem('homesync_cleaning', JSON.stringify(cleaningTasks)); }, [cleaningTasks]);
  useEffect(() => { localStorage.setItem('homesync_maintenance', JSON.stringify(maintenanceIssues)); }, [maintenanceIssues]);

  // Automatic Presence Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPresenceState((prev) => {
        let changed = false;
        const nextState = { ...prev };

        Object.keys(nextState).forEach((id) => {
          const userPres = nextState[id];
          if (userPres.status === 'Away' && userPres.return_time) {
            const returnDate = new Date(userPres.return_time);
            if (now >= returnDate) {
              nextState[id] = { status: 'At Condo', return_time: null };
              changed = true;
            }
          }
        });

        return changed ? nextState : prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Background Pantry Expiration Reminder Checker
  useEffect(() => {
    if (!authRoommateId) return;

    const checkPantryExpirations = async () => {
      const today = new Date();
      const notifiedKey = 'homesync_notified_expirations';
      const notified = JSON.parse(localStorage.getItem(notifiedKey) || '{}');

      for (const item of pantryItems) {
        if (item.expiration_date) {
          const expDate = new Date(item.expiration_date);
          const diffTime = expDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const reminderDays = item.reminder_days_before || 1;

          if (diffDays <= reminderDays && diffDays >= 0) {
            const itemKey = `${item.id}_${item.expiration_date}`;
            if (!notified[itemKey]) {
              const dateFormatted = expDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              const msg = `⚠️ Pantry Alert: ${item.name} is expiring on ${dateFormatted}!`;
              await sendTelegramMessage(msg);
              notified[itemKey] = true;
              localStorage.setItem(notifiedKey, JSON.stringify(notified));
            }
          }
        }
      }
    };

    checkPantryExpirations();
  }, [pantryItems, authRoommateId]);

  // Presence Save Handler
  const handleSavePresence = (roommateId, newPresence) => {
    setPresenceState((prev) => ({
      ...prev,
      [roommateId]: newPresence
    }));
  };

  // PIN Update Handler
  const handleUpdatePin = (roommateId, newPin) => {
    setRoommates((prev) =>
      prev.map((r) => (r.id === roommateId ? { ...r, pin: String(newPin) } : r))
    );
  };

  // Scheduled Event Handler
  const handleAddEvent = async (newEvent) => {
    const item = { ...newEvent, id: 'ev_' + Date.now() };
    setEvents((prev) => [item, ...prev]);
    handleShowToast({ type: 'success', message: 'Household event scheduled!' });

    const dateFormatted = new Date(newEvent.event_date).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const msg = `📅 Scheduled: ${newEvent.title} on ${dateFormatted}`;
    await sendTelegramMessage(msg);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleAddBill = (newBill) => {
    const item = { ...newBill, id: 'b_' + Date.now() };
    setBills((prev) => [item, ...prev]);
    handleShowToast({ type: 'success', message: 'Bill added successfully!' });
  };
  const handleToggleBillPaid = (id, isPaid) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, is_paid: isPaid, status: isPaid ? 'Paid by Parents' : 'Due' } : b)));
    handleShowToast({ type: 'success', message: isPaid ? 'Bill marked as Paid!' : 'Bill marked as Unpaid.' });
  };
  const handleDeleteBill = (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  // Expense Log Handler
  const handleAddExpense = async (newExp) => {
    const item = { ...newExp, id: 'e_' + Date.now() };
    setExpenses((prev) => [item, ...prev]);

    const payer = roommates.find((r) => r.id === newExp.paid_by) || roommates[0];
    const ower = roommates.find((r) => r.id !== newExp.paid_by) || roommates[1];

    const amt = Number(newExp.amount) || 0;
    const owedAmount = newExp.split_type === 'full' ? amt : amt / 2;

    const owerTag = ower.telegram_handle || ower.name;
    const payerName = payer.name;

    const formattedAmount = owedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
    const msg = `💸 ${owerTag} owes ${payerName} ${CURRENCY_SYMBOL}${formattedAmount} for ${newExp.description}`;

    const result = await sendTelegramMessage(msg);
    if (result.success) {
      handleShowToast({ type: 'success', message: 'Expense logged & sent to Telegram!' });
    } else {
      handleShowToast({ type: 'success', message: 'Expense logged locally!' });
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Settlement Handler
  const handleSettleUp = async (newSettlement) => {
    const item = { ...newSettlement, id: 's_' + Date.now(), settled_at: new Date().toISOString() };
    setSettlements((prev) => [item, ...prev]);

    const payer = roommates.find((r) => r.id === newSettlement.payer_id) || roommates[0];
    const payee = roommates.find((r) => r.id === newSettlement.payee_id) || roommates[1];

    const recipientTag = payee.telegram_handle || payee.name;
    const payerName = payer.name;
    const formattedAmount = Number(newSettlement.amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const noteSuffix = newSettlement.note ? ` (${newSettlement.note})` : '';

    const msg = `🤝 ${recipientTag} was paid ${CURRENCY_SYMBOL}${formattedAmount} by ${payerName}${noteSuffix}`;

    const result = await sendTelegramMessage(msg);
    if (result.success) {
      handleShowToast({ type: 'success', message: 'Settlement recorded & sent to Telegram!' });
    } else {
      handleShowToast({ type: 'success', message: 'Settlement recorded!' });
    }
  };

  const handleAddPantryItem = (newItem) => {
    const item = { ...newItem, id: 'p_' + Date.now() };
    setPantryItems((prev) => [item, ...prev]);

    if (item.stock_level === 'Low' || item.stock_level === 'Out') {
      setShoppingItems((prev) => [
        { id: 'shop_' + Date.now(), name: item.name, category: item.category, is_completed: false, pantry_item_id: item.id, added_by: activeRoommateId },
        ...prev
      ]);
    }
    handleShowToast({ type: 'success', message: 'Pantry item added!' });
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
    handleShowToast({ type: 'success', message: 'Item restocked to pantry!' });
  };

  const handleDeleteShoppingItem = (id) => {
    setShoppingItems((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleDailyItem = (id) => {
    setDailyRoutine((prev) => prev.map((item) => (item.id === id ? { ...item, is_done: !item.is_done } : item)));
  };

  const handleAddCleaningTask = (newTask) => {
    const item = { ...newTask, id: 'c_' + Date.now() };
    setCleaningTasks((prev) => [item, ...prev]);
    handleShowToast({ type: 'success', message: 'Cleaning chore task added!' });
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
    handleShowToast({ type: 'success', message: 'Chore marked as Cleaned!' });
  };

  const handleDeleteCleaningTask = (id) => {
    setCleaningTasks((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddMaintenanceIssue = (newIssue) => {
    const item = { ...newIssue, id: 'm_' + Date.now() };
    setMaintenanceIssues((prev) => [item, ...prev]);
    handleShowToast({ type: 'success', message: 'Repair request logged!' });
  };

  const handleUpdateMaintenanceStatus = (id, newStatus) => {
    setMaintenanceIssues((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
  };

  const handleDeleteMaintenanceIssue = (id) => {
    setMaintenanceIssues((prev) => prev.filter((m) => m.id !== id));
  };

  // If Not Authenticated ➔ Render Auth Landing Page Portal!
  if (!authRoommateId) {
    return <AuthLandingPage roommates={roommates} onLoginSuccess={handleLoginSuccess} />;
  }

  const activeRoommateObj = roommates.find((r) => r.id === activeRoommateId) || roommates[0];

  return (
    <div className="app-container">
      
      {/* Top Navbar */}
      <Navbar
        roommates={roommates}
        activeRoommateId={activeRoommateId}
        presenceState={presenceState}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenPresenceModal={() => setIsPresenceModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Executive Dashboard Header */}
      <DashboardHeader
        roommates={roommates}
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
          <LayoutDashboard size={16} /> Overview
        </button>
        <button
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('events')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <CalendarIcon size={16} /> Shared Events ({events.length})
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
          <ShoppingBag size={16} /> Pantry & Grocery
        </button>
        <button
          className={`btn ${activeTab === 'cleaning' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('cleaning')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Sparkles size={16} /> Cleaning Routine
        </button>
        <button
          className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('maintenance')}
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Wrench size={16} /> Repairs
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <OverviewTab
          roommates={roommates}
          activeRoommateId={activeRoommateId}
          presenceState={presenceState}
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

      {activeTab === 'events' && (
        <EventsTab
          roommates={roommates}
          events={events}
          onOpenModal={(type) => setActiveModal(type)}
          onDeleteEvent={handleDeleteEvent}
          onShowToast={handleShowToast}
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
          dailyRoutine={dailyRoutine}
          cleaningTasks={cleaningTasks}
          onToggleDailyItem={handleToggleDailyItem}
          onOpenModal={(type) => setActiveModal(type)}
          onToggleTaskCleaned={handleToggleTaskCleaned}
          onDeleteCleaningTask={handleDeleteCleaningTask}
          onShowToast={handleShowToast}
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
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        activeRoommate={activeRoommateObj}
        onUpdatePin={handleUpdatePin}
        onShowToast={handleShowToast}
      />

      <PresenceModal
        isOpen={isPresenceModalOpen}
        onClose={() => setIsPresenceModalOpen(false)}
        activeRoommate={activeRoommateObj}
        presenceState={presenceState}
        onSavePresence={handleSavePresence}
        onShowToast={handleShowToast}
      />

      <AddEventModal
        isOpen={activeModal === 'event'}
        onClose={() => setActiveModal(null)}
        activeRoommateId={activeRoommateId}
        onAddEvent={handleAddEvent}
      />

      <ParentBillExportModal
        isOpen={activeModal === 'parentSheet'}
        onClose={() => setActiveModal(null)}
        bills={bills}
        expenses={expenses}
        roommates={roommates}
        onShowToast={handleShowToast}
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

      {/* Mobile Bottom Navigation & Floating Action Button */}
      <MobileBottomNav
        activeTab={activeTab}
        onSwitchTab={setActiveTab}
        onOpenAddExpense={() => setActiveModal('expense')}
      />

      {/* In-App Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}

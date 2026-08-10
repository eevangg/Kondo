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
  INITIAL_DAILY_ROUTINE
} from './lib/defaultData';
import { supabase, isSupabaseConnected } from './lib/supabase';
import { sendTelegramMessage } from './lib/telegram';
import { LayoutDashboard, Receipt, ShoppingBag, Sparkles, Wrench, Calendar as CalendarIcon } from 'lucide-react';

export default function App() {
  // Roommates State
  const [roommates, setRoommates] = useState(INITIAL_ROOMMATES);

  // Authentication & Session Persistence State
  const [authRoommateId, setAuthRoommateId] = useState(() => {
    return localStorage.getItem('homesync_auth_user') || sessionStorage.getItem('homesync_auth_user') || null;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [activeRoommateId, setActiveRoommateId] = useState(() => authRoommateId || 'r1');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Database Driven States
  const [events, setEvents] = useState([]);
  const [presenceState, setPresenceState] = useState({
    r1: { status: 'At Condo', return_time: null },
    r2: { status: 'At Condo', return_time: null }
  });
  const [bills, setBills] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [dailyRoutine, setDailyRoutine] = useState(INITIAL_DAILY_ROUTINE);
  const [cleaningTasks, setCleaningTasks] = useState([]);
  const [maintenanceIssues, setMaintenanceIssues] = useState([]);

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
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);

  // Fetch All Initial Data from Supabase Database
  const fetchAllData = async () => {
    if (!isSupabaseConnected || !supabase) {
      console.warn('HomeSync: Supabase is not connected. Check Vercel environment variables.');
      return;
    }

    try {
      const { data: rmData, error: rmErr } = await supabase.from('roommates').select('*');
      if (rmErr) console.error('Supabase fetch error (roommates):', rmErr);
      if (rmData && rmData.length > 0) setRoommates(rmData);

      const { data: bData, error: bErr } = await supabase.from('bills').select('*').order('created_at', { ascending: false });
      if (bErr) console.error('Supabase fetch error (bills):', bErr);
      if (bData) setBills(bData);

      const { data: eData, error: eErr } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (eErr) console.error('Supabase fetch error (expenses):', eErr);
      if (eData) setExpenses(eData);

      const { data: sData, error: sErr } = await supabase.from('settlements').select('*').order('settled_at', { ascending: false });
      if (sErr) console.error('Supabase fetch error (settlements):', sErr);
      if (sData) setSettlements(sData);

      const { data: evData, error: evErr } = await supabase.from('events').select('*').order('event_date', { ascending: true });
      if (evErr) console.error('Supabase fetch error (events):', evErr);
      if (evData) setEvents(evData);

      const { data: pData, error: pErr } = await supabase.from('pantry_items').select('*').order('created_at', { ascending: false });
      if (pErr) console.error('Supabase fetch error (pantry_items):', pErr);
      if (pData) setPantryItems(pData);

      const { data: shopData, error: shopErr } = await supabase.from('shopping_items').select('*').order('created_at', { ascending: false });
      if (shopErr) console.error('Supabase fetch error (shopping_items):', shopErr);
      if (shopData) setShoppingItems(shopData);

      const { data: cData, error: cErr } = await supabase.from('cleaning_tasks').select('*').order('created_at', { ascending: false });
      if (cErr) console.error('Supabase fetch error (cleaning_tasks):', cErr);
      if (cData) setCleaningTasks(cData);

      const { data: mData, error: mErr } = await supabase.from('maintenance_issues').select('*').order('created_at', { ascending: false });
      if (mErr) console.error('Supabase fetch error (maintenance_issues):', mErr);
      if (mData) setMaintenanceIssues(mData);

      const { data: presData, error: presErr } = await supabase.from('presence').select('*');
      if (presErr) console.error('Supabase fetch error (presence):', presErr);
      if (presData && presData.length > 0) {
        const presObj = {};
        presData.forEach((row) => {
          presObj[row.roommate_id] = { status: row.status, return_time: row.return_time };
        });
        setPresenceState((prev) => ({ ...prev, ...presObj }));
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Supabase Realtime Multi-Device WebSockets Synchronization
  useEffect(() => {
    if (!isSupabaseConnected || !supabase) return;

    const channel = supabase
      .channel('homesync-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime change received:', payload);
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  // Presence Save Handler
  const handleSavePresence = async (roommateId, newPresence) => {
    setPresenceState((prev) => ({
      ...prev,
      [roommateId]: newPresence
    }));

    if (isSupabaseConnected && supabase) {
      await supabase.from('presence').upsert({
        roommate_id: roommateId,
        status: newPresence.status,
        return_time: newPresence.return_time,
        updated_at: new Date().toISOString()
      });
    }
  };

  // PIN Update Handler
  const handleUpdatePin = async (roommateId, newPin) => {
    setRoommates((prev) =>
      prev.map((r) => (r.id === roommateId ? { ...r, pin: String(newPin) } : r))
    );

    if (isSupabaseConnected && supabase) {
      await supabase.from('roommates').update({ pin: String(newPin) }).eq('id', roommateId);
    }
  };

  // Scheduled Event Handler
  const handleAddEvent = async (newEvent) => {
    const item = { ...newEvent, id: 'ev_' + Date.now() };
    setEvents((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      await supabase.from('events').insert(item);
    }

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

  const handleDeleteEvent = async (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('events').delete().eq('id', id);
    }
  };

  // Bill Management
  const handleAddBill = async (newBill) => {
    const item = { ...newBill, id: 'b_' + Date.now() };
    setBills((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      await supabase.from('bills').insert(item);
    }

    handleShowToast({ type: 'success', message: 'Bill added successfully!' });
  };

  const handleToggleBillPaid = async (id, isPaid) => {
    const targetBill = bills.find((b) => b.id === id);
    if (!targetBill) return;

    let updatedBill;
    if (isPaid && targetBill.is_recurring) {
      const currentDueDate = new Date(targetBill.due_date);
      currentDueDate.setMonth(currentDueDate.getMonth() + 1);
      const nextDueDateStr = currentDueDate.toISOString().slice(0, 10);

      let nextAmount = targetBill.amount;
      if (targetBill.title.toLowerCase().includes('electricity')) {
        const inputAmt = window.prompt(`Enter electricity bill amount for next month (${CURRENCY_SYMBOL}):`, targetBill.amount);
        if (inputAmt !== null && !isNaN(parseFloat(inputAmt))) {
          nextAmount = parseFloat(inputAmt);
        }
      }

      updatedBill = {
        ...targetBill,
        amount: nextAmount,
        is_paid: false,
        status: 'Due',
        due_date: nextDueDateStr
      };
    } else {
      updatedBill = {
        ...targetBill,
        is_paid: isPaid,
        status: isPaid ? 'Paid by Parents' : (new Date(targetBill.due_date) < new Date() ? 'Overdue' : 'Due')
      };
    }

    setBills((prev) => prev.map((b) => (b.id === id ? updatedBill : b)));

    if (isSupabaseConnected && supabase) {
      await supabase.from('bills').update(updatedBill).eq('id', id);
    }

    handleShowToast({
      type: 'success',
      message: isPaid ? 'Bill paid! Cycle renewed for next month.' : 'Bill status updated.'
    });
  };

  const handleDeleteBill = async (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('bills').delete().eq('id', id);
    }
  };

  // Expense Log Handler
  const handleAddExpense = async (newExp) => {
    const item = { ...newExp, id: 'e_' + Date.now(), expense_date: newExp.expense_date || new Date().toISOString().slice(0, 10) };
    setExpenses((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      const { error } = await supabase.from('expenses').insert(item);
      if (error) console.error('Supabase expense insert error:', error);
    }

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
      handleShowToast({ type: 'success', message: 'Expense logged!' });
    }
  };

  const handleDeleteExpense = async (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('expenses').delete().eq('id', id);
    }
  };

  // Settlement Handler
  const handleSettleUp = async (newSettlement) => {
    const item = { ...newSettlement, id: 's_' + Date.now(), settled_at: new Date().toISOString() };
    setSettlements((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      const { error } = await supabase.from('settlements').insert(item);
      if (error) console.error('Supabase settlement insert error:', error);
    }

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

  // Pantry & Grocery Management
  const handleAddPantryItem = async (newItem) => {
    const item = { ...newItem, id: 'p_' + Date.now() };
    setPantryItems((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      await supabase.from('pantry_items').insert(item);
    }

    if (item.stock_level === 'Low' || item.stock_level === 'Out') {
      const shopItem = { id: 'shop_' + Date.now(), name: item.name, category: item.category, is_completed: false, pantry_item_id: item.id, added_by: activeRoommateId };
      setShoppingItems((prev) => [shopItem, ...prev]);
      if (isSupabaseConnected && supabase) {
        await supabase.from('shopping_items').insert(shopItem);
      }
    }
    handleShowToast({ type: 'success', message: 'Pantry item added!' });
  };

  const handleUpdatePantryStock = async (id, newLevel) => {
    setPantryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock_level: newLevel } : item))
    );

    if (isSupabaseConnected && supabase) {
      await supabase.from('pantry_items').update({ stock_level: newLevel }).eq('id', id);
    }

    const item = pantryItems.find((i) => i.id === id);
    if (item && (newLevel === 'Low' || newLevel === 'Out') && !shoppingItems.some((s) => s.pantry_item_id === id && !s.is_completed)) {
      const shopItem = { id: 'shop_' + Date.now(), name: item.name, category: item.category, is_completed: false, pantry_item_id: id, added_by: activeRoommateId };
      setShoppingItems((sPrev) => [shopItem, ...sPrev]);
      if (isSupabaseConnected && supabase) {
        await supabase.from('shopping_items').insert(shopItem);
      }
    }
  };

  const handleDeletePantryItem = async (id) => {
    setPantryItems((prev) => prev.filter((i) => i.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('pantry_items').delete().eq('id', id);
    }
  };

  const handleToggleShoppingCompleted = async (id) => {
    const target = shoppingItems.find((s) => s.id === id);
    if (!target) return;
    const nextCompleted = !target.is_completed;

    setShoppingItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_completed: nextCompleted } : s)));

    if (isSupabaseConnected && supabase) {
      await supabase.from('shopping_items').update({ is_completed: nextCompleted }).eq('id', id);
    }
  };

  const handleRestockFromShopping = async (shopItem) => {
    if (shopItem.pantry_item_id) {
      await handleUpdatePantryStock(shopItem.pantry_item_id, 'Full');
    }
    await handleToggleShoppingCompleted(shopItem.id);
    handleShowToast({ type: 'success', message: 'Item restocked to pantry!' });
  };

  const handleDeleteShoppingItem = async (id) => {
    setShoppingItems((prev) => prev.filter((s) => s.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('shopping_items').delete().eq('id', id);
    }
  };

  const handleToggleDailyItem = (id) => {
    setDailyRoutine((prev) => prev.map((item) => (item.id === id ? { ...item, is_done: !item.is_done } : item)));
  };

  // Cleaning Chore Management
  const handleAddCleaningTask = async (newTask) => {
    const item = { ...newTask, id: 'c_' + Date.now() };
    setCleaningTasks((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      await supabase.from('cleaning_tasks').insert(item);
    }

    handleShowToast({ type: 'success', message: 'Cleaning chore task added!' });
  };

  const handleToggleTaskCleaned = async (id) => {
    const target = cleaningTasks.find((t) => t.id === id);
    if (!target) return;

    const updated = {
      ...target,
      last_cleaned_at: new Date().toISOString(),
      last_cleaned_by: activeRoommateId,
      streak: (target.streak || 0) + 1
    };

    setCleaningTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));

    if (isSupabaseConnected && supabase) {
      await supabase.from('cleaning_tasks').update(updated).eq('id', id);
    }

    handleShowToast({ type: 'success', message: 'Chore marked as Cleaned!' });
  };

  const handleDeleteCleaningTask = async (id) => {
    setCleaningTasks((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('cleaning_tasks').delete().eq('id', id);
    }
  };

  // Maintenance Management
  const handleAddMaintenanceIssue = async (newIssue) => {
    const item = { ...newIssue, id: 'm_' + Date.now() };
    setMaintenanceIssues((prev) => [item, ...prev]);

    if (isSupabaseConnected && supabase) {
      await supabase.from('maintenance_issues').insert(item);
    }

    handleShowToast({ type: 'success', message: 'Repair request logged!' });
  };

  const handleUpdateMaintenanceStatus = async (id, newStatus) => {
    setMaintenanceIssues((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));

    if (isSupabaseConnected && supabase) {
      await supabase.from('maintenance_issues').update({ status: newStatus }).eq('id', id);
    }
  };

  const handleDeleteMaintenanceIssue = async (id) => {
    setMaintenanceIssues((prev) => prev.filter((m) => m.id !== id));
    if (isSupabaseConnected && supabase) {
      await supabase.from('maintenance_issues').delete().eq('id', id);
    }
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

      {/* Desktop Web Main Tab Navigation Bar */}
      <div className="glass-card desktop-tab-nav" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('overview')}
          style={{ flex: 1, minWidth: '130px' }}
        >
          <LayoutDashboard size={16} /> Home Overview
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

      {/* Executive Dashboard Summary Header Cards (ONLY shown on Home Overview tab) */}
      {activeTab === 'overview' && (
        <DashboardHeader
          roommates={roommates}
          bills={bills}
          expenses={expenses}
          settlements={settlements}
          pantryItems={pantryItems}
          maintenanceIssues={maintenanceIssues}
          onOpenModal={(type) => setActiveModal(type)}
        />
      )}

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

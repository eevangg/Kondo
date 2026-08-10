import React from 'react';
import { DollarSign, Calendar, ShoppingBag, Sparkles, CheckCircle2, AlertTriangle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../lib/defaultData';

export default function OverviewTab({
  roommates,
  bills,
  expenses,
  pantryItems,
  cleaningTasks,
  maintenanceIssues,
  onSwitchTab,
  onOpenModal,
  onToggleBillPaid,
  onToggleTaskCleaned
}) {
  const pendingBills = bills.filter((b) => !b.is_paid);
  const lowStockPantry = pantryItems.filter((p) => p.stock_level === 'Low' || p.stock_level === 'Out');
  const pendingMaintenance = maintenanceIssues.filter((m) => m.status !== 'Done');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 2-Column Split: Upcoming Action Cards */}
      <div className="grid-cols-2">
        
        {/* Column 1: Unpaid Bills & Low Pantry Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Bills Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="var(--status-warning)" /> Pending Household Bills ({pendingBills.length})
              </h3>
              <button onClick={() => onSwitchTab('expenses')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                View All <ArrowRight size={12} />
              </button>
            </div>

            {pendingBills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--status-success)' }}>
                <CheckCircle2 size={32} style={{ marginBottom: '0.3rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>All bills are currently paid!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {pendingBills.slice(0, 3).map((bill) => (
                  <div
                    key={bill.id}
                    className="sub-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{bill.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due {bill.due_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--status-warning)' }}>
                        {CURRENCY_SYMBOL}{Number(bill.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => onToggleBillPaid(bill.id, true)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Mark Paid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Pantry Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} color="var(--accent-secondary)" /> Low Stock Pantry Alert ({lowStockPantry.length})
              </h3>
              <button onClick={() => onSwitchTab('pantry')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                View List <ArrowRight size={12} />
              </button>
            </div>

            {lowStockPantry.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--status-success)' }}>
                <CheckCircle2 size={32} style={{ marginBottom: '0.3rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Kitchen pantry is well stocked!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {lowStockPantry.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="sub-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                    </div>
                    <span className={`badge ${item.stock_level === 'Out' ? 'badge-danger' : 'badge-warning'}`}>
                      {item.stock_level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Column 2: Cleaning Chores & Maintenance Issues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Cleaning Chores Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--accent-purple)" /> Household Cleaning Status
              </h3>
              <button onClick={() => onSwitchTab('cleaning')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                Chore Log <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {cleaningTasks.slice(0, 3).map((task) => {
                const cleaner = roommates.find((r) => r.id === task.last_cleaned_by);
                const lastDate = task.last_cleaned_at ? new Date(task.last_cleaned_at).toLocaleDateString() : 'Never';

                return (
                  <div
                    key={task.id}
                    className="sub-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{task.task_name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Last cleaned: {lastDate} {cleaner ? `by ${cleaner.name}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleTaskCleaned(task.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                      <CheckCircle2 size={12} color="var(--status-success)" /> Done
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maintenance Issues Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="var(--status-danger)" /> Open Maintenance Requests ({pendingMaintenance.length})
              </h3>
              <button onClick={() => onSwitchTab('maintenance')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                View Repairs <ArrowRight size={12} />
              </button>
            </div>

            {pendingMaintenance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--status-success)' }}>
                <ShieldCheck size={32} style={{ marginBottom: '0.3rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No broken items reported!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {pendingMaintenance.slice(0, 3).map((issue) => (
                  <div
                    key={issue.id}
                    className="sub-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{issue.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issue.location}</span>
                    </div>
                    <span className={`badge ${issue.priority === 'Urgent' ? 'badge-danger' : issue.priority === 'Medium' ? 'badge-warning' : 'badge-info'}`}>
                      {issue.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

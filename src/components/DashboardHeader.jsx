import React from 'react';
import { DollarSign, Calendar, ShoppingBag, AlertTriangle, Plus, CheckCircle2, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../lib/defaultData';

export default function DashboardHeader({
  roommates,
  bills,
  expenses,
  settlements,
  pantryItems,
  maintenanceIssues,
  onOpenModal
}) {
  const r1 = roommates[0] || { id: 'r1', name: 'Roommate 1' };
  const r2 = roommates[1] || { id: 'r2', name: 'Roommate 2' };

  let r1PaidTotal = 0;
  let r2PaidTotal = 0;

  expenses.forEach((exp) => {
    const amt = Number(exp.amount) || 0;
    if (exp.paid_by === r1.id) {
      r1PaidTotal += exp.split_type === 'full' ? amt : amt / 2;
    } else if (exp.paid_by === r2.id) {
      r2PaidTotal += exp.split_type === 'full' ? amt : amt / 2;
    }
  });

  settlements.forEach((s) => {
    const amt = Number(s.amount) || 0;
    if (s.payer_id === r1.id && s.payee_id === r2.id) {
      r1PaidTotal += amt;
    } else if (s.payer_id === r2.id && s.payee_id === r1.id) {
      r2PaidTotal += amt;
    }
  });

  const netBalance = r1PaidTotal - r2PaidTotal;

  const pendingBills = bills.filter((b) => !b.is_paid).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const nextBill = pendingBills[0];
  const lowStockCount = pantryItems.filter((i) => i.stock_level === 'Low' || i.stock_level === 'Out').length;
  const urgentRepairsCount = maintenanceIssues.filter((m) => m.status !== 'Done' && m.priority === 'Urgent').length;

  return (
    <section style={{ marginBottom: '2rem' }}>
      
      {/* 4 Stat Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '1.25rem' }}>
        
        {/* Card 1: Splitwise Balance */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ROOMMATE BALANCE</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)' }}>
              <DollarSign size={18} color="var(--accent-primary)" />
            </div>
          </div>
          <div>
            {Math.abs(netBalance) < 0.01 ? (
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={18} /> All Settled Up
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{CURRENCY_SYMBOL}0.00 net balance</p>
              </div>
            ) : netBalance > 0 ? (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: r2.avatar_color }}>
                  {r2.name} owes {r1.name}
                </h3>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-success)' }}>
                  {CURRENCY_SYMBOL}{Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.2rem', color: r1.avatar_color }}>
                  {r1.name} owes {r2.name}
                </h3>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-warning)' }}>
                  {CURRENCY_SYMBOL}{Math.abs(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Next Due Bill */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NEXT DUE BILL</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Calendar size={18} color="var(--status-warning)" />
            </div>
          </div>
          {nextBill ? (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nextBill.title}
              </h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {CURRENCY_SYMBOL}{Number(nextBill.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--status-warning)', fontWeight: 600 }}>
                  Due {nextBill.due_date}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--status-success)' }}>All Bills Paid!</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No upcoming bills due</p>
            </div>
          )}
        </div>

        {/* Card 3: Pantry Low Stock */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PANTRY RESTOCK</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)' }}>
              <ShoppingBag size={18} color="var(--accent-secondary)" />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: lowStockCount > 0 ? 'var(--status-warning)' : 'var(--status-success)' }}>
              {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {lowStockCount > 0 ? 'Low or out of stock' : 'Pantry fully stocked'}
            </p>
          </div>
        </div>

        {/* Card 4: Urgent Maintenance */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>URGENT REPAIRS</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)' }}>
              <AlertTriangle size={18} color="var(--status-danger)" />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: urgentRepairsCount > 0 ? 'var(--status-danger)' : 'var(--status-success)' }}>
              {urgentRepairsCount} {urgentRepairsCount === 1 ? 'Issue' : 'Issues'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {urgentRepairsCount > 0 ? 'Requires immediate fix' : 'No broken items'}
            </p>
          </div>
        </div>

      </div>

      {/* Quick Action Button Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Actions:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('parentSheet')} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <FileSpreadsheet size={14} /> Parent Bill Sheet & Telegram
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('event')}>
            <Plus size={14} /> Schedule Event
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('bill')}>
            <Plus size={14} /> Add Bill
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('expense')}>
            <Plus size={14} /> Log Expense
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('settle')} style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
            <ArrowUpRight size={14} /> Settle Up
          </button>
        </div>
      </div>

    </section>
  );
}

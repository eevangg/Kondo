import React, { useState } from 'react';
import { DollarSign, Calendar, Plus, CheckCircle2, ArrowUpRight, Receipt, Repeat, Trash2, Pencil, History } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../lib/defaultData';

export default function ExpensesBillsTab({
  roommates,
  activeRoommateId,
  bills = [],
  billPayments = [],
  expenses = [],
  settlements = [],
  onOpenModal,
  onToggleBillPaid,
  onEditBill,
  onDeleteExpense,
  onDeleteBill,
  onDeleteBillPayment
}) {
  const [subTab, setSubTab] = useState('expenses');

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

  const netBalance = r1PaidTotal - r2PaidTotal; // > 0: r2 owes r1, < 0: r1 owes r2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Splitwise Balance Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Splitwise Balance Summary
            </span>
            {Math.abs(netBalance) < 0.01 ? (
              <h2 style={{ fontSize: '1.6rem', color: 'var(--status-success)', marginTop: '0.2rem' }}>
                All Settled Up ({CURRENCY_SYMBOL}0.00)
              </h2>
            ) : netBalance > 0 ? (
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                <span style={{ color: r2.avatar_color }}>{r2.name}</span> owes <span style={{ color: r1.avatar_color }}>{r1.name}</span>{' '}
                <span style={{ color: 'var(--status-success)', fontWeight: 800 }}>{CURRENCY_SYMBOL}{Math.abs(netBalance).toFixed(2)}</span>
              </h2>
            ) : (
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                <span style={{ color: r1.avatar_color }}>{r1.name}</span> owes <span style={{ color: r2.avatar_color }}>{r2.name}</span>{' '}
                <span style={{ color: 'var(--status-warning)', fontWeight: 800 }}>{CURRENCY_SYMBOL}{Math.abs(netBalance).toFixed(2)}</span>
              </h2>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Balances update dynamically whenever expenses or payments are added.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => onOpenModal('expense')}>
              <Plus size={16} /> Log Expense
            </button>
            <button className="btn btn-secondary" onClick={() => onOpenModal('settle')} style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
              <ArrowUpRight size={16} /> Settle Up
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tab Switching Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          className={`btn btn-sm ${subTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('expenses')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Receipt size={14} /> Shared Expenses ({expenses.length})
        </button>
        <button
          className={`btn btn-sm ${subTab === 'bills' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('bills')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Calendar size={14} /> Recurring Bills ({bills.length})
        </button>
        <button
          className={`btn btn-sm ${subTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('payments')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <History size={14} /> Bill Payment Log ({billPayments.length})
        </button>
        <button
          className={`btn btn-sm ${subTab === 'settlements' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('settlements')}
          style={{ whiteSpace: 'nowrap' }}
        >
          <CheckCircle2 size={14} /> Settlement Log ({settlements.length})
        </button>
      </div>

      {/* SUB TAB 1: Shared Expenses List */}
      {subTab === 'expenses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Shared Expense Records</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('expense')}>
              <Plus size={14} /> Add Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Receipt size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No shared expenses logged yet.</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '0.75rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '0.75rem' }}>Date</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem' }}>Split Type</th>
                    <th style={{ padding: '0.75rem' }}>Paid By</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total Cost</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => {
                    const payer = roommates.find((r) => r.id === exp.paid_by) || { name: 'Unknown', avatar_color: '#9ca3af' };
                    const isFullOwed = exp.split_type === 'full';

                    return (
                      <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{exp.expense_date}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-main)', minWidth: '140px' }}>{exp.description}</td>
                        <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                          <span className={`badge ${isFullOwed ? 'badge-warning' : 'badge-purple'}`}>
                            {isFullOwed ? '100% Owed' : '50/50 Split'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: payer.avatar_color, whiteSpace: 'nowrap' }}>
                          {payer.name}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                          {CURRENCY_SYMBOL}{Number(exp.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <button
                            onClick={() => onDeleteExpense(exp.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                            title="Delete Expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: Recurring & Utility Bills */}
      {subTab === 'bills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Household Utility & Rent Bills</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('bill')}>
              <Plus size={14} /> Add Bill
            </button>
          </div>

          {bills.length === 0 ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No bills configured yet.</p>
            </div>
          ) : (
            <div className="grid-cols-2">
              {bills.map((bill) => {
                const payer = roommates.find((r) => r.id === bill.paid_by);

                return (
                  <div key={bill.id} className="glass-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{bill.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Due Date: {bill.due_date}</span>
                      </div>
                      <span className={`badge ${bill.is_paid ? 'badge-success' : 'badge-warning'}`}>
                        {bill.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {CURRENCY_SYMBOL}{Number(bill.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {bill.is_recurring && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Repeat size={12} /> {bill.recurrence_interval || 'Monthly'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Payer: <strong style={{ color: payer ? payer.avatar_color : 'var(--text-main)' }}>{payer ? payer.name : 'Unassigned'}</strong>
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => onEditBill && onEditBill(bill)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                          title="Edit Bill Details"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => onToggleBillPaid(bill.id, !bill.is_paid)}
                          className={`btn btn-sm ${bill.is_paid ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          {bill.is_paid ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                        <button
                          onClick={() => onDeleteBill(bill.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Delete Bill"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: Bill Payment Log */}
      {subTab === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bill Payment Log & History</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Logged automatically whenever a bill is marked as paid
            </span>
          </div>

          {billPayments.length === 0 ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <History size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No bill payment history logged yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Mark any bill as paid in the "Recurring Bills" tab to create a log entry.</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '0.75rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '0.75rem' }}>Date Paid</th>
                    <th style={{ padding: '0.75rem' }}>Bill Title</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Paid By</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount Paid</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billPayments.map((bp) => {
                    const payer = roommates.find((r) => r.id === bp.paid_by) || { name: 'Roommate', avatar_color: 'var(--accent-secondary)' };
                    const formattedDate = bp.paid_at ? new Date(bp.paid_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : (bp.due_date || 'N/A');

                    return (
                      <tr key={bp.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                          {formattedDate}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {bp.bill_title}
                        </td>
                        <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                          <span className="badge badge-purple">{bp.category || 'Utility'}</span>
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: payer.avatar_color, whiteSpace: 'nowrap' }}>
                          {payer.name}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--status-success)', whiteSpace: 'nowrap' }}>
                          {CURRENCY_SYMBOL}{Number(bp.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <button
                            onClick={() => onDeleteBillPayment && onDeleteBillPayment(bp.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                            title="Delete Payment Log Entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 4: Settlement Log */}
      {subTab === 'settlements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Settlement History Log</h3>

          {settlements.length === 0 ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No settlements recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {settlements.map((s) => {
                const payer = roommates.find((r) => r.id === s.payer_id) || { name: 'Roommate A' };
                const payee = roommates.find((r) => r.id === s.payee_id) || { name: 'Roommate B' };

                return (
                  <div key={s.id} className="sub-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        <span style={{ color: payer.avatar_color }}>{payer.name}</span> paid <span style={{ color: payee.avatar_color }}>{payee.name}</span>
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(s.settled_at).toLocaleString()}</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--status-success)' }}>
                      {CURRENCY_SYMBOL}{Number(s.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

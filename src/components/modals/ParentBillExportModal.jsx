import React, { useState } from 'react';
import { X, Share2, Copy, Check, FileSpreadsheet, Send } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../lib/defaultData';

export default function ParentBillExportModal({ isOpen, onClose, bills, expenses, roommates }) {
  const [copied, setCopied] = useState(false);
  const [creditAdjustment, setCreditAdjustment] = useState(15699.49);

  if (!isOpen) return null;

  const r1 = roommates[0] || { name: 'Andre' };
  const r2 = roommates[1] || { name: 'Gerard' };

  const monthlyDuesBills = bills.filter((b) => b.category === 'Monthly Dues' || b.title.toLowerCase().includes('rent') || b.title.toLowerCase().includes('association'));
  const utilityBills = bills.filter((b) => b.category === 'Utilities' || b.title.toLowerCase().includes('electric') || b.title.toLowerCase().includes('internet'));

  const duesTotal = monthlyDuesBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const duesGerard = duesTotal / 2;

  const utilitiesTotal = utilityBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const utilitiesGerard = utilitiesTotal / 2;

  const grandTotalGerard = duesGerard + utilitiesGerard;

  const generateTelegramText = () => {
    let text = `📋 *HOUSEHOLD BILLS STATEMENT*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    text += `*MONTHLY DUES (Rent + Assoc Dues)*\n`;
    monthlyDuesBills.forEach((b) => {
      text += `• ${b.title}: ${CURRENCY_SYMBOL}${Number(b.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} (${r2.name}: ${CURRENCY_SYMBOL}${(b.amount / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })})\n`;
    });
    text += `👉 *Subtotal ${r2.name}: ${CURRENCY_SYMBOL}${duesGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}*\n\n`;

    text += `*UTILITIES*\n`;
    utilityBills.forEach((b) => {
      text += `• ${b.title}: ${CURRENCY_SYMBOL}${Number(b.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} (${r2.name}: ${CURRENCY_SYMBOL}${(b.amount / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })})\n`;
    });
    text += `👉 *Subtotal ${r2.name}: ${CURRENCY_SYMBOL}${utilitiesGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}*\n\n`;

    if (creditAdjustment > 0) {
      text += `💳 *Credit to ${r1.name} for Bills Payment*: ${CURRENCY_SYMBOL}${creditAdjustment.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n`;
    }

    text += `✅ *GRAND TOTAL (${r2.name}'s Share): ${CURRENCY_SYMBOL}${grandTotalGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}*`;

    return text;
  };

  const handleCopyTelegram = () => {
    const text = generateTelegramText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet size={22} color="var(--status-success)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Parent Billing Statement Sheet</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Formatted spreadsheet view matching your household parent statement. Ready to copy for <strong>Telegram</strong>!
        </p>

        {/* Tabulated Spreadsheet Table Container */}
        <div style={{ background: '#ffffff', color: '#000000', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', overflowX: 'auto', fontFamily: 'sans-serif' }}>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#000000', color: '#ffffff', textAlign: 'left', fontWeight: 'bold' }}>
                <th style={{ padding: '8px 12px', border: '1px solid #ccc', width: '45%' }}></th>
                <th style={{ padding: '8px 12px', border: '1px solid #ccc', textAlign: 'right' }}>Amount Due</th>
                <th style={{ padding: '8px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{r2.name}</th>
                <th style={{ padding: '8px 12px', border: '1px solid #ccc' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              
              {/* SECTION 1: Monthly Dues */}
              <tr style={{ background: '#e5e7eb', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ padding: '6px 12px', border: '1px solid #ccc' }}>Monthly Dues (Rent + Assoc Dues)</td>
              </tr>
              {monthlyDuesBills.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}>{b.title}</td>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{Number(b.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{(b.amount / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc', fontSize: '0.78rem', color: '#4b5563' }}>{b.remarks || ''}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>Subtotal</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{duesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{duesGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}></td>
              </tr>

              {/* SECTION 2: Utilities */}
              <tr style={{ background: '#e5e7eb', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ padding: '6px 12px', border: '1px solid #ccc' }}>Utilities</td>
              </tr>
              {utilityBills.map((b) => (
                <tr key={b.id}>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}>{b.title}</td>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{Number(b.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{(b.amount / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 12px', border: '1px solid #ccc', fontSize: '0.78rem', color: '#4b5563' }}>{b.remarks || ''}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>Subtotal</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{utilitiesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{utilitiesGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}></td>
              </tr>

              {/* Credit Adjustment Row */}
              <tr style={{ background: '#fef08a', fontWeight: 'bold' }}>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}>Credit to {r1.name} for Bills Payment</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc', textAlign: 'right', fontStyle: 'italic' }}>{CURRENCY_SYMBOL}{creditAdjustment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}></td>
                <td style={{ padding: '6px 12px', border: '1px solid #ccc' }}></td>
              </tr>

              {/* GRAND TOTAL ROW */}
              <tr style={{ background: '#15803d', color: '#ffffff', fontWeight: 'bold', fontSize: '1.05rem' }}>
                <td style={{ padding: '8px 12px', border: '1px solid #ccc' }}>GRAND TOTAL</td>
                <td style={{ padding: '8px 12px', border: '1px solid #ccc' }}></td>
                <td style={{ padding: '8px 12px', border: '1px solid #ccc', textAlign: 'right' }}>{CURRENCY_SYMBOL}{grandTotalGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '8px 12px', border: '1px solid #ccc' }}></td>
              </tr>

            </tbody>
          </table>

        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button type="button" onClick={handleCopyTelegram} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            {copied ? <Check size={16} color="#10b981" /> : <Send size={16} />}
            {copied ? 'Copied Telegram Summary!' : 'Copy Summary for Telegram'}
          </button>
        </div>

      </div>
    </div>
  );
}

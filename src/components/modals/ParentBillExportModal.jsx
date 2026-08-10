import React, { useState, useRef } from 'react';
import { X, FileSpreadsheet, Send, Image as ImageIcon, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { CURRENCY_SYMBOL } from '../../lib/defaultData';
import { sendTelegramPhoto, sendTelegramMessage } from '../../lib/telegram';

export default function ParentBillExportModal({ isOpen, onClose, bills, expenses, roommates }) {
  const tableRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);
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

  // Capture table as high-resolution PNG image blob
  const generateImageBlob = async () => {
    if (!tableRef.current) return null;
    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleSendTelegramImage = async () => {
    setSending(true);
    try {
      const blob = await generateImageBlob();
      if (blob) {
        const caption = `📋 *HOUSEHOLD BILLS STATEMENT*\nGrand Total (${r2.name}'s Share): *${CURRENCY_SYMBOL}${grandTotalGerard.toLocaleString('en-US', { minimumFractionDigits: 2 })}*`;
        await sendTelegramPhoto(blob, caption);
      } else {
        alert('Failed to render billing sheet image.');
      }
    } catch (e) {
      console.error('Error generating billing sheet image:', e);
      alert('Error rendering billing table image.');
    }
    setSending(false);
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const blob = await generateImageBlob();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HomeSync_Billing_Statement_${new Date().toISOString().split('T')[0]}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Error downloading image:', e);
    }
    setDownloading(false);
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
          Exact spreadsheet table matching your household billing format. Sends as a <strong>crisp, high-resolution image</strong> directly to Telegram!
        </p>

        {/* Tabulated Spreadsheet Table Container (Ref for html2canvas) */}
        <div
          ref={tableRef}
          style={{ background: '#ffffff', color: '#000000', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem', overflowX: 'auto', fontFamily: 'sans-serif' }}
        >
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>HomeSync Household Bills Statement</h3>
            <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>Date: {new Date().toLocaleDateString()}</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#000000', color: '#ffffff', textAlign: 'left', fontWeight: 'bold' }}>
                <th style={{ padding: '8px 12px', border: '1px solid #ccc', width: '45%' }}>Item</th>
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
          <button type="button" onClick={handleDownloadImage} disabled={downloading} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            <Download size={16} />
            {downloading ? 'Rendering Image...' : 'Save PNG Image'}
          </button>
          <button type="button" onClick={handleSendTelegramImage} disabled={sending} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Send size={16} />
            {sending ? 'Rendering & Sending Image...' : 'Send Statement Image to Telegram'}
          </button>
        </div>

      </div>
    </div>
  );
}

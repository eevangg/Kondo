import React from 'react';
import { Calendar, Plus, Clock, Send, Trash2 } from 'lucide-react';
import { sendTelegramMessage } from '../../lib/telegram';

export default function EventsTab({
  roommates,
  events,
  onOpenModal,
  onDeleteEvent,
  onShowToast
}) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  const handleShareEventTelegram = async (event) => {
    const formatted = new Date(event.event_date).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let text = `📅 *UPCOMING HOUSEHOLD EVENT*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `📌 *Event*: ${event.title}\n`;
    text += `⏱️ *Date & Time*: ${formatted}\n`;
    text += `🏷️ *Category*: ${event.category}\n`;
    if (event.notes) {
      text += `📝 *Notes*: ${event.notes}\n`;
    }

    const result = await sendTelegramMessage(text);
    if (onShowToast) {
      onShowToast({
        type: result.success ? 'success' : 'error',
        message: result.success ? result.message : result.error
      });
    }
  };

  const getCategoryBadge = (cat) => {
    if (cat === 'Maintenance') return 'badge-danger';
    if (cat === 'Cleaning') return 'badge-purple';
    if (cat === 'Condo Admin') return 'badge-warning';
    return 'badge-info';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--accent-primary)" /> Shared Household Events Calendar
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Schedule maintenance visits, professional cleaning sessions, admin inspections, and deliveries.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('event')}>
          <Plus size={16} /> Schedule Event
        </button>
      </div>

      {/* Events Agenda List */}
      {sortedEvents.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Calendar size={42} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No upcoming household events scheduled.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {sortedEvents.map((ev) => {
            const creator = roommates.find((r) => r.id === ev.added_by);
            const dateObj = new Date(ev.event_date);
            const isPast = dateObj < new Date();

            const dateFormatted = dateObj.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });

            const timeFormatted = dateObj.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={ev.id} className="glass-card" style={{ padding: '1.25rem', opacity: isPast ? 0.65 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className={`badge ${getCategoryBadge(ev.category)}`} style={{ marginBottom: '0.35rem' }}>
                      {ev.category}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{ev.title}</h4>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Date & Time Block */}
                <div className="sub-card" style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{dateFormatted}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} color="var(--status-warning)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--status-warning)' }}>{timeFormatted}</span>
                  </div>
                </div>

                {ev.notes && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'var(--bg-glass)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                    {ev.notes}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Added by: <strong style={{ color: creator ? creator.avatar_color : 'var(--text-main)' }}>{creator ? creator.name : 'Unknown'}</strong>
                  </span>
                  <button
                    onClick={() => handleShareEventTelegram(ev)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                  >
                    <Send size={12} /> Telegram
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { X, Wrench, Check } from 'lucide-react';

export default function AddMaintenanceModal({ isOpen, onClose, roommates, activeRoommateId, onAddMaintenanceIssue }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Living Room');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState(roommates[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onAddMaintenanceIssue({
      title,
      description,
      location,
      priority,
      status: 'Reported',
      reported_by: activeRoommateId,
      assigned_to: assignedTo
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} color="var(--status-danger)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Report Repair / Maintenance Issue</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Issue Title</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Dripping Kitchen Faucet, Squeaky Bedroom Door"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Details & Description</label>
            <textarea
              className="glass-input"
              rows={3}
              placeholder="Describe what needs to be fixed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Location</label>
              <select className="glass-input" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Living Room">Living Room</option>
                <option value="Hallway">Hallway</option>
                <option value="Exterior">Exterior</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Priority</label>
              <select className="glass-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Assign To</label>
              <select className="glass-input" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary"><Check size={16} /> Submit Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}

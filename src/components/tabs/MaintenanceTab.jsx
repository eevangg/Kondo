import React from 'react';
import { AlertTriangle, Plus, CheckCircle2, Wrench, Clock, Trash2, ShieldAlert } from 'lucide-react';

export default function MaintenanceTab({
  roommates,
  maintenanceIssues,
  onOpenModal,
  onUpdateMaintenanceStatus,
  onDeleteMaintenanceIssue
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} color="var(--status-danger)" /> Household Repairs & Maintenance Queue
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track broken appliances, leaks, replacements, priority levels, and assigned roommate responsibilities.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('maintenance')}>
          <Plus size={16} /> Report Repair Request
        </button>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid-cols-2">
        {maintenanceIssues.map((issue) => {
          const reporter = roommates.find((r) => r.id === issue.reported_by);
          const assignee = roommates.find((r) => r.id === issue.assigned_to);

          let priorityBadge = 'badge-info';
          if (issue.priority === 'Urgent') priorityBadge = 'badge-danger';
          else if (issue.priority === 'Medium') priorityBadge = 'badge-warning';

          return (
            <div key={issue.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className={`badge ${priorityBadge}`}>{issue.priority} Priority</span>
                    <span className="badge badge-purple">{issue.location}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{issue.title}</h4>
                </div>
                <button
                  onClick={() => onDeleteMaintenanceIssue(issue.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {issue.description && (
                <p className="sub-card" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {issue.description}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span>Reported by: <strong style={{ color: reporter ? reporter.avatar_color : 'var(--text-main)' }}>{reporter ? reporter.name : 'Unknown'}</strong></span>
                <span>Assigned to: <strong style={{ color: assignee ? assignee.avatar_color : 'var(--text-main)' }}>{assignee ? assignee.name : 'Unassigned'}</strong></span>
              </div>

              {/* Status Selector Lifecycle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Repair Status:</span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {['To Fix', 'Fixing', 'Done'].map((status) => {
                    const isActive = issue.status === status;
                    let btnClass = 'btn-secondary';
                    if (isActive) {
                      if (status === 'To Fix') btnClass = 'badge-danger';
                      else if (status === 'Fixing') btnClass = 'badge-warning';
                      else if (status === 'Done') btnClass = 'badge-success';
                    }

                    return (
                      <button
                        key={status}
                        onClick={() => onUpdateMaintenanceStatus(issue.id, status)}
                        className={`btn btn-sm ${isActive ? btnClass : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

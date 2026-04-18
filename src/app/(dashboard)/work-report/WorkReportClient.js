"use client";

import { useState } from "react";
import { updateTask } from "../tasks/actions";
import { Check, Loader2, Save, Download, Filter } from "lucide-react";
import { formatDate } from "@/lib/format";

export default function WorkReportClient({ initialTasks, clients, employees }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [isUpdating, setIsUpdating] = useState(null);

  const filteredTasks = selectedClientId === "all" 
    ? tasks 
    : tasks.filter(t => t.clientId === selectedClientId);

  const handleStatusChange = async (taskId, field, value) => {
    setIsUpdating(taskId);
    const formData = new FormData();
    formData.append("id", taskId);
    formData.append(field, value);

    try {
      const res = await updateTask(formData);
      if (res.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
      } else {
        alert("Sync Error: " + res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const StatusBadge = ({ value, taskId, field }) => {
    const isDone = value === "Done" || value === "Posted" || value === "Ready to Post";
    const isNotRequired = value === "Not Required";
    
    return (
      <select 
        value={value} 
        onChange={(e) => handleStatusChange(taskId, field, e.target.value)}
        style={{
          width: '100%',
          padding: '4px 8px',
          borderRadius: '4px',
          border: 'none',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          backgroundColor: isNotRequired ? 'rgba(100, 116, 139, 0.1)' : (isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'),
          color: isNotRequired ? '#64748b' : (isDone ? '#10b981' : '#f59e0b'),
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <option value="Pending">Pending</option>
        <option value="Done">Done</option>
        <option value="Not Required">Not Required</option>
        {field === 'status' && (
          <>
            <option value="Designing">Designing</option>
            <option value="Waiting Approval">Waiting Approval</option>
            <option value="Ready to Post">Ready to Post</option>
            <option value="Posted">Posted</option>
          </>
        )}
      </select>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <select 
            className="input-field" 
            style={{ paddingLeft: '40px', marginBottom: 0 }}
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="all">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <button 
          className="btn-secondary" 
          onClick={() => window.open('/api/export/work-report')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="panel" style={{ padding: 0, overflowX: 'auto', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Client</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Assignee</th>
              <th style={{ padding: '1rem' }}>IG Status</th>
              <th style={{ padding: '1rem' }}>FB Status</th>
              <th style={{ padding: '1rem' }}>LI Status</th>
              <th style={{ padding: '1rem' }}>Audit Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{formatDate(task.dueDate)}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{task.clientName}</td>
                <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={task.description}>
                  {task.description}
                </td>
                <td style={{ padding: '1rem' }}>{task.assigneeName}</td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <StatusBadge value={task.statusInstagram} taskId={task.id} field="statusInstagram" />
                </td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <StatusBadge value={task.statusFacebook} taskId={task.id} field="statusFacebook" />
                </td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <StatusBadge value={task.statusLinkedIn} taskId={task.id} field="statusLinkedIn" />
                </td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  <StatusBadge value={task.status} taskId={task.id} field="status" />
                </td>
                <td style={{ padding: '1rem' }}>
                  {isUpdating === task.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} color="#10b981" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tasks found for the selected filter.
          </div>
        )}
      </div>

      <style jsx>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.01);
        }
        select:focus {
          ring: 2px solid var(--accent-blue);
        }
      `}</style>
    </div>
  );
}

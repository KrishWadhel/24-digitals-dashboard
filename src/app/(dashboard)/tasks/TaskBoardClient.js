"use client";

import { useState } from "react";
import { Clock, CheckCircle, ShieldCheck, Trash2, Pencil, X } from "lucide-react";
import { completeTask, deleteTask, approveTask, updateTask } from "./actions";
import { formatDate } from "@/lib/format";

export default function TaskBoardClient({ initialTasks, userRole, clients, employees }) {
  const [editingTask, setEditingTask] = useState(null);
  const isAdmin = userRole === "admin" || userRole === "senior";

  const pendingTasks = initialTasks.filter(t => t.status === 'pending');
  const completedTasks = initialTasks.filter(t => t.status === 'completed');
  const approvedTasks = initialTasks.filter(t => t.status === 'approved');

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await updateTask(formData);
    if (res.success) {
      setEditingTask(null);
      window.location.reload();
    } else {
      alert(res.error);
    }
  };

  const TaskCard = ({ task, borderColor, showActions = true }) => (
    <div className="panel" style={{ borderLeft: `4px solid ${borderColor}`, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.8rem", color: borderColor, fontWeight: "600", textTransform: "uppercase" }}>{task.clientName}</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{formatDate(task.dueDate)}</span>
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", textDecoration: task.status === 'approved' ? "line-through" : "none" }}>{task.title}</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>{task.description}</p>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>@{task.assigneeName}</span>
        
        {showActions && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {isAdmin && (
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button 
                  onClick={() => setEditingTask(task)}
                  style={{ background: "rgba(59, 130, 246, 0.1)", border: "none", color: "#60a5fa", cursor: "pointer", padding: "4px", borderRadius: "4px", display: "flex", alignItems: "center" }}
                  title="Edit Task"
                >
                  <Pencil size={16} />
                </button>
                <form action={deleteTask} style={{ display: "contents" }}>
                  <input type="hidden" name="id" value={task.id} />
                  <button type="submit" style={{ background: "rgba(248, 113, 113, 0.1)", border: "none", color: "#f87171", cursor: "pointer", padding: "4px", borderRadius: "4px", display: "flex", alignItems: "center" }} title="Delete Task">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            )}
            {task.status === 'pending' && (
              <form action={completeTask}>
                <input type="hidden" name="id" value={task.id} />
                <button type="submit" className="btn-secondary" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>Complete</button>
              </form>
            )}
            {task.status === 'completed' && isAdmin && (
              <form action={approveTask}>
                <input type="hidden" name="id" value={task.id} />
                <button type="submit" className="btn-primary" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem", backgroundColor: "#10b981" }}>Approve</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={20} color="var(--accent-blue)" /> Task Ongoing
          </h2>
          {pendingTasks.map(t => <TaskCard key={t.id} task={t} borderColor="var(--accent-blue)" />)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={20} color="#fbbf24" /> Reviewing by Clients
          </h2>
          {completedTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#fbbf24" />)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} color="#10b981" /> Approved by Clients
          </h2>
          {approvedTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#10b981" />)}
        </div>
      </div>

      {editingTask && (
        <div className="modal-overlay">
          <div className="panel modal-content" style={{ maxWidth: "500px", position: "relative" }}>
            <button 
              onClick={() => setEditingTask(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#888", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Edit Task</h2>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="hidden" name="id" value={editingTask.id} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Task Type</label>
                <select name="title" className="input-field" defaultValue={editingTask.title} required>
                  <option value="reel">Reel</option>
                  <option value="post">Post</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>
              <textarea name="description" className="input-field" defaultValue={editingTask.description} required style={{ minHeight: "100px" }} />
              <input type="date" name="dueDate" className="input-field" defaultValue={editingTask.dueDate} required />
              <select name="clientId" className="input-field" defaultValue={editingTask.clientId}>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select name="assigneeId" className="input-field" defaultValue={editingTask.assigneeId}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>IG Status</label>
                  <select name="statusInstagram" className="input-field" defaultValue={editingTask.statusInstagram}>
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>FB Status</label>
                  <select name="statusFacebook" className="input-field" defaultValue={editingTask.statusFacebook}>
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>LI Status</label>
                  <select name="statusLinkedIn" className="input-field" defaultValue={editingTask.statusLinkedIn}>
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Verified By Senior</label>
                  <input type="text" name="verifiedBySenior" className="input-field" defaultValue={editingTask.verifiedBySenior} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Verified By Client</label>
                  <input type="text" name="verifiedByClient" className="input-field" defaultValue={editingTask.verifiedByClient} />
                </div>
              </div>
              <select name="status" className="input-field" defaultValue={editingTask.status}>
                <option value="pending">Ongoing</option>
                <option value="completed">Reviewing</option>
                <option value="approved">Approved</option>
              </select>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Clock, CheckCircle, ShieldCheck, Trash2, Pencil, X, Camera } from "lucide-react";
import { completeTask, deleteTask, approveTask, updateTask } from "./actions";
import { formatDate } from "@/lib/format";

export default function TaskBoardClient({ initialTasks, userRole, clients, employees }) {
  const [editingTask, setEditingTask] = useState(null);
  const isAdmin = true; // userRole === "admin" || userRole === "senior";

  const pendingTasks = initialTasks.filter(t => t.status === 'Pending');
  const designingTasks = initialTasks.filter(t => t.status === 'Designing');
  const waitingTasks = initialTasks.filter(t => t.status === 'Waiting Approval');
  const readyTasks = initialTasks.filter(t => t.status === 'Ready to Post');
  const postedTasks = initialTasks.filter(t => t.status === 'Posted');

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
      <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", textDecoration: task.status === 'Posted' ? "line-through" : "none" }}>{task.title}</h3>
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
            {task.status === 'Pending' && (
              <form action={updateTask}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="Designing" />
                <button type="submit" className="btn-secondary" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>Start Design</button>
              </form>
            )}
            {task.status === 'Designing' && (
              <form action={updateTask}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="Waiting Approval" />
                <button type="submit" className="btn-secondary" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>Sent for Approval</button>
              </form>
            )}
            {task.status === 'Waiting Approval' && (
              <form action={updateTask}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="Ready to Post" />
                <button type="submit" className="btn-secondary" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>Approve</button>
              </form>
            )}
            {task.status === 'Ready to Post' && isAdmin && (
              <form action={updateTask}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="Posted" />
                <button type="submit" className="btn-primary" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem", backgroundColor: "#10b981" }}>Mark Posted</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", overflowX: "auto", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "250px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: "#f59e0b" }}>
            <Clock size={18} /> Pending
          </h2>
          {pendingTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#f59e0b" />)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "250px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: "#3b82f6" }}>
            <Pencil size={18} /> Designing
          </h2>
          {designingTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#3b82f6" />)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "250px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: "#a855f7" }}>
            <ShieldCheck size={18} /> Waiting Approval
          </h2>
          {waitingTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#a855f7" />)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "250px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981" }}>
            <CheckCircle size={18} /> Ready to Post
          </h2>
          {readyTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#10b981" />)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "250px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: "#6366f1" }}>
            <Camera size={18} /> Posted
          </h2>
          {postedTasks.map(t => <TaskCard key={t.id} task={t} borderColor="#6366f1" />)}
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
                <option value="Pending">Pending</option>
                <option value="Designing">Designing</option>
                <option value="Waiting Approval">Waiting Approval</option>
                <option value="Ready to Post">Ready to Post</option>
                <option value="Posted">Posted</option>
              </select>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

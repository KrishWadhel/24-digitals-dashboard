"use client";

import { useState, useEffect } from "react";
import {
  Users, Plus, Trash2, ExternalLink, Camera, Layout, Link,
  ChevronRight, Calendar, ArrowLeft, Pencil, CheckCircle2, Clock,
  ShieldCheck, Loader2, X
} from "lucide-react";
import { deleteClient, getClientDetails, updateClientPlan, updateClient } from "./actions";
import { addTask } from "../tasks/actions";
import { formatDate } from "@/lib/format";

export default function ClientsClient({ initialClients }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientTasks, setClientTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewDate, setViewDate] = useState(new Date(2026, 3, 1)); // April 2026

  const fetchDetails = async (client, date = viewDate) => {
    setLoading(true);
    setSelectedClient(client);
    const tasks = await getClientDetails(client.id, date.getMonth() + 1, date.getFullYear());
    setClientTasks(tasks);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClient) {
      fetchDetails(selectedClient, viewDate);
    }
  }, [viewDate]);

  const handleMonthChange = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Assuming addTask is imported. I will add the import next.
    const res = await addTask(formData);
    if (res.success) {
      setIsAddingTask(false);
      fetchDetails(selectedClient, viewDate);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await updateClientPlan(formData);
    if (res.success) {
      setIsEditingPlan(false);
      // We should ideally re-fetch clients but for now we'll just reload or update local state
      window.location.reload();
    }
  };

  if (selectedClient) {
    return (
      <DetailView
        client={selectedClient}
        tasks={clientTasks}
        loading={loading}
        onBack={() => setSelectedClient(null)}
        isEditingPlan={isEditingPlan}
        setIsEditingPlan={setIsEditingPlan}
        onUpdatePlan={handleUpdatePlan}
        viewDate={viewDate}
        onMonthChange={handleMonthChange}
        isAddingTask={isAddingTask}
        setIsAddingTask={setIsAddingTask}
        onAddTask={handleAddTask}
      />
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {initialClients.map(client => (
          <ClientCard
            key={client.id}
            client={client}
            onClick={() => fetchDetails(client)}
            onEdit={(e) => {
              e.stopPropagation();
              setEditingClient(client);
            }}
          />
        ))}
        {initialClients.length === 0 && (
          <div style={{ gridColumn: "1/-1", padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
            No clients found. Add one above.
          </div>
        )}
      </div>

      {editingClient && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="panel" style={{ width: "100%", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Edit Client: {editingClient.name}</h3>
              <button onClick={() => setEditingClient(null)} style={{ background: "transparent", border: "none", color: "var(--text-primary)" }}><X /></button>
            </div>
            <form action={updateClient} onSubmit={() => setTimeout(() => setEditingClient(null), 500)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="hidden" name="id" value={editingClient.id} />
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Client Name</label>
                <input type="text" name="name" defaultValue={editingClient.name} className="input-field" style={{ width: "100%" }} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Posts</label>
                  <input type="number" name="postsRequired" defaultValue={editingClient.postsRequired} className="input-field" style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Reels</label>
                  <input type="number" name="reelsRequired" defaultValue={editingClient.reelsRequired} className="input-field" style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Carousels</label>
                  <input type="number" name="carouselsRequired" defaultValue={editingClient.carouselsRequired} className="input-field" style={{ width: "100%" }} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientCard({ client, onClick, onEdit }) {
  const progress = client.stats.total > 0
    ? Math.round((client.stats.posted / (client.postsRequired + client.reelsRequired + client.carouselsRequired || 1)) * 100)
    : 0;

  return (
    <div className="panel" onClick={onClick} style={{ cursor: "pointer", transition: "var(--transition)", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.25rem" }}>{client.name}</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Camera size={14} color="#a855f7" />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={onEdit} style={{ background: "transparent", border: "none", color: "var(--text-secondary)" }}><Pencil size={16} /></button>
          <button style={{ background: "transparent", border: "none", color: "var(--text-secondary)" }}><ExternalLink size={16} /></button>
          <form action={deleteClient} onClick={e => e.stopPropagation()}>
            <input type="hidden" name="id" value={client.id} />
            <button type="submit" style={{ background: "transparent", border: "none", color: "#f87171" }}><Trash2 size={16} /></button>
          </form>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{client.postsRequired}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Posts</div>
        </div>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{client.reelsRequired}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Reels</div>
        </div>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{client.carouselsRequired}</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Carousels</div>
        </div>
      </div>

      <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
        <span style={{ color: "#4ade80" }}>{client.stats.posted} completed</span>
        <span style={{ color: "var(--text-secondary)" }}>{client.stats.pending} pending</span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, progress)}%`, height: "100%", background: "#3b82f6", borderRadius: "3px" }}></div>
      </div>
    </div>
  );
}

function DetailView({ 
  client, tasks, loading, onBack, isEditingPlan, setIsEditingPlan, onUpdatePlan,
  viewDate, onMonthChange, isAddingTask, setIsAddingTask, onAddTask 
}) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthDisplay = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const statusCounts = {
    "Pending": tasks.filter(t => t.status === 'Pending').length,
    "Designing": tasks.filter(t => t.status === 'Designing').length,
    "Waiting Approval": tasks.filter(t => t.status === 'Waiting Approval').length,
    "Ready to Post": tasks.filter(t => t.status === 'Ready to Post').length,
    "Posted": tasks.filter(t => t.status === 'Posted').length
  };

  const actuals = {
    posts: tasks.filter(t => t.status === 'Posted' && t.title?.toLowerCase().includes('post')).length,
    reels: tasks.filter(t => t.status === 'Posted' && t.title?.toLowerCase().includes('reel')).length,
    carousels: tasks.filter(t => t.status === 'Posted' && t.title?.toLowerCase().includes('carousel')).length,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{client.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Camera size={14} color="#a855f7" />
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Portfolio Insights</span>
          </div>
        </div>
      </div>

      <div className="panel" style={{ background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <button onClick={() => onMonthChange(-1)} style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><ChevronRight style={{ transform: "rotate(180deg)" }} /></button>
        <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{currentMonthDisplay}</span>
        <button onClick={() => onMonthChange(1)} style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><ChevronRight /></button>
      </div>

      <div className="panel" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", color: "var(--text-secondary)" }}>Monthly Content Plan</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setIsEditingPlan(true)} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
              <Pencil size={14} /> Edit Plan
            </button>
            <button onClick={() => setIsAddingTask(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
              <Plus size={14} /> Add Extra Content
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
          <PlanBox label="Plan Posts" value={client.postsRequired} />
          <PlanBox label="Plan Reels" value={client.reelsRequired} />
          <PlanBox label="Plan Carousels" value={client.carouselsRequired} />
          <PlanBox label="This Month Posts" value={actuals.posts} color="#3b82f6" />
          <PlanBox label="This Month Reels" value={actuals.reels} color="#3b82f6" />
          <PlanBox label="This Month Carousels" value={actuals.carousels} color="#3b82f6" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "3rem" }}>
        <StatusBox label="Pending" value={statusCounts.Pending} color="#f59e0b" icon={<Clock size={16} />} />
        <StatusBox label="Designing" value={statusCounts.Designing} color="#3b82f6" icon={<Pencil size={16} />} />
        <StatusBox label="Waiting Approval" value={statusCounts["Waiting Approval"]} color="#a855f7" icon={<ShieldCheck size={16} />} />
        <StatusBox label="Ready to Post" value={statusCounts["Ready to Post"]} color="#10b981" icon={<CheckCircle2 size={16} />} />
        <StatusBox label="Posted" value={statusCounts.Posted} color="#6366f1" icon={<Camera size={16} />} />
      </div>

      <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Content Tasks — {currentMonthDisplay}</h3>
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "0 auto" }} /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-secondary)", textAlign: "left", fontSize: "0.75rem" }}>
                <th style={{ padding: "1rem" }}>DATE</th>
                <th style={{ padding: "1rem" }}>TASK</th>
                <th style={{ padding: "1rem" }}>TYPE</th>
                <th style={{ padding: "1rem" }}>PLATFORM</th>
                <th style={{ padding: "1rem" }}>ASSIGNEE</th>
                <th style={{ padding: "1rem" }}>STATUS</th>
                <th style={{ padding: "1rem" }}>DESCRIPTION</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.85rem" }}>
              {tasks.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>No tasks for {currentMonthDisplay}</td></tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>{formatDate(task.dueDate)}</td>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>{task.title}</td>
                    <td style={{ padding: "1rem" }}>{task.title}</td>
                    <td style={{ padding: "1rem" }}>{task.platform}</td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>@{task.assigneeName}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ color: getStatusColor(task.status), fontWeight: "bold" }}>{task.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{task.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isEditingPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="panel" style={{ width: "100%", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Edit Content Plan</h3>
              <button onClick={() => setIsEditingPlan(false)} style={{ background: "transparent", border: "none", color: "var(--text-primary)" }}><X /></button>
            </div>
            <form onSubmit={onUpdatePlan} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="hidden" name="id" value={client.id} />
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Required Posts</label>
                <input type="number" name="posts" defaultValue={client.postsRequired} className="input-field" style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Required Reels</label>
                <input type="number" name="reels" defaultValue={client.reelsRequired} className="input-field" style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Required Carousels</label>
                <input type="number" name="carousels" defaultValue={client.carouselsRequired} className="input-field" style={{ width: "100%" }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {isAddingTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="panel" style={{ width: "100%", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Add Extra Content</h3>
              <button onClick={() => setIsAddingTask(false)} style={{ background: "transparent", border: "none", color: "var(--text-primary)" }}><X /></button>
            </div>
            <form onSubmit={onAddTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="hidden" name="clientId" value={client.id} />
              <input type="hidden" name="assigneeId" value="Admin" />
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Title (e.g. Reel, Post)</label>
                <input type="text" name="title" required className="input-field" style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Description</label>
                <textarea name="description" required className="input-field" style={{ width: "100%", minHeight: "80px" }}></textarea>
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Due Date</label>
                <input type="date" name="dueDate" required className="input-field" style={{ width: "100%" }} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanBox({ label, value, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: color || "var(--text-primary)" }}>{value}</div>
      <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", marginTop: "0.25rem" }}>{label}</div>
    </div>
  );
}

function StatusBox({ label, value, color, icon }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "16px", textAlign: "center" }}>
      <div style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{value}</div>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        fontSize: "0.7rem",
        fontWeight: "bold",
        backgroundColor: `${color}20`,
        color: color,
        textTransform: "uppercase"
      }}>
        {icon}
        {label}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Pending': return '#f59e0b';
    case 'Designing': return '#3b82f6';
    case 'Waiting Approval': return '#a855f7';
    case 'Ready to Post': return '#10b981';
    case 'Posted': return '#6366f1';
    default: return '#999';
  }
}

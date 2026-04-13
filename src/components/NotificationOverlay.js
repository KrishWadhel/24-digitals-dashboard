"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, X, Calendar as CalendarIcon, CheckCircle } from "lucide-react";

export default function NotificationOverlay() {
  const { data: session } = useSession();
  const [todayTasks, setTodayTasks] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch tasks for the user
      const fetchTasks = async () => {
        try {
          const res = await fetch("/api/tasks/today");
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              setTodayTasks(data);
              // Only show if not dismissed for this specific day/session
              const today = new Date().toISOString().split('T')[0];
              const dismissed = localStorage.getItem(`dismissed_tasks_${today}_${session.user.id}`);
              if (!dismissed) {
                setShow(true);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch notification tasks", err);
        }
      };
      fetchTasks();
    }
  }, [session]);

  const dismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`dismissed_tasks_${today}_${session.user.id}`, "true");
    setShow(false);
  };

  if (!show || todayTasks.length === 0) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="panel modal-content" style={{ 
        maxWidth: "500px", 
        padding: "2rem",
        border: "1px solid var(--accent-blue)",
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ 
              backgroundColor: "rgba(59, 130, 246, 0.1)", 
              padding: "0.75rem", 
              borderRadius: "12px",
              color: "var(--accent-blue)"
            }}>
              <Bell size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>Tasks for Today</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>You have {todayTasks.length} items to handle</p>
            </div>
          </div>
          <button onClick={dismiss} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
          {todayTasks.map(task => (
            <div key={task.id} style={{ 
              padding: "1rem", 
              backgroundColor: "rgba(255,255,255,0.03)", 
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <CalendarIcon size={16} color="var(--accent-blue)" />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>{task.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{task.clientName}</div>
                </div>
              </div>
              <CheckCircle size={18} color="#4ade80" style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <button 
          className="btn-primary" 
          style={{ width: "100%", padding: "0.75rem" }} 
          onClick={() => {
            dismiss();
            window.location.href = "/tasks";
          }}
        >
          View All Tasks
        </button>
      </div>
    </div>
  );
}

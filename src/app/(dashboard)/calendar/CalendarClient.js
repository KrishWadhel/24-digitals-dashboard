"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Image as ImageIcon, 
  Layers,
  ChevronDown,
  LayoutGrid,
  Calendar as CalendarIcon,
  List,
  Plus,
  X
} from "lucide-react";
import { addTask } from "../tasks/actions";

export default function CalendarClient({ initialTasks, clients = [], employees = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("grid"); // grid, list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  
  // Adjust startDay for Monday start (0=Sun, 1=Mon... -> 0=Mon, 6=Sun)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  const days = [];
  for (let i = 0; i < adjustedStartDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate.startsWith(dateStr));
  };

  const getTaskIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('reel')) return <Video size={12} />;
    if (t.includes('carousel')) return <Layers size={12} />;
    return <ImageIcon size={12} />;
  };

  const getTaskColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes('reel')) return "#a855f7"; // purple
    if (t.includes('carousel')) return "#3b82f6"; // blue
    return "#ec4899"; // pink/post
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Content Calendar</h1>
          <p style={{ color: "var(--text-secondary)" }}>Schedule and track content across platforms</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="panel" style={{ display: "flex", padding: "4px", gap: "4px", marginBottom: 0 }}>
             <button 
               onClick={() => setView("grid")}
               style={{ 
                 padding: "6px 12px", 
                 borderRadius: "6px", 
                 border: "none",
                 backgroundColor: view === "grid" ? "var(--accent-blue)" : "transparent",
                 color: view === "grid" ? "#fff" : "var(--text-secondary)",
                 cursor: "pointer"
               }}
             >
               <LayoutGrid size={18} />
             </button>
             <button 
               onClick={() => setView("list")}
               style={{ 
                 padding: "6px 12px", 
                 borderRadius: "6px", 
                 border: "none",
                 backgroundColor: view === "list" ? "var(--accent-blue)" : "transparent",
                 color: view === "list" ? "#fff" : "var(--text-secondary)",
                 cursor: "pointer"
               }}
             >
               <List size={18} />
             </button>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setIsModalOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={18} /> Add Content
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="panel modal-content" style={{ maxWidth: "500px", position: "relative" }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#888", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Schedule Content</h2>
            <form action={async (fd) => {
              const res = await addTask(fd);
              if (res.success) {
                setIsModalOpen(false);
                window.location.reload(); // Quick sync
              } else {
                alert(res.error);
              }
            }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" name="title" className="input-field" placeholder="Post Title (e.g. reel)" required />
              <input type="text" name="description" className="input-field" placeholder="Content details..." required />
              <input type="date" name="dueDate" className="input-field" required />
              <select name="clientId" className="input-field" required>
                <option value="">Select Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select name="assigneeId" className="input-field" required>
                <option value="">Assign Employee</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>Schedule Now</button>
            </form>
          </div>
        </div>
      )}

      <div className="panel" style={{ padding: "0", overflow: "hidden" }}>
        {/* Calendar Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "1.5rem",
          borderBottom: "1px solid var(--border-color)"
        }}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            <ChevronLeft size={24} />
          </button>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", fontFamily: "'Space Grotesk', sans-serif" }}>
            {monthName} {year}
          </h2>
          <button onClick={nextMonth} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Grid Header */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          textAlign: "center",
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "rgba(255,255,255,0.02)"
        }}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <div key={day} style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: "bold", color: "var(--text-secondary)" }}>
              {day}
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)",
          gridAutoRows: "minmax(120px, auto)"
        }}>
          {days.map((day, idx) => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            
            return (
              <div key={idx} style={{ 
                borderRight: (idx + 1) % 7 === 0 ? "none" : "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
                padding: "0.5rem",
                minHeight: "120px",
                position: "relative",
                backgroundColor: day ? "transparent" : "rgba(0,0,0,0.2)"
              }}>
                {day && (
                  <div style={{ 
                    fontSize: "0.875rem", 
                    marginBottom: "0.5rem", 
                    color: isToday ? "#fff" : "var(--text-secondary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={isToday ? {
                      backgroundColor: "var(--accent-blue)",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      fontSize: "0.75rem",
                      fontWeight: "bold"
                    } : {}}>{day}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      style={{ 
                        fontSize: "0.7rem", 
                        padding: "4px 8px", 
                        borderRadius: "4px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderLeft: `3px solid ${getTaskColor(task.title)}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer"
                      }}
                      title={`${task.title} - ${task.clientName}`}
                    >
                      <span style={{ color: getTaskColor(task.title) }}>
                        {getTaskIcon(task.title)}
                      </span>
                      <span style={{ fontWeight: "500" }}>{task.title}</span>
                      <span style={{ opacity: 0.5, fontSize: "0.6rem" }}>• {task.clientName}</span>
                    </div>
                  ))}
                  {dayTasks.length > 4 && (
                    <div style={{ fontSize: "0.65rem", color: "var(--accent-blue)", padding: "2px 8px" }}>
                      +{dayTasks.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

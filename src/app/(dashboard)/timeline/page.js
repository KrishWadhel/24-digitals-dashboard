"use client";

import { useState, useEffect } from "react";
import { Clock, Send, PlayCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TimelinePage() {
  const { data: session } = useSession();
  const [checkInTime, setCheckInTime] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  const [logs, setLogs] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [checkOutStep, setCheckOutStep] = useState(null); // 'confirm' or 'finalForm'
  const [finalTask, setFinalTask] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    taskType: "post",
    description: "",
    startTime: "",
    endTime: ""
  });
  const [clients, setClients] = useState([]);
  
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/worklogs?type=json");
      if (res.ok) {
        const data = await res.json();
        // Sort by date/time descending to show most recent first
        const sorted = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setLogs(sorted);
      }
    } catch (err) { console.error(err); }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients"); // I'll need to create this API or use an action
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    setIsClient(true);
    if (session?.user?.id) {
      const stored = localStorage.getItem(`checkInTime_${session.user.id}`);
      if (stored) setCheckInTime(new Date(stored));
    }
    fetchLogs();
    fetchClients();
  }, [session]);

  const handleCheckIn = () => {
    if (!session?.user?.id) return;
    const now = new Date();
    localStorage.setItem(`checkInTime_${session.user.id}`, now.toISOString());
    localStorage.setItem(`lastLogTime_${session.user.id}`, now.toISOString()); 
    localStorage.removeItem(`shiftCompleteNotified_${session.user.id}`);
    localStorage.removeItem(`checkedOut_${session.user.id}`);
    setCheckInTime(now);
    alert(`Checked in successfully at ${now.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    if (!session?.user?.id) return;
    const lastLog = localStorage.getItem(`lastLogTime_${session.user.id}`);
    const checkIn = localStorage.getItem(`checkInTime_${session.user.id}`);
    
    if (!checkIn) return alert("You are not checked in.");

    const now = new Date();
    const lastTime = lastLog ? new Date(lastLog) : new Date(checkIn);
    const diffMins = (now.getTime() - lastTime.getTime()) / (1000 * 60);

    if (diffMins < 30) {
      setCheckOutStep('confirm');
    } else {
      setCheckOutStep('finalForm');
    }
  };

  const confirmCheckOut = (asFinal) => {
    if (!session?.user?.id) return;
    if (asFinal) {
      // Use the last submitted task as the final task for the summary
      const lastTaskLog = logs[logs.length - 1];
      setFinalTask(lastTaskLog ? lastTaskLog.description : "Shift completed");
      localStorage.setItem(`checkedOut_${session.user.id}`, "true");
      setCheckOutStep(null);
      setShowSummary(true);
    } else {
      setCheckOutStep('finalForm');
    }
  };

  const handleFinalLogSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    // Re-use handleSubmit but specifically for checkout
    const success = await submitWorkLog(true);
    if (success) {
      setFinalTask(formData.description);
      localStorage.setItem(`checkedOut_${session.user.id}`, "true");
      setCheckOutStep(null);
      setShowSummary(true);
    }
  };

  const submitWorkLog = async (isFinal = false) => {
    if (!session?.user?.id) { alert("You must be logged in"); return false; }
    
    const res = await fetch("/api/worklogs", {
      method: "POST",
      body: JSON.stringify({...formData, userId: session.user.id}),
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) {
      localStorage.setItem(`lastLogTime_${session.user.id}`, new Date().toISOString());
      if (!isFinal) {
        alert("Work log successfully appended to Agency Database!");
        setFormData({ clientName: "", taskType: "post", description: "", startTime: "", endTime: "" });
        fetchLogs();
      }
      return true;
    } else {
      alert("Error submitting log");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitWorkLog(false);
  };

  if (!isClient) return null;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Daily Timeline Check-In</h1>
          <p style={{ color: "var(--text-secondary)" }}>Track your hours and submit 2-hourly reports</p>
        </div>
        {checkInTime && (
          <button className="btn-secondary" onClick={() => setShowSummary(true)}>
            View Daily Summary
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Check-In Panel */}
          <div className="panel" style={{ textAlign: "center" }}>
            <Clock size={48} color="var(--accent-blue)" style={{ margin: "0 auto 1rem auto" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Work Status</h2>
            
            {checkInTime ? (
              <div>
                <p style={{ color: "#4ade80", fontWeight: "bold", marginBottom: "1rem" }}>
                  Active Session
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  Arrival: {checkInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                  <button 
                    className="btn-primary" 
                    onClick={handleCheckOut}
                    style={{ width: "100%", backgroundColor: "#f87171" }}
                  >
                    Check Out & Exit
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  You have not checked in today.
                </p>
                <button 
                  className="btn-primary" 
                  onClick={handleCheckIn}
                  style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", padding: "1rem" }}
                >
                  <PlayCircle /> Check In Now
                </button>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="panel">
            <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>Recent Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "400px", overflowY: "auto" }}>
              {logs.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>No logs yet today.</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} style={{ padding: "0.75rem", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--accent-blue)", fontWeight: "bold" }}>{log.clientName}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{log.startTime}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>{log.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Log Panel */}
        <div className="panel">
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: "bold" }}>Log Recent Activity</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Client Name</label>
              <select 
                className="input-field" 
                required 
                value={formData.clientName} 
                onChange={e => setFormData({...formData, clientName: e.target.value})}
              >
                <option value="">Select a Client</option>
                {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Task Type</label>
                <select 
                  className="input-field" 
                  value={formData.taskType} 
                  onChange={e => setFormData({...formData, taskType: e.target.value})}
                >
                  <option value="post">Post</option>
                  <option value="reel">Reel</option>
                  <option value="carousel">Carousel</option>
                  <option value="design">Design Work</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Time Block</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input className="input-field" type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                  <span>-</span>
                  <input className="input-field" type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Description</label>
              <input 
                className="input-field" 
                placeholder="What exactly did you do in this time block?" 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", opacity: !checkInTime ? 0.5 : 1 }} disabled={!checkInTime}>
              <Send size={18} /> Append to Agency Database
            </button>
            {!checkInTime && <p style={{ textAlign: 'center', color: '#f87171', fontSize: '0.875rem' }}>You must Check In first.</p>}
          </form>
        </div>
      </div>

      {/* Check-Out Step 1: Confirmation */}
      {checkOutStep === 'confirm' && (
        <div className="modal-overlay">
          <div className="panel modal-content" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Count Last Task?</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              You logged a task less than 30 minutes ago. Should I count that as your final task of the day?
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => confirmCheckOut(true)}>Yes, Exit</button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => confirmCheckOut(false)}>No, Add One More</button>
            </div>
          </div>
        </div>
      )}

      {/* Check-Out Step 2: Final Form */}
      {checkOutStep === 'finalForm' && (
        <div className="modal-overlay">
          <div className="panel modal-content" style={{ maxWidth: "600px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>One Last Task...</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Please provide your final task of the day using the standard report format.
            </p>
            
            <form onSubmit={handleFinalLogSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Client Name</label>
                <input className="input-field" placeholder="e.g. Sompro" required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Type</label>
                  <select className="input-field" value={formData.taskType} onChange={e => setFormData({...formData, taskType: e.target.value})}>
                    <option value="post">Post</option>
                    <option value="reel">Reel</option>
                    <option value="design">Design</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Time Block</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input className="input-field" type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                    <input className="input-field" type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Description</label>
                <input className="input-field" placeholder="Final achievement..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Complete Shift</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setCheckOutStep(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Summary Modal */}
      {showSummary && (
        <div className="modal-overlay">
          <div className="panel modal-content" style={{ maxWidth: "600px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Daily Performance Report</h2>
            <div style={{ backgroundColor: "rgba(34, 197, 94, 0.1)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(34, 197, 94, 0.2)", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#4ade80" }}>
                Shift completed successfully. Here is your summary for today.
              </p>
            </div>
            
            <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Final Task Recorded</h4>
              <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{finalTask}</p>
            </div>

            <h4 style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Work Log Summary</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ fontSize: "0.875rem", display: "flex", justifyContent: "space-between" }}>
                  <span>{log.startTime}: {log.description}</span>
                  <span style={{ fontWeight: "bold" }}>{log.clientName}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: "100%" }} onClick={() => setShowSummary(false)}>
              Close & Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

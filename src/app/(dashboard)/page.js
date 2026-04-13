import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Users, FileText, Video, Clock, CheckCircle, Search } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role;
  const userId = session.user.id;
  const isAdmin = userRole === "admin" || userRole === "senior";

  // Fetch metrics based on role
  const clientsCount = isAdmin
    ? db.prepare("SELECT COUNT(*) as count FROM Client").get().count
    : db.prepare("SELECT COUNT(DISTINCT clientId) as count FROM Task WHERE assigneeId = ?").get(userId).count;

  const tasksPending = isAdmin
    ? db.prepare("SELECT COUNT(*) as count FROM Task WHERE status = 'pending'").get().count
    : db.prepare("SELECT COUNT(*) as count FROM Task WHERE status = 'pending' AND assigneeId = ?").get(userId).count;

  const tasksCompleted = isAdmin
    ? db.prepare("SELECT COUNT(*) as count FROM Task WHERE status = 'completed'").get().count
    : db.prepare("SELECT COUNT(*) as count FROM Task WHERE status = 'completed' AND assigneeId = ?").get(userId).count;

  const tasksApproved = isAdmin
    ? db.prepare("SELECT COUNT(*) as count FROM Task WHERE status = 'approved'").get().count
    : db.prepare("SELECT COUNT(*) as count FROM Task WHERE status = 'approved' AND assigneeId = ?").get(userId).count;
  
  const stats = [
    { title: "Active Clients", value: clientsCount, icon: Users, bg: "var(--accent-blue)" },
    { title: "Pending Tasks", value: tasksPending, icon: Clock, bg: "transparent" },
    { title: "In Review", value: tasksCompleted, icon: Search, bg: "transparent" },
    { title: "Approved Items", value: tasksApproved, icon: CheckCircle, bg: "transparent" },
  ];

  const tasksQuery = isAdmin
    ? `SELECT Task.*, Client.name as clientName FROM Task LEFT JOIN Client ON Task.clientId = Client.id ORDER BY Task.createdAt DESC LIMIT 5`
    : `SELECT Task.*, Client.name as clientName FROM Task LEFT JOIN Client ON Task.clientId = Client.id WHERE Task.assigneeId = ? ORDER BY Task.createdAt DESC LIMIT 5`;

  const tasksData = isAdmin
    ? db.prepare(tasksQuery).all()
    : db.prepare(tasksQuery).all(userId);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Overview of your content operations</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="panel" style={{ backgroundColor: stat.bg, border: stat.bg !== "transparent" ? "none" : undefined }}>
              <div style={{ display: "flex", gap: "0.5rem", color: stat.bg !== "transparent" ? "#fff" : "var(--accent-blue)", marginBottom: "1rem" }}>
                <Icon size={24} />
              </div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0 0 0.5rem 0", color: stat.bg !== "transparent" ? "#fff" : "var(--text-primary)" }}>
                {stat.value}
              </h2>
              <p style={{ color: stat.bg !== "transparent" ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>
                {stat.title}
              </p>
            </div>
          )
        })}
      </div>

      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>{isAdmin ? "Latest Agency Activity" : "My Recent Tasks"}</h2>
        <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-secondary)", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>TASK</th>
                <th style={{ padding: "1rem" }}>CLIENT</th>
                <th style={{ padding: "1rem" }}>DATE</th>
                <th style={{ padding: "1rem" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {tasksData.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No upcoming tasks
                  </td>
                </tr>
              ) : (
                tasksData.map(task => (
                  <tr key={task.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem" }}>{task.title}</td>
                    <td style={{ padding: "1rem" }}>{task.clientName}</td>
                    <td style={{ padding: "1rem" }}>{task.dueDate}</td>
                    <td style={{ padding: "1rem" }}>
                       <span style={{ 
                         color: task.status === 'approved' ? '#10b981' : task.status === 'completed' ? '#fbbf24' : 'var(--accent-blue)',
                         fontWeight: "600",
                         fontSize: "0.8rem",
                         textTransform: "uppercase"
                       }}>
                         {task.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

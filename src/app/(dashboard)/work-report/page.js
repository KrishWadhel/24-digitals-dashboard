import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import WorkReportClient from "./WorkReportClient";

export default async function WorkReportPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;

  const clients = db.prepare("SELECT * FROM Client WHERE status = 'active' ORDER BY name ASC").all();
  const employees = db.prepare("SELECT * FROM User ORDER BY name ASC").all();

  // Get tasks for the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const tasks = db.prepare(`
    SELECT Task.*, Client.name as clientName, User.name as assigneeName 
    FROM Task 
    JOIN Client ON Task.clientId = Client.id
    JOIN User ON Task.assigneeId = User.id
    WHERE Task.dueDate BETWEEN ? AND ?
    ORDER BY Task.dueDate ASC
  `).all(startOfMonth, endOfMonth);

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: '-1px' }}>Work Audit Spreadsheet</h1>
        <p style={{ color: "var(--text-secondary)" }}>Direct data-entry & synchronization for client tasks</p>
      </div>

      <WorkReportClient 
        initialTasks={tasks} 
        clients={clients} 
        employees={employees} 
      />
    </div>
  );
}

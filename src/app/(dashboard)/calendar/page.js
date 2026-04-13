import db from "@/lib/db";
import CalendarClient from "./CalendarClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Content Calendar | 24 Digitals",
  description: "Schedule and track content across platforms"
};

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;

  const userRole = session.user.role;
  const userId = session.user.id;

  // Isolate tasks by assignee if employee
  const query = userRole === "senior" || userRole === "admin"
    ? `SELECT Task.*, Client.name as clientName FROM Task LEFT JOIN Client ON Task.clientId = Client.id ORDER BY Task.dueDate ASC`
    : `SELECT Task.*, Client.name as clientName FROM Task LEFT JOIN Client ON Task.clientId = Client.id WHERE Task.assigneeId = ? ORDER BY Task.dueDate ASC`;

  const tasks = userRole === "senior" || userRole === "admin"
    ? db.prepare(query).all()
    : db.prepare(query).all(userId);

  // Fetch clients and employees for the "Add Content" modal
  const clients = db.prepare("SELECT * FROM Client WHERE status = 'active' ORDER BY name ASC").all();
  const employees = db.prepare("SELECT * FROM User ORDER BY name ASC").all();

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <CalendarClient 
        initialTasks={tasks} 
        clients={clients} 
        employees={employees} 
      />
    </div>
  );
}

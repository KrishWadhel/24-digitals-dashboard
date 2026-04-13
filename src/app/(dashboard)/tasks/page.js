import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { addTask } from "./actions";
import TaskBoardClient from "./TaskBoardClient";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || "employee";
  const userId = session?.user?.id;

  const tasksQuery = userRole === "admin" 
    ? `SELECT Task.*, Client.name as clientName, User.name as assigneeName 
       FROM Task 
       LEFT JOIN Client ON Task.clientId = Client.id 
       LEFT JOIN User ON Task.assigneeId = User.id
       ORDER BY Task.dueDate ASC`
    : `SELECT Task.*, Client.name as clientName, User.name as assigneeName 
       FROM Task 
       LEFT JOIN Client ON Task.clientId = Client.id 
       LEFT JOIN User ON Task.assigneeId = User.id
       WHERE Task.assigneeId = ?
       ORDER BY Task.dueDate ASC`;

  const tasks = userRole === "admin" 
    ? db.prepare(tasksQuery).all()
    : db.prepare(tasksQuery).all(userId);

  const clients = db.prepare("SELECT * FROM Client").all();
  const employees = db.prepare("SELECT * FROM User").all();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Task Board</h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage daily operations across clients</p>
      </div>

      {userRole === "admin" && (
        <div className="panel" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>Assign New Task</h3>
          <form action={addTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <select name="title" className="input-field" required style={{ flex: 1, minWidth: "150px" }}>
                <option value="reel">Reel</option>
                <option value="post">Post</option>
                <option value="carousel">Carousel</option>
              </select>
              <input type="text" name="description" className="input-field" placeholder="Task Description" required style={{ flex: 2, minWidth: "300px" }} />
              <input type="date" name="dueDate" className="input-field" required style={{ flex: 1, minWidth: "150px" }} />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <select name="clientId" className="input-field" style={{ flex: 1 }}>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select name="assigneeId" className="input-field" style={{ flex: 1 }}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <TaskBoardClient 
        initialTasks={tasks} 
        userRole={userRole} 
        clients={clients} 
        employees={employees} 
      />
    </div>
  );
}

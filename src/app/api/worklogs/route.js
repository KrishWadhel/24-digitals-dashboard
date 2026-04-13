import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const query = session.user.role === "senior" || session.user.role === "admin"
    ? `SELECT w.*, u.name as employeeName FROM WorkLog w LEFT JOIN User u ON w.userId = u.id ORDER BY w.logDate DESC`
    : `SELECT w.*, u.name as employeeName FROM WorkLog w LEFT JOIN User u ON w.userId = u.id WHERE w.userId = ? ORDER BY w.logDate DESC`;

  const logs = session.user.role === "senior" || session.user.role === "admin"
    ? db.prepare(query).all()
    : db.prepare(query).all(session.user.id);

  if (type === "json") {
    return new Response(JSON.stringify(logs), { status: 200 });
  }

  // Match April Content Plan
  const headers = "Employee,Client,Task Type,Description,Start Time,End Time\n";
  const rows = logs.map(l => 
    `"${l.employeeName}","${l.clientName}","${l.taskType}","${l.description}","${l.startTime}","${l.endTime}"`
  ).join("\n");

  return new Response(headers + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=\"work_logs_timeline.csv\""
    }
  });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const data = await request.json();
    const stmt = db.prepare(`
      INSERT INTO WorkLog (id, userId, clientName, taskType, description, startTime, endTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const userId = session.user.id; 

    stmt.run(Date.now().toString(), userId, data.clientName, data.taskType, data.description, data.startTime, data.endTime);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

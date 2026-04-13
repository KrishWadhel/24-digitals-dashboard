import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    // Get ALL active clients
    const clients = db.prepare("SELECT * FROM Client WHERE status = 'active' ORDER BY name ASC").all();
    
    // Get all tasks with employee and client names
    const tasks = db.prepare(`
      SELECT Task.*, Client.name as clientName, User.name as assigneeName 
      FROM Task 
      JOIN Client ON Task.clientId = Client.id
      JOIN User ON Task.assigneeId = User.id
      ORDER BY Task.dueDate ASC
    `).all();

    // ── Build CSV ──────────────────────────────────
    // BOM so Excel interprets UTF-8 correctly
    let csv = "\uFEFF";
    csv += "Month,April 2026\n\n";

    clients.forEach(client => {
      const clientTasks = tasks.filter(t => t.clientId === client.id);

      // Client header row (coloured in Excel via conditional formatting)
      csv += `${client.name?.toUpperCase()},,,,,,,,,\n`;
      csv += "week,no,Posting date,Post Description,Designed,Verified By Senior,Verified By Client,Status Instagram,Status Facebook,Status LinkedIn\n";

      // Group existing tasks into weeks (1 = days 1-7, 2 = 8-14, 3 = 15-21, 4 = 22-31)
      const weeks = { "Week 1": [], "Week 2": [], "Week 3": [], "Week 4": [] };
      clientTasks.forEach(task => {
        const day = new Date(task.dueDate).getDate();
        let weekKey = "Week 4";
        if (day <= 7)       weekKey = "Week 1";
        else if (day <= 14) weekKey = "Week 2";
        else if (day <= 21) weekKey = "Week 3";
        weeks[weekKey].push(task);
      });

      // Calculate total required posts (for empty row generation)
      const totalRequired = (client.postsRequired || 0) + (client.reelsRequired || 0) + (client.carouselsRequired || 0);
      const hasAnyTasks = clientTasks.length > 0;

      if (!hasAnyTasks) {
        // No tasks yet → show empty placeholder rows
        const total = totalRequired || 4;
        for (let i = 0; i < total; i++) {
          const weekNum = Math.floor(i / Math.ceil(total / 4)) + 1;
          const weekLabel = i % Math.ceil(total / 4) === 0 ? `Week ${weekNum}` : "";
          csv += `${weekLabel},${i + 1},,,,,,,,\n`;
        }
      } else {
        let globalIdx = 0;
        Object.entries(weeks).forEach(([weekName, weekTasks]) => {
          if (weekTasks.length === 0) return;
          weekTasks.forEach((task, idx) => {
            globalIdx++;
            const row = [
              idx === 0 ? weekName : "",
              globalIdx,
              formatDate(task.dueDate),
              `"${(task.description || "").replace(/"/g, '""')}"`,
              task.assigneeName || "",
              task.verifiedBySenior || "Pending",
              task.verifiedByClient || "Pending",
              task.statusInstagram || "Pending",
              task.statusFacebook || "Pending",
              task.statusLinkedIn || "Pending"
            ];
            csv += row.join(",") + "\n";
          });
        });
      }

      csv += ",,,,,,,,,\n"; // blank spacer between clients
    });

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="24Digitals_April2026_WorkReport.csv"'
      }
    });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

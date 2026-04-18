import db from "@/lib/db";
import { formatDate } from "@/lib/format";

export async function GET(request) {
  const clientId = "yqe50g3cv"; // Ezyest App
  const tasks = db.prepare(`
    SELECT * FROM Task 
    WHERE clientId = ? 
    AND (dueDate BETWEEN '2026-04-01' AND '2026-04-30')
    ORDER BY dueDate DESC
  `).all(clientId);

  const csvHeaders = "Date,Type,Description,Reach,Interactions,Status\n";
  
  const rows = tasks.map(task => {
    const date = formatDate(task.dueDate);
    const type = task.title || "Post";
    const desc = (task.description || "").replace(/,/g, ";").replace(/\n/g, " ");
    const reach = task.reach || 0;
    const interactions = task.interactions || 0;
    const status = task.statusInstagram || "Done";
    return `${date},${type},${desc},${reach},${interactions},${status}`;
  }).join("\n");

  const csv = csvHeaders + rows;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=\"performance_report_ezyestapp.csv\""
    }
  });
}

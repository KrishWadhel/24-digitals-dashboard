import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "Client ID required" }), { status: 400 });
  }

  try {
    const report = db.prepare(`
      SELECT * FROM GeneratedReport 
      WHERE clientId = ? 
      ORDER BY createdAt DESC 
      LIMIT 1
    `).get(clientId);

    if (!report) {
      return new Response(JSON.stringify({ found: false }), { status: 200 });
    }

    const posts = db.prepare(`
      SELECT * FROM ReportPost 
      WHERE reportId = ?
    `).all(report.id);

    const reportData = JSON.parse(report.reportData);

    return new Response(JSON.stringify({
      found: true,
      report,
      posts,
      data: reportData
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

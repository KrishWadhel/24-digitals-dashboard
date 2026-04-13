import db from "@/lib/db";

export async function GET() {
  try {
    const clients = db.prepare("SELECT * FROM Client WHERE status = 'active' ORDER BY name ASC").all();
    return new Response(JSON.stringify(clients), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

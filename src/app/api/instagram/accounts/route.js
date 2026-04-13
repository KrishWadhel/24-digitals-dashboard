import db from "@/lib/db";

export async function GET() {
  const accounts = db.prepare("SELECT id, username, isActive FROM InstagramAccount ORDER BY createdAt DESC").all();
  return new Response(JSON.stringify(accounts), { status: 200 });
}

export async function POST(req) {
  const { username, token, businessId, snapshot } = await req.json();
  const id = Math.random().toString(36).substr(2, 9);
  
  // Decatived others if this one is set active
  db.prepare("UPDATE InstagramAccount SET isActive = 0").run();
  
  db.prepare(`
    INSERT INTO InstagramAccount (id, username, token, businessId, snapshot, isActive)
    VALUES (?, ?, ?, ?, ?, 1)
    ON CONFLICT(username) DO UPDATE SET
      token = excluded.token,
      businessId = excluded.businessId,
      snapshot = excluded.snapshot,
      isActive = 1
  `).run(id, username, token, businessId, snapshot);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function PATCH(req) {
  const { id } = await req.json();
  db.prepare("UPDATE InstagramAccount SET isActive = 0").run();
  db.prepare("UPDATE InstagramAccount SET isActive = 1 WHERE id = ?").run(id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(req) {
  const { id } = await req.json();
  db.prepare("DELETE FROM InstagramAccount WHERE id = ?").run(id);
  // Ensure at least one is active if any remain
  const remaining = db.prepare("SELECT id FROM InstagramAccount LIMIT 1").get();
  if (remaining) {
    db.prepare("UPDATE InstagramAccount SET isActive = 1 WHERE id = ?").run(remaining.id);
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

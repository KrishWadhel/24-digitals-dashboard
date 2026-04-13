"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getClients() {
  return db.prepare("SELECT * FROM Client ORDER BY createdAt DESC").all();
}

export async function addClient(formData) {
  const name = formData.get("name");
  const postsRequired = parseInt(formData.get("postsRequired")) || 0;
  const reelsRequired = parseInt(formData.get("reelsRequired")) || 0;
  const carouselsRequired = parseInt(formData.get("carouselsRequired")) || 0;
  
  if (!name) return { error: "Name is required" };

  try {
    const stmt = db.prepare(`
      INSERT INTO Client (id, name, postsRequired, reelsRequired, carouselsRequired, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(Date.now().toString(), name, postsRequired, reelsRequired, carouselsRequired, "active");
    revalidatePath("/clients");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteClient(formData) {
  const id = formData.get("id");
  try {
    // Manually cleanup related records to avoid foreign key violations
    db.prepare("DELETE FROM Task WHERE clientId = ?").run(id);
    db.prepare("DELETE FROM Report WHERE clientId = ?").run(id);
    db.prepare("DELETE FROM Client WHERE id = ?").run(id);
    
    revalidatePath("/clients");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

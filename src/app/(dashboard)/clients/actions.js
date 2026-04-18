"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    const clients = db.prepare("SELECT * FROM Client").all();
    
    // Add stats to each client
    return clients.map(client => {
      const tasks = db.prepare("SELECT status FROM Task WHERE clientId = ?").all(client.id);
      return {
        ...client,
        stats: {
          total: tasks.length,
          posted: tasks.filter(t => t.status === 'Posted').length,
          pending: tasks.filter(t => t.status === 'Pending').length
        }
      };
    });
  } catch (err) {
    console.error("Error fetching clients:", err);
    return [];
  }
}

export async function updateClient(formData) {
  const id = formData.get("id");
  const name = formData.get("name");
  const postsRequired = parseInt(formData.get("postsRequired")) || 0;
  const reelsRequired = parseInt(formData.get("reelsRequired")) || 0;
  const carouselsRequired = parseInt(formData.get("carouselsRequired")) || 0;

  try {
    const stmt = db.prepare(`
      UPDATE Client 
      SET name = ?, postsRequired = ?, reelsRequired = ?, carouselsRequired = ?
      WHERE id = ?
    `);
    stmt.run(name, postsRequired, reelsRequired, carouselsRequired, id);
    
    revalidatePath("/clients");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function addClient(formData) {
  const name = formData.get("name");
  const posts = parseInt(formData.get("postsRequired")) || 0;
  const reels = parseInt(formData.get("reelsRequired")) || 0;
  const carousels = parseInt(formData.get("carouselsRequired")) || 0;
  const id = Date.now().toString(36);

  try {
    const stmt = db.prepare(`
      INSERT INTO Client (id, name, postsRequired, reelsRequired, carouselsRequired)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, posts, reels, carousels);
    revalidatePath("/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteClient(formData) {
  const id = formData.get("id");
  try {
    db.prepare("DELETE FROM Task WHERE clientId = ?").run(id);
    db.prepare("DELETE FROM Client WHERE id = ?").run(id);
    revalidatePath("/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateClientPlan(formData) {
  const id = formData.get("id");
  const posts = parseInt(formData.get("posts")) || 0;
  const reels = parseInt(formData.get("reels")) || 0;
  const carousels = parseInt(formData.get("carousels")) || 0;

  try {
    db.prepare(`
      UPDATE Client 
      SET postsRequired = ?, reelsRequired = ?, carouselsRequired = ? 
      WHERE id = ?
    `).run(posts, reels, carousels, id);
    revalidatePath("/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function getClientDetails(clientId, month, year) {
  try {
    const monthStr = month.toString().padStart(2, '0');
    return db.prepare(`
      SELECT * FROM Task 
      WHERE clientId = ? 
      AND strftime('%m', dueDate) = ? 
      AND strftime('%Y', dueDate) = ?
      ORDER BY dueDate ASC
    `).all(clientId, monthStr, year.toString());
  } catch (err) {
    console.error("Error fetching client details:", err);
    return [];
  }
}

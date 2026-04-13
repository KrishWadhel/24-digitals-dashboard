"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function completeTask(formData) {
  const id = formData.get("id");
  try {
    db.prepare("UPDATE Task SET status = 'completed' WHERE id = ?").run(id);
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function approveTask(formData) {
  const id = formData.get("id");
  try {
    db.prepare("UPDATE Task SET status = 'approved' WHERE id = ?").run(id);
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function addTask(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const clientId = formData.get("clientId");
  const assigneeId = formData.get("assigneeId");

  if (!title || !description || !dueDate) return { error: "Missing required fields" };

  try {
    const stmt = db.prepare(`
      INSERT INTO Task (id, title, description, platform, status, dueDate, clientId, assigneeId, reach, interactions, statusInstagram, statusFacebook, statusLinkedIn, verifiedBySenior, verifiedByClient) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(Date.now().toString(), title, description, "Instagram", "pending", dueDate, clientId, assigneeId, 0, 0, 'Pending', 'Pending', 'Pending', 'Pending', 'Pending');
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteTask(formData) {
  const id = formData.get("id");
  try {
    db.prepare("DELETE FROM Task WHERE id = ?").run(id);
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateTask(formData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const clientId = formData.get("clientId");
  const assigneeId = formData.get("assigneeId");
  const status = formData.get("status");

  const reach = formData.get("reach") || 0;
  const interactions = formData.get("interactions") || 0;
  const statusInstagram = formData.get("statusInstagram") || "Pending";
  const statusFacebook = formData.get("statusFacebook") || "Pending";
  const statusLinkedIn = formData.get("statusLinkedIn") || "Pending";
  const verifiedBySenior = formData.get("verifiedBySenior") || "Pending";
  const verifiedByClient = formData.get("verifiedByClient") || "Pending";

  try {
    const stmt = db.prepare(`
      UPDATE Task 
      SET title = ?, description = ?, dueDate = ?, clientId = ?, assigneeId = ?, status = ?, reach = ?, interactions = ?, statusInstagram = ?, statusFacebook = ?, statusLinkedIn = ?, verifiedBySenior = ?, verifiedByClient = ? 
      WHERE id = ?
    `);
    stmt.run(title, description, dueDate, clientId, assigneeId, status, reach, interactions, statusInstagram, statusFacebook, statusLinkedIn, verifiedBySenior, verifiedByClient, id);
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

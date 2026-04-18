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
    stmt.run(Date.now().toString(), title, description, "Instagram", "Pending", dueDate, clientId, assigneeId, 0, 0, 'Pending', 'Pending', 'Pending', 'Pending', 'Pending');
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
  if (!id) return { error: "Missing task ID" };

  try {
    // 1. Fetch current task state
    const currentTask = db.prepare("SELECT * FROM Task WHERE id = ?").get(id);
    if (!currentTask) return { error: "Task not found" };

    // 2. Extract updates or fallback to current values
    const title = formData.has("title") ? formData.get("title") : currentTask.title;
    const description = formData.has("description") ? formData.get("description") : currentTask.description;
    const dueDate = formData.has("dueDate") ? formData.get("dueDate") : currentTask.dueDate;
    const clientId = formData.has("clientId") ? formData.get("clientId") : currentTask.clientId;
    const assigneeId = formData.has("assigneeId") ? formData.get("assigneeId") : currentTask.assigneeId;
    const status = formData.has("status") ? formData.get("status") : currentTask.status;

    const reach = formData.has("reach") ? formData.get("reach") : currentTask.reach;
    const interactions = formData.has("interactions") ? formData.get("interactions") : currentTask.interactions;
    const statusInstagram = formData.has("statusInstagram") ? formData.get("statusInstagram") : currentTask.statusInstagram;
    const statusFacebook = formData.has("statusFacebook") ? formData.get("statusFacebook") : currentTask.statusFacebook;
    const statusLinkedIn = formData.has("statusLinkedIn") ? formData.get("statusLinkedIn") : currentTask.statusLinkedIn;
    const verifiedBySenior = formData.has("verifiedBySenior") ? formData.get("verifiedBySenior") : currentTask.verifiedBySenior;
    const verifiedByClient = formData.has("verifiedByClient") ? formData.get("verifiedByClient") : currentTask.verifiedByClient;

    // 3. Update database
    const stmt = db.prepare(`
      UPDATE Task 
      SET title = ?, description = ?, dueDate = ?, clientId = ?, assigneeId = ?, status = ?, reach = ?, interactions = ?, statusInstagram = ?, statusFacebook = ?, statusLinkedIn = ?, verifiedBySenior = ?, verifiedByClient = ? 
      WHERE id = ?
    `);
    
    stmt.run(
      title, description, dueDate, clientId, assigneeId, status, 
      reach, interactions, statusInstagram, statusFacebook, statusLinkedIn, 
      verifiedBySenior, verifiedByClient, 
      id
    );

    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

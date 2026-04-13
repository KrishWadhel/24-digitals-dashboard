"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getEmployees() {
  return db.prepare("SELECT * FROM User ORDER BY createdAt DESC").all();
}

export async function addEmployee(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role") || "employee";
  
  if (!name || !email) return { error: "Name and email required" };

  try {
    const stmt = db.prepare(`
      INSERT INTO User (id, name, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `);
    // default password is "password"
    stmt.run(Date.now().toString(), name, email, "password", role);
    revalidatePath("/employees");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteEmployee(formData) {
  const id = formData.get("id");
  try {
    // Manually cleanup related records to avoid foreign key violations
    db.prepare("DELETE FROM Task WHERE assigneeId = ?").run(id);
    db.prepare("DELETE FROM WorkLog WHERE userId = ?").run(id);
    db.prepare("DELETE FROM User WHERE id = ?").run(id);
    
    revalidatePath("/employees");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

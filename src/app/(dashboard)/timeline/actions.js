"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addTimelineLog(formData) {
  const userId = formData.get("userId");
  const clientName = formData.get("clientName");
  const taskType = formData.get("taskType");
  const description = formData.get("description");
  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");

  if (!userId || !clientName || !description) return { error: "Missing fields" };

  try {
    const stmt = db.prepare(`
      INSERT INTO WorkLog (id, userId, clientName, taskType, description, startTime, endTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(Date.now().toString(), userId, clientName, taskType, description, startTime, endTime);
    revalidatePath("/timeline");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

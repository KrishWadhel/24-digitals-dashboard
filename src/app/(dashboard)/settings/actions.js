"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const rows = db.prepare("SELECT * FROM Settings").all();
  const settings = {};
  rows.forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function saveSettings(formData) {
  const facebookSecret = formData.get("facebookSecret");
  const instagramToken = formData.get("instagramToken");
  const igBusinessId = formData.get("igBusinessId");

  try {
    const upsert = db.prepare("INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?)");
    
    if (facebookSecret !== null) upsert.run("facebookSecret", facebookSecret);
    if (instagramToken !== null) upsert.run("instagramToken", instagramToken);
    if (igBusinessId !== null) upsert.run("igBusinessId", igBusinessId);

    revalidatePath("/settings");
    revalidatePath("/analytics");
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

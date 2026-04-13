import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split('T')[0];
  const userRole = session.user.role;
  const userId = session.user.id;

  const query = userRole === "admin"
    ? `SELECT Task.*, Client.name as clientName 
       FROM Task 
       LEFT JOIN Client ON Task.clientId = Client.id 
       WHERE Task.dueDate = ? AND Task.status != 'approved'`
    : `SELECT Task.*, Client.name as clientName 
       FROM Task 
       LEFT JOIN Client ON Task.clientId = Client.id 
       WHERE Task.dueDate = ? AND Task.assigneeId = ? AND Task.status != 'approved'`;

  const tasks = userRole === "admin"
    ? db.prepare(query).all(today)
    : db.prepare(query).all(today, userId);

  return NextResponse.json(tasks);
}

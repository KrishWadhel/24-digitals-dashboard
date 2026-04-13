import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const clients = db.prepare("SELECT * FROM Client WHERE status = 'active'").all();
    const performanceData = clients.map(client => {
      // Get completed tasks for this client
      const tasks = db.prepare(`
        SELECT * FROM Task 
        WHERE clientId = ? 
        ORDER BY dueDate DESC
      `).all(client.id);

      const actualPosts = tasks.filter(t => (t.status === 'completed' || t.status === 'approved') && t.title?.toLowerCase().includes('post')).length;
      const actualReels = tasks.filter(t => (t.status === 'completed' || t.status === 'approved') && t.title?.toLowerCase().includes('reel')).length;
      const actualCarousels = tasks.filter(t => (t.status === 'completed' || t.status === 'approved') && t.title?.toLowerCase().includes('carousel')).length;

      return {
        id: client.id,
        name: client.name,
        targets: {
          posts: client.postsRequired,
          reels: client.reelsRequired,
          carousels: client.carouselsRequired
        },
        actual: {
          posts: actualPosts,
          reels: actualReels,
          carousels: actualCarousels
        },
        tasks: tasks
      };
    });

    return new Response(JSON.stringify(performanceData), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

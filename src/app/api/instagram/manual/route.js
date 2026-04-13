import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { views, interactions, postId, reach } = body;
    
    // Update the active account with manual override data
    const activeAccount = db.prepare("SELECT id, manualPostData FROM InstagramAccount WHERE isActive = 1").get();
    
    if (!activeAccount) {
      return new Response(JSON.stringify({ error: "No active account found" }), { status: 404 });
    }

    if (postId) {
      // Per-Post Update
      let postData = {};
      try {
        postData = JSON.parse(activeAccount.manualPostData || "{}");
      } catch(e) {}
      
      postData[postId] = {
        ...(postData[postId] || {}),
        ...(views !== undefined ? { views: parseInt(views) } : {}),
        ...(reach !== undefined ? { reach: parseInt(reach) } : {}),
        ...(interactions !== undefined ? { interactions: parseInt(interactions) } : {})
      };

      db.prepare("UPDATE InstagramAccount SET manualPostData = ? WHERE id = ?").run(
        JSON.stringify(postData),
        activeAccount.id
      );
    } else {
      // Global Account-wide update
      db.prepare("UPDATE InstagramAccount SET manualViews = ?, manualInteractions = ? WHERE id = ?").run(
        views || 0, 
        interactions || 0, 
        activeAccount.id
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

import db from "@/lib/db";

export async function GET() {
  const activeAccount = db.prepare("SELECT * FROM InstagramAccount WHERE isActive = 1").get();
  
  if (!activeAccount) {
    return new Response(JSON.stringify({ error: "No active Instagram account found. Please connect one." }), { status: 404 });
  }

  // If we have a cached snapshot (from our seamless sync or browser fetch), use it
  if (activeAccount.snapshot) {
    try {
      const data = JSON.parse(activeAccount.snapshot);
      return new Response(JSON.stringify({
        profile: { username: activeAccount.username },
        ...data,
        media: data.last_posts || data.media || []
      }), { status: 200 });
    } catch (e) { console.error("Snapshot parse error:", e); }
  }

  // Fallback to live fetch logic if token/businessId are present but no snapshot
  const token = activeAccount.token;
  const businessId = activeAccount.businessId;

  if (!token || !businessId) {
    return new Response(JSON.stringify({ error: "Active account missing configuration." }), { status: 400 });
  }

  try {
    // 1. Fetch User Insights
    const insightsUrl = `https://graph.facebook.com/v19.0/${businessId}/insights?metric=reach,impressions&period=days_28&access_token=${token}`;
    const insightsRes = await fetch(insightsUrl);
    const insightsData = await insightsRes.json();

    // 2. Fetch Media (Posts/Reels)
    const mediaUrl = `https://graph.facebook.com/v19.0/${businessId}/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&access_token=${token}`;
    const mediaRes = await fetch(mediaUrl);
    const mediaData = await mediaRes.json();

    return new Response(JSON.stringify({
      profile: { username: activeAccount.username },
      insights: insightsData.data || [],
      media: mediaData.data || [],
      manualViews: activeAccount.manualViews,
      manualInteractions: activeAccount.manualInteractions,
      manualPostData: activeAccount.manualPostData
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

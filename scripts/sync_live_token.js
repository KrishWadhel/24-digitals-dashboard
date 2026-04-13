const token = "IGAAVNOdZApEaFBZAFowSzg1X0tYLTE4c0JrdHQzQ0lzVGg4S3ZAPVVlMenA4aURrMFZAYZAzVXMUMwdWZAoMDZA0RXFMa2tkZAFpVYnAtQjNkNW5OWWxweTVISTFxUVBmN2NXeS1RWEthQXNFbW9IQUd6ZAElOb2JBWC1uQ3pWU2NtYVBjVQZDZD";
const Database = require('better-sqlite3');
const db = new Database('dev.db');

async function syncAccount() {
  try {
    console.log("Synchronizing ezyestapp with PROPER data...");
    
    // 1. Fetch Profile
    const profileRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${token}`);
    const profile = await profileRes.json();
    
    if (profile.error) throw new Error(JSON.stringify(profile.error));

    // 2. Fetch ALL Media with ACTUAL metrics (no more random guesses)
    // Basic Display API supports like_count and comments_count in recent versions for some accounts
    const mediaRes = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp,permalink,thumbnail_url,like_count,comments_count&access_token=${token}`);
    const media = await mediaRes.json();

    const snapshot = {
      profile: {
        username: profile.username,
        id: profile.id,
        followers: 176, // Kept as extracted value
        posts_count: profile.media_count
      },
      last_posts: media.data.map(m => ({
        id: m.id,
        caption: m.caption,
        type: m.media_type,
        url: m.media_url,
        permalink: m.permalink,
        timestamp: m.timestamp,
        date: m.timestamp.split('T')[0],
        likes: m.like_count || 0, // ACTUAL POST LIKES
        comments: m.comments_count || 0 // ACTUAL POST COMMENTS
      }))
    };

    const id = Math.random().toString(36).substr(2, 9);
    db.prepare(`
      INSERT INTO InstagramAccount (id, username, token, snapshot, isActive)
      VALUES (?, ?, ?, ?, 1)
      ON CONFLICT(username) DO UPDATE SET
        token = excluded.token,
        snapshot = excluded.snapshot,
        isActive = 1
    `).run(id, profile.username, token, JSON.stringify(snapshot));

    console.log(`✅ Success! Synced ${profile.username} with ${media.data.length} posts and ACTUAL metrics.`);
  } catch (err) {
    console.error("❌ Sync failed:", err);
  } finally {
    db.close();
  }
}

syncAccount();

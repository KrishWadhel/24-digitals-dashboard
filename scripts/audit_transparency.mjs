const token = "IGAAVNOdZApEaFBZAFowSzg1X0tYLTE4c0JrdHQzQ0lzVGg4S3ZAPVVlMenA4aURrMFZAYZAzVXMUMwdWZAoMDZA0RXFMa2tkZAFpVYnAtQjNkNW5OWWxweTVISTFxUVBmN2NXeS1RWEthQXNFbW9IQUd6ZAElOb2JBWC1uQ3pWU2NtYVBjVQZDZD";

async function showRawData() {
  console.log("FETCHING RAW DATA FOR AUDIT TRANSPARENCY...");
  
  // Try to find the April 9th post
  const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,timestamp,like_count,comments_count,view_count,video_view_count,reach,impressions&access_token=${token}`;
  
  try {
    const res = await fetch(mediaUrl);
    const data = await res.json();
    
    console.log("--- START RAW INSTAGRAM RESPONSE ---");
    console.log(JSON.stringify(data.data?.slice(0, 2), null, 2));
    console.log("--- END RAW INSTAGRAM RESPONSE ---");
    
    console.log("\nANALYSIS:");
    const post = data.data?.[0];
    if (post) {
      console.log(`Checking fields for Post ID: ${post.id}`);
      console.log(`- Caption: ${post.caption.substring(0, 30)}...`);
      console.log(`- Likes: ${post.like_count || 'FIELD MISSING'}`);
      console.log(`- Comments: ${post.comments_count || 'FIELD MISSING'}`);
      console.log(`- Views: ${post.view_count || post.video_view_count || 'FIELD MISSING (API BLOCKED)'}`);
      console.log(`- Reach: ${post.reach || 'FIELD MISSING (API BLOCKED)'}`);
    }
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

showRawData();

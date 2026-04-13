const token = "IGAAVNOdZApEaFBZAFowSzg1X0tYLTE4c0JrdHQzQ0lzVGg4S3ZAPVVlMenA4aURrMFZAYZAzVXMUMwdWZAoMDZA0RXFMa2tkZAFpVYnAtQjNkNW5OWWxweTVISTFxUVBmN2NXeS1RWEthQXNFbW9IQUd6ZAElOb2JBWC1uQ3pWU2NtYVBjVQZDZD";

async function deepTest() {
  console.log("Deep testing token for any kind of view/play count...");
  
  // Try Basic Display V15.0 media fields
  // Note: Basic Display is at graph.instagram.com
  const mediaUrl = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,username,timestamp,caption,like_count,comments_count,view_count&access_token=${token}`;
  
  try {
    const res = await fetch(mediaUrl);
    const data = await res.json();
    console.log("Raw API Response Fields:", Object.keys(data.data?.[0] || {}));
    console.log("Sample Data:", JSON.stringify(data.data?.[0], null, 2));
    
    if (data.error) {
       console.log("Error from API:", data.error.message);
    }
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

deepTest();

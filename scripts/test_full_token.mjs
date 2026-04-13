const token = "IGAAVNOdZApEaFBZAFowSzg1X0tYLTE4c0JrdHQzQ0lzVGg4S3ZAPVVlMenA4aURrMFZAYZAzVXMUMwdWZAoMDZA0RXFMa2tkZAFpVYnAtQjNkNW5OWWxweTVISTFxUVBmN2NXeS1RWEthQXNFbW9IQUd6ZAElOb2JBWC1uQ3pWU2NtYVBjVQZDZD";

async function testToken() {
  console.log("Testing token for media metrics...");
  try {
    const res = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,like_count,comments_count&access_token=${token}`);
    const data = await res.json();
    console.log("Media Data Sample:", JSON.stringify(data.data?.[0], null, 2));
    
    if (data.data?.[0]?.id) {
       const mediaId = data.data[0].id;
       console.log(`Checking insights for media ${mediaId}...`);
       // Basic Display API doesn't have /insights, but let's check
       const insightRes = await fetch(`https://graph.instagram.com/${mediaId}/insights?metric=reach,impressions&access_token=${token}`);
       const insightData = await insightRes.json();
       console.log("Insight Data:", JSON.stringify(insightData, null, 2));
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

testToken();

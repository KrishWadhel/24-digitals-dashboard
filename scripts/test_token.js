const token = "IGAAVNOdZApEaFBZAFowSzg1X0tYLTE4c0JrdHQzQ0lzVGg4S3ZAPVVlMenA4aURrMFZAYZAzVXMUMwdWZAoMDZA0RXFMa2tkZAFpVYnAtQjNkNW5OWWxweTVISTFxUVBmN2NXeS1RWEthQXNFbW9IQUd6ZAElOb2JBWC1uQ3pWU2NtYVBjVQZDZD";

async function testToken() {
  try {
    console.log("Testing Instagram Basic Display API...");
    const basicUrl = `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${token}`;
    const basicRes = await fetch(basicUrl);
    const basicData = await basicRes.json();
    console.log("Basic Display Result:", JSON.stringify(basicData, null, 2));

    if (basicData.id) {
        console.log("\\nFetching media with Basic Display API...");
        const mediaUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp,permalink,thumbnail_url&access_token=${token}`;
        const mediaRes = await fetch(mediaUrl);
        const mediaData = await mediaRes.json();
        console.log("Media Result (first 2 items):", JSON.stringify(mediaData.data?.slice(0, 2), null, 2));
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testToken();

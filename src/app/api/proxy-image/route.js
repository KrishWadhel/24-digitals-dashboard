export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) return new Response("Missing URL", { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Referer": "https://www.instagram.com/"
      }
    });

    if (!res.ok) {
      console.error(`Proxy failed for ${url} with status ${res.status}`);
      // Try one more time with a mobile User-Agent if it's Instagram
      if (url.includes("instagram")) {
        const res2 = await fetch(url, {
          headers: { "User-Agent": "Instagram 219.0.0.12.117 Android (29/10; 480dpi; 1080x2280; Xiaomi; Redmi Note 8 Pro; begonia; qcom; en_US)" }
        });
        if (res2.ok) {
          const buffer = await res2.arrayBuffer();
          return new Response(buffer, { headers: { "Content-Type": res2.headers.get("content-type") || "image/jpeg", "Access-Control-Allow-Origin": "*" } });
        }
      }
      throw new Error("Failed to fetch image after retries");
    }

    const contentType = res.headers.get("content-type");
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    console.error("Proxy Error:", err);
    return new Response("Failed to proxy image", { status: 500 });
  }
}

// JIGGLE_ID: 1776332400 | FORCING_RECOMPILE_AFTER_STALE_BUFFER
import db from "@/lib/db";
import * as XLSX from "xlsx";
import pdf from "pdf-parse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const clientId = formData.get("clientId");

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files uploaded" }), { status: 400 });
    }

    const extractedData = {
      overview: "",
      posts: [],
      screenshots: [], // NEW: Support for JPG uploads
      audience: {
        gender: { men: null, women: null },
        cities: [],
        topAge: null
      },
      totals: {
        views: 0,
        reach: 0,
        interactions: 0,
        likes: 0,
        shares: 0,
        follows: 0,
        comments: 0,
        saves: 0,
        reposts: 0
      }
    };

    const parseTime = (val) => {
      if (!val) return "N/A";
      // Handle Excel Serials
      if (!isNaN(val) && Number(val) > 10000) {
        const utc_days = Math.floor(val - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);
        return date_info.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      // Handle Strings
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return String(val);
    };

    console.log(`Analyzing ${files.length} files for client ${clientId}`);

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (file.name.toLowerCase().endsWith(".pdf")) {
          const pdfData = await pdf(buffer);
          const text = pdfData.text;
          extractedData.overview += `\n--- ${file.name} ---\n${text}\n`;
          
          // Regex extraction
          const menMatch = text.match(/Men[:\s]+(\d+(\.\d+)?)%/i);
          const womenMatch = text.match(/Women[:\s]+(\d+(\.\d+)?)%/i);
          if (menMatch) extractedData.audience.gender.men = parseFloat(menMatch[1]);
          if (womenMatch) extractedData.audience.gender.women = parseFloat(womenMatch[1]);
        } 
        else if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)) {
          console.log(`Extracting visual asset: ${file.name}`);
          const b64 = buffer.toString('base64');
          extractedData.screenshots.push({ name: file.name, data: `data:${file.type};base64,${b64}` });
        }
        else if (file.name.toLowerCase().match(/\.(xlsx|xls|csv)$/)) {
          const workbook = XLSX.read(buffer, { type: "buffer" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Smart Header Detection: Scan top rows for a header marker
          const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          let headerRowIndex = 0;
          for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
             if (rawRows[i] && rawRows[i].some(cell => String(cell).toLowerCase().includes("permalink") || String(cell).toLowerCase().includes("reach"))) {
               headerRowIndex = i;
               break;
             }
          }

          const rows = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });

          for (const row of rows) {
            const find = (keys) => {
              const k = Object.keys(row).find(key => 
                keys.some(t => key.toLowerCase().trim() === t.toLowerCase())
              );
              return row[k];
            };

            const likes = Number(find(["likes", "like_count", "like", "reactions"])) || 0;
            const reposts = Number(find(["reposts", "repost_count", "repost", "shares_repost", "collaborations"])) || 0;
            const saves = Number(find(["saves", "save_count", "save", "bookmarks"])) || 0;
            const shares = Number(find(["shares", "share_count", "share", "spread", "send", "link clicks"])) || 0;
            const comments = Number(find(["comments", "comment_count", "comment", "replies"])) || 0;
            const views = Number(find(["views", "view_count", "view", "plays", "play_count", "impressions"])) || 0;
            const reach = Number(find(["reach", "reach_count", "accounts reached", "reach_post", "total reach"])) || 0;
            const follows = Number(find(["follows", "follow_count", "follow", "new followers"])) || 0;
            
            const permalink = String(find(["permalink", "link", "url", "post link", "href"]) || "");
            
            // --- NEW: Fetch OG Image from Permalink ---
            let mediaUrl = "";
            if (permalink && permalink.startsWith("http")) {
              // Instagram direct image fallback
              if (permalink.includes("instagram.com/p/") || permalink.includes("instagram.com/reel/")) {
                const cleanUrl = permalink.split('?')[0];
                mediaUrl = `${cleanUrl}${cleanUrl.endsWith('/') ? '' : '/'}media/?size=l`;
              } else {
                try {
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
                  const res = await fetch(permalink, { 
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36" },
                    signal: controller.signal 
                  });
                  clearTimeout(timeoutId);
                  const html = await res.text();
                  
                  // Comprehensive regex for Instagram Reels and Posts
                  const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                                html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                                html.match(/["']display_url["']\s*:\s*["']([^"']+)["']/i) ||
                                html.match(/["']thumbnail_src["']\s*:\s*["']([^"']+)["']/i) ||
                                html.match(/["']thumbnail_url["']\s*:\s*["']([^"']+)["']/i) ||
                                html.match(/["']video_thumbnail_url["']\s*:\s*["']([^"']+)["']/i) ||
                                html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
                  
                  if (match) {
                    mediaUrl = match[1].replace(/\\u0026/g, '&'); // Clean escaped ampersands
                  }
                } catch (e) {
                  console.log(`Could not fetch OG image for ${permalink}`);
                }
              }
            }

            const post = {
              id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              permalink,
              publishTime: parseTime(find(["publish time", "date", "timestamp", "time", "created"])),
              description: String(find(["description", "caption", "text", "message", "title"]) || ""),
              mediaUrl, // Store the fetched image URL
              views,
              reach,
              likes,
              reposts,
              saves,
              shares,
              comments,
              interactions: likes + reposts + saves + shares + comments
            };

            extractedData.posts.push(post);
            extractedData.totals.views += post.views;
            extractedData.totals.reach += post.reach;
            extractedData.totals.interactions += post.interactions;
            extractedData.totals.likes += post.likes;
            extractedData.totals.shares += post.shares;
            extractedData.totals.comments += post.comments;
            extractedData.totals.saves += post.saves;
            extractedData.totals.reposts += post.reposts;
            extractedData.totals.follows += follows;
          }
        }
      } catch (fileErr) {
        console.error(`Error processing ${file.name}:`, fileErr);
      }
    }

    if (extractedData.posts.length === 0 && !extractedData.overview) {
      return new Response(JSON.stringify({ error: "No data found" }), { status: 400 });
    }

    const reportId = `rep_${Date.now()}`;
    
    try {
      db.prepare(`
        INSERT INTO GeneratedReport (id, clientId, period, platforms, overviewText, reportData)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(reportId, clientId, "April 2026", "FB / IG", extractedData.overview.slice(0, 5000), JSON.stringify(extractedData));

      const insertPost = db.prepare(`
        INSERT INTO ReportPost (id, reportId, permalink, publishTime, description, mediaUrl, views, reach, likes, reposts, saves, shares, comments, interactions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const tx = db.transaction((posts) => {
        for (const p of posts) {
          insertPost.run(p.id, reportId, p.permalink, p.publishTime, p.description, p.mediaUrl || "", p.views, p.reach, p.likes, p.reposts, p.saves, p.shares, p.comments, p.interactions);
        }
      });
      tx(extractedData.posts);

    } catch (dbErr) {
      console.error("DB Error:", dbErr);
      return new Response(JSON.stringify({ error: `DB failed: ${dbErr.message}` }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, reportId, data: extractedData }), { status: 200 });

  } catch (err) {
    console.error("Critical Failure:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

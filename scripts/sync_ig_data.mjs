import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

const clientId = "yqe50g3cv"; // Ezyest App

const data = [
  { date: "2026-04-15", type: "Photo", reach: 32, likes: 5, interactions: 5, caption: "You need to fast you game! Cause client is God!..." },
  { date: "2026-04-14", type: "Photo", reach: 43, likes: 53, interactions: 53, caption: "The more The better... Make it easy to understand..." },
  { date: "2026-04-13", type: "Reel", reach: 54, likes: 81, interactions: 81, caption: "Aap k sath bhi hota hai aaisa?? Abb ye sab solve..." },
  { date: "2026-04-11", type: "Photo", reach: 53, likes: 85, interactions: 85, caption: "Don't keep repeating mistakes!!!! They won't pay off!.." },
  { date: "2026-04-09", type: "Photo", reach: 60, likes: 83, interactions: 83, caption: "The 'In-Between' is where the money is. 💸..." },
  { date: "2026-04-08", type: "Photo", reach: 66, likes: 80, interactions: 80, caption: "Stop wearing 'busy' like a badge of honor. Most brokers..." }
];

const insertTask = db.prepare(`
  INSERT INTO Task (id, title, description, platform, status, dueDate, clientId, reach, interactions, statusInstagram)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

data.forEach((item, index) => {
  const id = `ig_sync_${Date.now()}_${index}`;
  insertTask.run(
    id,
    item.type,
    item.caption,
    "Instagram",
    "completed",
    new Date(item.date).toISOString(),
    clientId,
    item.reach,
    item.interactions,
    "Done"
  );
});

console.log("Successfully inserted " + data.length + " Instagram posts into Task table.");

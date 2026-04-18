import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

const deepData = [
  { date: "2026-04-13", reachFollowers: 91, reachNonFollowers: 7, watchTime: "56m 34s", title: "Reel" },
  { date: "2026-04-11", reachFollowers: 157, reachNonFollowers: 1, title: "Photo" },
];

deepData.forEach(item => {
  db.prepare(`
    UPDATE Task 
    SET reachFollowers = ?, reachNonFollowers = ?, watchTime = ? 
    WHERE clientId = 'yqe50g3cv' AND title = ? AND date(dueDate) = ?
  `).run(item.reachFollowers, item.reachNonFollowers, item.watchTime || null, item.title, item.date);
});

// Update InstagramAccount with aggregated metrics for global access
db.prepare(`
  UPDATE InstagramAccount 
  SET snapshot = ? 
  WHERE username = 'ezyestapp'
`).run(JSON.stringify({
  aggregated: {
    total_reach: 121,
    total_views: 1400,
    profile_visits: 55,
    new_follows: 1
  },
  audience: {
    men: 0.663,
    women: 0.337,
    top_age: "25-34"
  }
}));

console.log("Deep insights synced successfully.");

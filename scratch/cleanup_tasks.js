const db = require('better-sqlite3')('dev.db');
const res = db.prepare("DELETE FROM Task WHERE title IS NULL OR clientId IS NULL").run();
console.log(`Deleted ${res.changes} corrupted tasks.`);
const counts = db.prepare("SELECT COUNT(*) as count FROM Task").get();
console.log(`Total tasks remaining: ${counts.count}`);

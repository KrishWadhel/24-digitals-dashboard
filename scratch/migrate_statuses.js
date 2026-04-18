const db = require('better-sqlite3')('dev.db');
try {
  const result1 = db.prepare("UPDATE Task SET status = 'Pending' WHERE status = 'pending'").run();
  const result2 = db.prepare("UPDATE Task SET status = 'Ready to Post' WHERE status = 'completed'").run();
  const result3 = db.prepare("UPDATE Task SET status = 'Posted' WHERE status = 'approved'").run();
  console.log('Migration results:', { result1, result2, result3 });
} catch (err) {
  console.error('Migration failed:', err);
}
process.exit(0);

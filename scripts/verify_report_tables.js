const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Current Tables:", tables.map(t => t.name).join(", "));
  
  const reportSchema = db.prepare("PRAGMA table_info(GeneratedReport)").all();
  console.log("GeneratedReport Schema:", reportSchema.length ? "Exists" : "MISSING");
  
  const postSchema = db.prepare("PRAGMA table_info(ReportPost)").all();
  console.log("ReportPost Schema:", postSchema.length ? "Exists" : "MISSING");

} catch (err) {
  console.error("DB Discovery Error:", err);
} finally {
  db.close();
}

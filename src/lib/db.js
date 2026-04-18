import path from "path";
import fs from "fs";

let db;

// Check if we are running on Vercel
const isServerless = process.env.VERCEL === '1';

if (isServerless) {
  // Cloud Mode: Use readonly to prevent Vercel 500 error on Read-Only file system
  console.log("Running in Vercel Cloud Mode (Read-Only DB)");
  const Database = require("better-sqlite3");
  const dbPath = path.join(process.cwd(), "dev.db");
  db = new Database(dbPath, { readonly: true });
} else {
  // Local Mode: Use RW better-sqlite3
  const Database = require("better-sqlite3");
  const bcrypt = require("bcryptjs");
  
  if (!globalThis.__db) {
    const dbPath = path.join(process.cwd(), "dev.db");
    const connection = new Database(dbPath);
    connection.pragma("journal_mode = WAL");
    connection.pragma("foreign_keys = ON");

    // Initialize tables
    connection.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'employee',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Client (
      id TEXT PRIMARY KEY,
      name TEXT,
      postsRequired INTEGER DEFAULT 0,
      reelsRequired INTEGER DEFAULT 0,
      carouselsRequired INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Task (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      platform TEXT,
      status TEXT DEFAULT 'pending',
      dueDate DATETIME,
      clientId TEXT,
      assigneeId TEXT,
      reach INTEGER DEFAULT 0,
      interactions INTEGER DEFAULT 0,
      statusInstagram TEXT DEFAULT 'Pending',
      statusFacebook TEXT DEFAULT 'Pending',
      statusLinkedIn TEXT DEFAULT 'Pending',
      verifiedBySenior TEXT DEFAULT 'Pending',
      verifiedByClient TEXT DEFAULT 'Pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES Client(id),
      FOREIGN KEY (assigneeId) REFERENCES User(id)
    );
    `);

    // Individual migrations for existing installations
    try { connection.exec("ALTER TABLE Task ADD COLUMN reach INTEGER DEFAULT 0;"); } catch(e) {}
    try { connection.exec("ALTER TABLE Task ADD COLUMN interactions INTEGER DEFAULT 0;"); } catch(e) {}
    try { connection.exec("ALTER TABLE Task ADD COLUMN statusInstagram TEXT DEFAULT 'Pending';"); } catch(e) {}
    try { connection.exec("ALTER TABLE Task ADD COLUMN statusFacebook TEXT DEFAULT 'Pending';"); } catch(e) {}
    try { connection.exec("ALTER TABLE Task ADD COLUMN statusLinkedIn TEXT DEFAULT 'Pending';"); } catch(e) {}
    try { connection.exec("ALTER TABLE Task ADD COLUMN verifiedBySenior TEXT DEFAULT 'Pending';"); } catch(e) {}
    try { connection.exec("ALTER TABLE Task ADD COLUMN verifiedByClient TEXT DEFAULT 'Pending';"); } catch(e) {}

    connection.exec(`
    CREATE TABLE IF NOT EXISTS WorkLog (
      id TEXT PRIMARY KEY,
      userId TEXT,
      clientName TEXT,
      taskType TEXT,
      description TEXT,
      startTime TEXT,
      endTime TEXT,
      logDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    );

    CREATE TABLE IF NOT EXISTS Report (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      period TEXT,
      platforms TEXT,
      facebookViews TEXT,
      facebookReach TEXT,
      rawText TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES Client(id)
    );

    CREATE TABLE IF NOT EXISTS GeneratedReport (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      period TEXT,
      platforms TEXT,
      overviewText TEXT,
      reportData TEXT, -- JSON blob of the entire analyzed result
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clientId) REFERENCES Client(id)
    );

    CREATE TABLE IF NOT EXISTS ReportPost (
      id TEXT PRIMARY KEY,
      reportId TEXT,
      permalink TEXT,
      publishTime TEXT,
      description TEXT,
      mediaUrl TEXT, -- Locally cached image path
      views INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      reposts INTEGER DEFAULT 0,
      saves INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      interactions INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reportId) REFERENCES GeneratedReport(id)
    );

    CREATE TABLE IF NOT EXISTS Settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    `);

    // Seed Admin
    const adminExists = connection.prepare("SELECT * FROM User WHERE email = ?").get("admin@24digitals.com");
    if (!adminExists) {
      const hash = bcrypt.hashSync("admin123", 10);
      connection.prepare("INSERT INTO User (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)").run(
        "1", "Admin Senior", "admin@24digitals.com", hash, "senior"
      );
    }
    globalThis.__db = connection;
  }
  db = globalThis.__db;
}

export default db;

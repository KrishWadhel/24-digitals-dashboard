import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

let db;

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

  CREATE TABLE IF NOT EXISTS InstagramAccount (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    token TEXT,
    businessId TEXT,
    snapshot TEXT,
    isActive INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

  // Migration: Move existing snapshot to InstagramAccount if it exists
  const existingSnapshot = connection.prepare("SELECT value FROM Settings WHERE key = 'igDataSnapshot'").get();
  if (existingSnapshot && existingSnapshot.value) {
    try {
      const data = JSON.parse(existingSnapshot.value);
      const username = data.profile?.username || 'ezyestapp';
      const accountExists = connection.prepare("SELECT * FROM InstagramAccount WHERE username = ?").get(username);
      if (!accountExists) {
        connection.prepare("INSERT INTO InstagramAccount (id, username, snapshot, isActive) VALUES (?, ?, ?, ?)").run(
          Math.random().toString(36).substr(2, 9), username, existingSnapshot.value, 1
        );
      }
    } catch (e) { console.error("Migration error:", e); }
  }

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

export default db;

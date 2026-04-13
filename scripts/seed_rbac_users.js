const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

async function seedUsers() {
  console.log("Seeding RBAC Users (Safe Update)...");
  
  const targetUsers = [
    {
      name: 'Admin',
      email: 'admin@24digitals.com',
      password: 'Admin@123',
      role: 'admin'
    },
    {
      name: 'Yashvi Shah',
      email: 'yashvi@24digitals.com',
      password: 'Yashvi123',
      role: 'employee'
    },
    {
      name: 'Ananya',
      email: 'ananya@24digitals.com',
      password: 'ananya123',
      role: 'employee'
    }
  ];

  for (const user of targetUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(user.email);
    
    if (existing) {
      db.prepare('UPDATE User SET name = ?, password = ?, role = ? WHERE email = ?').run(
        user.name, hashedPassword, user.role, user.email
      );
      console.log(`- Updated existing user: ${user.email}`);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      db.prepare('INSERT INTO User (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(
        newId, user.name, user.email, hashedPassword, user.role
      );
      console.log(`- Created new user: ${user.email}`);
    }
  }

  console.log("✅ RBAC Seeding Complete.");
  db.close();
}

seedUsers();

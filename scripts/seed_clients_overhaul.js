const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

async function seedClients() {
  console.log("Seeding 10 Clients with April Targets...");
  
  const clients = [
    { name: 'Neeru', p: 4, r: 8, c: 4 },
    { name: 'Ezyest App', p: 11, r: 5, c: 0 },
    { name: 'Sompro', p: 8, r: 4, c: 0 },
    { name: 'Suraj', p: 6, r: 3, c: 0 },
    { name: 'We Care', p: 8, r: 2, c: 2 },
    { name: 'Durva', p: 8, r: 4, c: 0 },
    { name: 'Dr. Akashi', p: 4, r: 4, c: 0 },
    { name: 'NSF Security', p: 8, r: 6, c: 2 },
    { name: 'VIGO', p: 8, r: 4, c: 0 },
    { name: 'A.P Associates', p: 4, r: 4, c: 0 }
  ];

  for (const client of clients) {
    const existing = db.prepare('SELECT id FROM Client WHERE name = ?').get(client.name);
    
    if (existing) {
      db.prepare('UPDATE Client SET postsRequired = ?, reelsRequired = ?, carouselsRequired = ? WHERE id = ?').run(
        client.p, client.r, client.c, existing.id
      );
      console.log(`- Updated: ${client.name} (${client.p}/${client.r}/${client.c})`);
    } else {
      const id = Math.random().toString(36).substr(2, 9);
      db.prepare('INSERT INTO Client (id, name, postsRequired, reelsRequired, carouselsRequired, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run(id, client.name, client.p, client.r, client.c, 'active');
      console.log(`- Created: ${client.name} (${client.p}/${client.r}/${client.c})`);
    }
  }

  console.log("✅ Client Seeding Complete.");
  db.close();
}

seedClients();

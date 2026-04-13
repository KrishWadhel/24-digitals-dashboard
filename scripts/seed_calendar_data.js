const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

function seed() {
  console.log("Seeding Calendar & Workflow Data...");
  
  // Get existing clients and users
  const clients = db.prepare("SELECT id FROM Client").all();
  const users = db.prepare("SELECT id FROM User WHERE role = 'employee'").all();
  
  if (clients.length === 0 || users.length === 0) {
    console.log("❌ No clients or employees found. Run basic seed first.");
    return;
  }

  const clientId = clients[0].id; // EZYEST App usually
  const userId = users[0].id; // Yashvi usually

  const tasks = [
    // Today's Task (to trigger notification)
    {
      id: 'today_1',
      title: 'Reel: Product Launch Today',
      description: 'Official launch of the EZYEST App features.',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      clientId: clientId,
      assigneeId: userId
    },
    // March 2026 Tasks (from user screenshot)
    {
      id: 'march_1',
      title: 'Reel: mai broker hu',
      description: 'Comedy reel about real estate brokers.',
      dueDate: '2026-03-07',
      status: 'approved',
      clientId: clientId,
      assigneeId: userId
    },
    {
      id: 'march_2',
      title: 'Post: Womens day',
      description: 'Special creative for 8th March.',
      dueDate: '2026-03-08',
      status: 'approved',
      clientId: clientId,
      assigneeId: userId
    },
    {
      id: 'march_3',
      title: 'Carousel: Benefits of Listing',
      description: 'Educational carousel for Ezyest.',
      dueDate: '2026-03-11',
      status: 'approved',
      clientId: clientId,
      assigneeId: userId
    },
    {
      id: 'march_4',
      title: 'Post: gudi padwa',
      description: 'Festive greetings.',
      dueDate: '2026-03-19',
      status: 'completed',
      clientId: clientId,
      assigneeId: userId
    }
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO Task (id, title, description, platform, status, dueDate, clientId, assigneeId) 
    VALUES (?, ?, ?, 'Instagram', ?, ?, ?, ?)
  `);

  tasks.forEach(t => {
    insert.run(t.id, t.title, t.description, t.status, t.dueDate, t.clientId, t.assigneeId);
    console.log(`- Created task: ${t.title} (${t.dueDate})`);
  });

  console.log("✅ Calendar Seeding Complete.");
  db.close();
}

seed();

import db from "./db.js";

const aprilTasks = [
  { date: "2026-04-10", client: "EZYEST App", type: "post", desc: "most broker lose deal here", assignee: "yashvi" },
  { date: "2026-04-10", client: "Sompro", type: "reel", desc: "ek flat chahiye rent pe", assignee: "yashvi" },
  { date: "2026-04-10", client: "We Care", type: "post", desc: "professional brands", assignee: "Ananya" }
];

console.log("Seeding April Tasks...");
aprilTasks.forEach(task => {
  // Ensure user exists
  let user = db.prepare("SELECT * FROM User WHERE name LIKE ?").get(`%${task.assignee}%`);
  if (!user) {
    db.prepare("INSERT INTO User (id, name, email, password) VALUES (?, ?, ?, ?)").run(
      task.assignee, task.assignee, `${task.assignee}@24digitals.com`, "password"
    );
    user = { id: task.assignee };
  }

  // Ensure client exists
  let client = db.prepare("SELECT * FROM Client WHERE name = ?").get(task.client);
  if (!client) {
    db.prepare("INSERT INTO Client (id, name) VALUES (?, ?)").run(task.client, task.client);
    client = { id: task.client };
  }

  // Insert task
  db.prepare(`
    INSERT INTO Task (id, title, description, platform, dueDate, clientId, assigneeId, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    Date.now().toString() + Math.random(), 
    task.type, 
    task.desc, 
    "Instagram", 
    task.date, 
    client.id, 
    user.id, 
    "pending"
  );
});

console.log("Seed complete.");

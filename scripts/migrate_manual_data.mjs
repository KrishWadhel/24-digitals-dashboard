import db from "../src/lib/db.js";

try {
  db.prepare("ALTER TABLE InstagramAccount ADD COLUMN manualViews INTEGER").run();
  console.log("Added manualViews column");
} catch (e) { console.log("manualViews column likely exists"); }

try {
  db.prepare("ALTER TABLE InstagramAccount ADD COLUMN manualInteractions INTEGER").run();
  console.log("Added manualInteractions column");
} catch (e) { console.log("manualInteractions column likely exists"); }

process.exit(0);

import db from "../src/lib/db.js";
const accounts = db.prepare("SELECT * FROM InstagramAccount").all();
console.log(JSON.stringify(accounts, null, 2));
process.exit(0);

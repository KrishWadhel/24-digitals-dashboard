const db = require('better-sqlite3')('dev.db');
const corrupted = db.prepare("SELECT * FROM Task WHERE title IS NULL OR title = '' OR description IS NULL OR description = ''").all();
console.log('Corrupted tasks count:', corrupted.length);
console.log('Sample corrupted tasks:', corrupted.slice(0, 5));

const Database = require('better-sqlite3');
const path = require('path');
const db = new Database('dev.db');

const token = process.argv[2];
if (!token) {
    console.error('No token provided');
    process.exit(1);
}

try {
    const stmt = db.prepare('INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?)');
    stmt.run('instagramToken', token);
    console.log('Instagram Access Token updated successfully in Settings table.');
} catch (err) {
    console.error('Error updating token:', err);
} finally {
    db.close();
}

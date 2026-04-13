const Database = require('better-sqlite3');
const db = new Database('dev.db');

const igSnapshot = {
  profile: {
    username: "ezyestapp",
    followers: 176,
    following: 2,
    posts_count: 67
  },
  last_posts: [
    {
      id: "DW6aB8pjV22",
      likes: 44,
      comments: 3,
      date: "2026-04-09",
      type: "Post",
      caption: "The 'In-Between' is where the money is. 💸 Most brokers think deals are lost..."
    },
    {
      id: "DW4GOw5Df08",
      likes: 47,
      comments: 5,
      date: "2026-04-08",
      type: "Post",
      caption: "Stop wearing 'busy' like a badge of honor. Most brokers are drowning..."
    },
    {
      id: "DWgrPncEuDv",
      likes: 72,
      comments: 8,
      date: "2026-03-30",
      type: "Post",
      caption: "Too many chats. Too many brokers. Zero clarity. Switch to EZYEST."
    },
    {
      id: "DWY28WoEpJJ",
      likes: 150,
      comments: 12,
      date: "2026-03-25",
      type: "Reel",
      caption: "Can’t visit the property? No problem. Go LIVE and walk your clients through..."
    },
    {
      id: "ram_navami_post",
      likes: 110,
      comments: 15,
      date: "2026-04-17",
      type: "Post",
      caption: "Happy Ram Navami. Bringing Strength and Prosperity to Real Estate. Focused on Achieving Goals."
    },
    {
      id: "DWTw7USkrYk",
      likes: 132,
      comments: 20,
      date: "2026-03-20",
      type: "Post",
      caption: "Don't just track leads. Close them! Full visibility. Zero friction."
    }
  ]
};

try {
    const stmt = db.prepare('INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?)');
    stmt.run('igDataSnapshot', JSON.stringify(igSnapshot));
    console.log('Successfully seeded live Instagram snapshot for ezyestapp.');
} catch (err) {
    console.error('Seeding error:', err);
} finally {
    db.close();
}

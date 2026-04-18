const db = require('better-sqlite3')('dev.db');

const auditData = [
  // Vigo (8 tasks)
  { client: 'VIGO', date: '2026-04-05', type: 'reel', desc: '( 100 problems,1 solution)', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-09', type: 'reel', desc: '(note)', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-08', type: 'post', desc: 'post', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-14', type: 'reel', desc: 'reel', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-16', type: 'post', desc: 'post', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-18', type: 'reel', desc: 'reel', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-19', type: 'post', desc: 'post', assignee: 'yashvi' },
  { client: 'VIGO', date: '2026-04-25', type: 'reel', desc: 'reel', assignee: 'yashvi' },

  // 24 digitals (8 tasks)
  { client: '24 digitals', date: '2026-04-03', type: 'reel', desc: '( kitkat )', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-07', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-08', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-10', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-16', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-19', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-25', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: '24 digitals', date: '2026-04-26', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },

  // Pre Security (8 tasks)
  { client: 'Pre Security', date: '2026-04-06', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-08', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-14', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-18', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-20', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-22', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-25', type: 'post', desc: 'post', assignee: 'bdpq6iwkl' },
  { client: 'Pre Security', date: '2026-04-28', type: 'reel', desc: 'reel', assignee: 'bdpq6iwkl' },

  // Dr. Akashi (8 tasks)
  { client: 'Dr. Akashi', date: '2026-04-08', type: 'carousel', desc: '(5signs)', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-10', type: 'reel', desc: '(dental issue)', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-14', type: 'post', desc: '(chew both side)', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-16', type: 'reel', desc: '(ek second)', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-20', type: 'carousel', desc: '(myth vs facts)', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-23', type: 'reel', desc: 'Reel', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-27', type: 'post', desc: '(know this first)', assignee: 'bdpq6iwkl' },
  { client: 'Dr. Akashi', date: '2026-04-29', type: 'reel', desc: 'Reel', assignee: 'bdpq6iwkl' },

  // Ezyest (16 tasks)
  { client: 'Ezyest App', date: '2026-04-08', type: 'post', desc: '(not busy but unorganized)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-09', type: 'post', desc: '(broker lose deal here)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-10', type: 'reel', desc: '(is this property available)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-11', type: 'post', desc: '(most broker lose deal here)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-10', type: 'post', desc: '(client dont wait)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-12', type: 'post', desc: '(messing listing dont sell)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-13', type: 'reel', desc: '(kaaise manage karu)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-14', type: 'post', desc: '(hardwork dont sell)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-16', type: 'post', desc: '(unorrganized data)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-18', type: 'post', desc: '(every inqury is not a client)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-20', type: 'reel', desc: '(ek flat chahiye rent pe)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-21', type: 'post', desc: '(Your compititor isnt better)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-23', type: 'post', desc: '(showing random property)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-25', type: 'post', desc: '(too many chats)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-27', type: 'reel', desc: '(download mat karna)', assignee: 'yashvi' },
  { client: 'Ezyest App', date: '2026-04-30', type: 'post', desc: '(still managing clients on whatsapp)', assignee: 'yashvi' },

  // Sompro (12 tasks)
  { client: 'Sompro', date: '2026-04-03', type: 'post', desc: '( why sompro )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-06', type: 'post', desc: '( professional brands)', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-08', type: 'reel', desc: '( parking )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-11', type: 'post', desc: '( workplace hygiene )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-13', type: 'post', desc: '( smooth operation )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-16', type: 'reel', desc: '( security )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-18', type: 'post', desc: '( investment in expertise )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-20', type: 'post', desc: '(facility maintainance )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-22', type: 'reel', desc: '( horticulture )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-25', type: 'post', desc: '( our services )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-27', type: 'post', desc: '(manpower )', assignee: 'bdpq6iwkl' },
  { client: 'Sompro', date: '2026-04-29', type: 'reel', desc: '(maintainance)', assignee: 'bdpq6iwkl' },

  // Suraj (9 tasks)
  { client: 'Suraj', date: '2026-04-27', type: 'post', desc: '(ram navmi)', assignee: 'bdpq6iwkl' },
  { client: 'Suraj', date: '2026-04-10', type: 'reel', desc: '(real estate expert)', assignee: 'bdpq6iwkl' },
  { client: 'Suraj', date: '2026-04-13', type: 'carousel', desc: '(how to crack deal)', assignee: 'yashvi' },
  { client: 'Suraj', date: '2026-04-15', type: 'reel', desc: '(shoot)', assignee: '1' },
  { client: 'Suraj', date: '2026-03-13', type: 'post', desc: '(Introduction)', assignee: 'yashvi' },
  { client: 'Suraj', date: '2026-03-17', type: 'reel', desc: '(most people)', assignee: 'yashvi' },
  { client: 'Suraj', date: '2026-03-23', type: 'carousel', desc: '(chandak vansham', assignee: 'yashvi' },
  { client: 'Suraj', date: '2026-03-29', type: 'reel', desc: '(char din ki zindagi)', assignee: 'bdpq6iwkl' },
  { client: 'Suraj', date: '2026-04-01', type: 'post', desc: '(dhurandar)', assignee: 'bdpq6iwkl' },

  // We Care (12 tasks)
  { client: 'We Care', date: '2026-04-02', type: 'post', desc: '( introduction )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-08', type: 'post', desc: '(security )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-09', type: 'reel', desc: '(facility partner )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-11', type: 'post', desc: '(right services )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-13', type: 'carousel', desc: '(why facility )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-16', type: 'reel', desc: '( before after )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-18', type: 'post', desc: '(management )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-20', type: 'post', desc: '(sink your success )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-22', type: 'reel', desc: '(what we care do )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-25', type: 'post', desc: '(upgrade your facility )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-27', type: 'carousel', desc: '(we don’t just clean )', assignee: 'bdpq6iwkl' },
  { client: 'We Care', date: '2026-04-29', type: 'reel', desc: '( looks clean )', assignee: 'bdpq6iwkl' },

  // Durva (12 tasks)
  { client: 'Durva', date: '2026-04-04', type: 'post', desc: '(introduction)', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-08', type: 'post', desc: '( facility management )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-10', type: 'reel', desc: '( looks clean )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-11', type: 'post', desc: '( multiple vendors )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-13', type: 'carousel', desc: '(managing society )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-16', type: 'reel', desc: '(shoot)', assignee: '1' },
  { client: 'Durva', date: '2026-04-18', type: 'post', desc: '( powerful partner )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-20', type: 'post', desc: '( smarter entry )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-22', type: 'reel', desc: '(shoot)', assignee: '1' },
  { client: 'Durva', date: '2026-04-25', type: 'post', desc: '(upgrade your facility )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-27', type: 'carousel', desc: '(facility management checklist )', assignee: 'bdpq6iwkl' },
  { client: 'Durva', date: '2026-04-29', type: 'reel', desc: '(shoot)', assignee: '1' },

  // Neeru (16 tasks)
  { client: 'Neeru', date: '2026-04-04', type: 'post', desc: '(your safety is our responsibility)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-08', type: 'carousel', desc: '(more than just uniform)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-07', type: 'reel', desc: '(just because it looks clean)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-09', type: 'reel', desc: '(you hired professional security)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-10', type: 'post', desc: '(cleaner space)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-12', type: 'carousel', desc: '(Top Quality Security)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-13', type: 'reel', desc: '(want your office to feel premium)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-14', type: 'reel', desc: '(NSF does before your office open)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-16', type: 'post', desc: '(1 sheild All solutions)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-18', type: 'carousel', desc: '(you handle your business)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-20', type: 'reel', desc: 'Reel', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-21', type: 'reel', desc: 'Reel', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-23', type: 'post', desc: '(private and public security)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-25', type: 'carousel', desc: '(your building never sleep)', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-27', type: 'reel', desc: 'Reel', assignee: 'yashvi' },
  { client: 'Neeru', date: '2026-04-30', type: 'reel', desc: 'Reel', assignee: 'yashvi' }
];

const clientMap = {
  '24 digitals': '1775910939839',
  'Pre Security': '1775910958698',
  'Sompro': '1775911290560',
  'Suraj': '1775911334276',
  'We Care': '1775911385158',
  'Durva': '1775911436018',
  'Neeru': '1775911487033',
  'Ezyest App': 'yqe50g3cv',
  'Dr. Akashi': 'qpp3w9g8s',
  'VIGO': '9t0362ofe'
};

const userMap = {
  'yashvi': 'yashvi',
  'bdpq6iwkl': 'bdpq6iwkl',
  'Ananya': 'bdpq6iwkl',
  '1': '1',
  'Admin': '1'
};

function sync() {
  console.log('Starting sync...');
  let inserts = 0;
  let updates = 0;

  for (const task of auditData) {
    const clientId = clientMap[task.client];
    const assigneeId = userMap[task.assignee] || '1';
    
    if (!clientId) {
      console.warn(`Unknown client: ${task.client}`);
      continue;
    }

    // Check if task exists for this client and date
    const existing = db.prepare('SELECT id FROM Task WHERE clientId = ? AND dueDate = ?').get(clientId, task.date);
    
    if (existing) {
      db.prepare(`
        UPDATE Task 
        SET title = ?, description = ?, assigneeId = ?
        WHERE id = ?
      `).run(task.type, task.desc, assigneeId, existing.id);
      updates++;
    } else {
      db.prepare(`
        INSERT INTO Task (id, title, description, platform, status, dueDate, clientId, assigneeId, reach, interactions, statusInstagram, statusFacebook, statusLinkedIn, verifiedBySenior, verifiedByClient)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        Date.now().toString() + Math.random().toString(36).substr(2, 5),
        task.type, task.desc, 'Instagram', 'Pending', task.date, clientId, assigneeId,
        0, 0, 'Pending', 'Pending', 'Pending', 'Pending', 'Pending'
      );
      inserts++;
    }
  }

  console.log(`Sync complete. Inserts: ${inserts}, Updates: ${updates}`);
}

sync();

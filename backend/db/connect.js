const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'TMB.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nickname TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    gender TEXT DEFAULT '',
    age INTEGER DEFAULT 0,
    interests TEXT DEFAULT '[]',
    lat REAL DEFAULT 0,
    lng REAL DEFAULT 0,
    status TEXT DEFAULT 'offline',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Matches table
db.exec(`
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    max_people INTEGER DEFAULT 4,
    distance_km INTEGER DEFAULT 20,
    status TEXT DEFAULT 'waiting',
    created_at TEXT DEFAULT (datetime('now')),
    confirmed_at TEXT,
    FOREIGN KEY (creator_id) REFERENCES users(id)
  )
`);

// Match participants
db.exec(`
  CREATE TABLE IF NOT EXISTS match_participants (
    match_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at TEXT DEFAULT (datetime('now')),
    confirmed INTEGER DEFAULT 0,
    PRIMARY KEY (match_id, user_id),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  )
`);

console.log('Database initialized successfully');

module.exports = db;

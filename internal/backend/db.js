require('dotenv').config();
const fs      = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbPath  = process.env.DB_FILE;

// ensure data folder exists
fs.mkdirSync(require('path').dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'email TEXT UNIQUE NOT NULL, ' +
      'password TEXT NOT NULL' +
    ')'
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS transactions (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'user_id INTEGER NOT NULL, ' +
      'type TEXT CHECK(type IN (\'income\',\'expense\')) NOT NULL, ' +
      'category TEXT NOT NULL, ' +
      'amount REAL NOT NULL, ' +
      'date TEXT NOT NULL, ' +
      'description TEXT, ' +
      'FOREIGN KEY(user_id) REFERENCES users(id)' +
    ')'
  );
});

console.log('✨ Database initialized at', dbPath);
db.close();

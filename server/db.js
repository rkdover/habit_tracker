import BetterSqlite3 from 'better-sqlite3';

export class Database {
  constructor() {
    this.db = new BetterSqlite3('./habits.db');
    this.db.pragma('journal_mode = WAL');
    this.init();
  }

  init() {
    // Create habits table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        recurrence INTEGER NOT NULL,
        lastCompleted INTEGER,
        createdAt INTEGER,
        isRecurring INTEGER DEFAULT 1,
        archived INTEGER DEFAULT 0
      )
    `);

    // Create logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitId INTEGER NOT NULL,
        action TEXT NOT NULL,
        previousValue TEXT,
        newValue TEXT,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY(habitId) REFERENCES habits(id)
      )
    `);
  }

  run(sql, ...params) {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    return result.lastInsertRowid;
  }

  get(sql, ...params) {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params);
  }

  all(sql, ...params) {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }
}

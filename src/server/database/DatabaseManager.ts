import Database from 'better-sqlite3';
import * as path from 'path';

export interface Setting {
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export class DatabaseManager {
  private db: Database.Database;

  constructor(dbPath: string = './data/settings.db') {
    const resolvedPath = path.resolve(dbPath);
    this.db = new Database(resolvedPath);
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS docker_hosts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        socket_path TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default settings if not exists
    this.insertDefaultSettings();
  }

  private insertDefaultSettings(): void {
    const defaults = [
      { key: 'docker_socket', value: '/var/run/docker.sock', description: 'Default Docker socket path' },
      { key: 'refresh_interval', value: '5000', description: 'UI refresh interval in milliseconds' },
      { key: 'theme', value: 'light', description: 'UI theme (light/dark)' }
    ];

    const insert = this.db.prepare(`
      INSERT OR IGNORE INTO settings (key, value, description)
      VALUES (?, ?, ?)
    `);

    for (const setting of defaults) {
      insert.run(setting.key, setting.value, setting.description);
    }
  }

  getSetting(key: string): Setting | undefined {
    const stmt = this.db.prepare('SELECT * FROM settings WHERE key = ?');
    return stmt.get(key) as Setting | undefined;
  }

  getAllSettings(): Setting[] {
    const stmt = this.db.prepare('SELECT * FROM settings ORDER BY key');
    return stmt.all() as Setting[];
  }

  setSetting(key: string, value: string, description?: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO settings (key, value, description, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        description = COALESCE(excluded.description, description),
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(key, value, description);
  }

  deleteSetting(key: string): void {
    const stmt = this.db.prepare('DELETE FROM settings WHERE key = ?');
    stmt.run(key);
  }

  close(): void {
    this.db.close();
  }
}

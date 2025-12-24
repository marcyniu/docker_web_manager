import * as path from 'path';
import * as fs from 'fs';

export interface Setting {
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

interface SettingsStore {
  [key: string]: Setting;
}

export class DatabaseManager {
  private dbPath: string;
  private settings: SettingsStore;

  constructor(dbPath: string = './data/settings.json') {
    this.dbPath = path.resolve(dbPath);
    this.settings = {};
    this.initialize();
  }

  private initialize(): void {
    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Load existing settings or create new file
    if (fs.existsSync(this.dbPath)) {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      this.settings = JSON.parse(data);
    } else {
      this.insertDefaultSettings();
      this.save();
    }
  }

  private insertDefaultSettings(): void {
    const defaults = [
      { key: 'docker_socket', value: '/var/run/docker.sock', description: 'Default Docker socket path' },
      { key: 'refresh_interval', value: '5000', description: 'UI refresh interval in milliseconds' },
      { key: 'theme', value: 'light', description: 'UI theme (light/dark)' }
    ];

    for (const setting of defaults) {
      if (!this.settings[setting.key]) {
        this.settings[setting.key] = {
          ...setting,
          updated_at: new Date().toISOString()
        };
      }
    }
  }

  private save(): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.settings, null, 2));
  }

  getSetting(key: string): Setting | undefined {
    return this.settings[key];
  }

  getAllSettings(): Setting[] {
    return Object.values(this.settings).sort((a, b) => a.key.localeCompare(b.key));
  }

  setSetting(key: string, value: string, description?: string): void {
    this.settings[key] = {
      key,
      value,
      description: description || this.settings[key]?.description,
      updated_at: new Date().toISOString()
    };
    this.save();
  }

  deleteSetting(key: string): void {
    delete this.settings[key];
    this.save();
  }

  close(): void {
    // No-op for JSON file storage
  }
}

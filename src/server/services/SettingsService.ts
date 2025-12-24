import { DatabaseManager, Setting } from '../database/DatabaseManager';

export class SettingsService {
  constructor(private dbManager: DatabaseManager) {}

  getAll(): Setting[] {
    return this.dbManager.getAllSettings();
  }

  getByKey(key: string): Setting | undefined {
    return this.dbManager.getSetting(key);
  }

  update(key: string, value: string, description?: string): void {
    this.dbManager.setSetting(key, value, description);
  }

  delete(key: string): void {
    this.dbManager.deleteSetting(key);
  }
}

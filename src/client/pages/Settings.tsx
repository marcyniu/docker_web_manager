import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';

interface Setting {
  key: string;
  value: string;
  description?: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiClient.getSettings();
      setSettings(response.data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = async (key: string) => {
    try {
      await apiClient.updateSetting(key, editValue);
      setEditKey('');
      setEditValue('');
      await loadSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handleCancel = () => {
    setEditKey('');
    setEditValue('');
  };

  if (loading) {
    return <div className="has-text-centered"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="title">Settings</h1>
      <button className="button is-primary action-button" onClick={loadSettings}>
        Refresh
      </button>

      <div className="table-container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.key}>
                <td>{setting.key}</td>
                <td>
                  {editKey === setting.key ? (
                    <input
                      className="input"
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    setting.value
                  )}
                </td>
                <td>{setting.description}</td>
                <td>
                  {editKey === setting.key ? (
                    <>
                      <button className="button is-small is-success action-button" onClick={() => handleSave(setting.key)}>
                        Save
                      </button>
                      <button className="button is-small is-light action-button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="button is-small is-info" onClick={() => handleEdit(setting)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

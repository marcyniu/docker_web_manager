import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';
import { useTheme } from '../context/ThemeContext';
import { FiSettings, FiRefreshCw, FiEdit2, FiSave, FiX, FiSun, FiMoon } from 'react-icons/fi';

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
  const { isDarkMode, toggleDarkMode } = useTheme();

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <FiSettings className="text-blue-600 dark:text-blue-400" />
          Settings
        </h1>
        <button className="btn-primary" onClick={loadSettings}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Dark Mode Toggle Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <FiMoon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            ) : (
              <FiSun className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Theme Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDarkMode ? 'Dark mode is enabled' : 'Light mode is enabled'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                isDarkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Application Settings */}
      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Key</th>
              <th className="table-header-cell">Value</th>
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {settings.map((setting) => (
              <tr key={setting.key} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td className="table-cell font-medium">{setting.key}</td>
                <td className="table-cell">
                  {editKey === setting.key ? (
                    <input
                      className="input-field w-full"
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">{setting.value}</span>
                  )}
                </td>
                <td className="table-cell text-gray-600 dark:text-gray-400 text-sm">
                  {setting.description}
                </td>
                <td className="table-cell">
                  {editKey === setting.key ? (
                    <div className="flex gap-2">
                      <button className="btn-success" onClick={() => handleSave(setting.key)} title="Save">
                        <FiSave className="h-3 w-3" />
                      </button>
                      <button className="btn-secondary" onClick={handleCancel} title="Cancel">
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button className="btn-info" onClick={() => handleEdit(setting)} title="Edit">
                      <FiEdit2 className="h-3 w-3" />
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

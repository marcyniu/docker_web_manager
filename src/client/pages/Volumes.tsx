import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';
import { FiDatabase, FiRefreshCw, FiTrash2, FiAlertCircle } from 'react-icons/fi';

interface Volume {
  Name: string;
  Driver: string;
  Mountpoint: string;
  CreatedAt: string;
}

export const Volumes: React.FC = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolumes();
  }, []);

  const loadVolumes = async () => {
    try {
      const response = await apiClient.getVolumes();
      setVolumes(response.data || []);
    } catch (error) {
      console.error('Error loading volumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (name: string) => {
    if (!confirm('Are you sure you want to remove this volume?')) return;
    try {
      await apiClient.removeVolume(name, true);
      await loadVolumes();
    } catch (error) {
      console.error('Error removing volume:', error);
    }
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
          <FiDatabase className="text-blue-600 dark:text-blue-400" />
          Volumes
        </h1>
        <button className="btn-primary" onClick={loadVolumes}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {volumes.length === 0 ? (
        <div className="card p-8 text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No volumes found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Driver</th>
                <th className="table-header-cell">Mountpoint</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {volumes.map((volume) => (
                <tr key={volume.Name} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="table-cell font-medium">{volume.Name}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">{volume.Driver}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400 text-xs font-mono">{volume.Mountpoint}</td>
                  <td className="table-cell">
                    <button className="btn-danger" onClick={() => handleRemove(volume.Name)} title="Remove">
                      <FiTrash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';
import { FiBox, FiPlay, FiSquare, FiRefreshCw, FiTrash2, FiAlertCircle } from 'react-icons/fi';

interface Container {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  Status: string;
}

export const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContainers();
  }, []);

  const loadContainers = async () => {
    try {
      const response = await apiClient.getContainers(true);
      setContainers(response.data || []);
    } catch (error) {
      console.error('Error loading containers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await apiClient.startContainer(id);
      await loadContainers();
    } catch (error) {
      console.error('Error starting container:', error);
    }
  };

  const handleStop = async (id: string) => {
    try {
      await apiClient.stopContainer(id);
      await loadContainers();
    } catch (error) {
      console.error('Error stopping container:', error);
    }
  };

  const handleRestart = async (id: string) => {
    try {
      await apiClient.restartContainer(id);
      await loadContainers();
    } catch (error) {
      console.error('Error restarting container:', error);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this container?')) return;
    try {
      await apiClient.removeContainer(id, true);
      await loadContainers();
    } catch (error) {
      console.error('Error removing container:', error);
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
          <FiBox className="text-blue-600 dark:text-blue-400" />
          Containers
        </h1>
        <button className="btn-primary" onClick={loadContainers}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {containers.length === 0 ? (
        <div className="card p-8 text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No containers found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Image</th>
                <th className="table-header-cell">State</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {containers.map((container) => (
                <tr key={container.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="table-cell font-medium">{container.Names[0]?.replace('/', '')}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">{container.Image}</td>
                  <td className="table-cell">
                    <span className={`status-badge status-${container.State}`}>
                      {container.State}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-600 dark:text-gray-400">{container.Status}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      {container.State === 'running' ? (
                        <>
                          <button className="btn-warning" onClick={() => handleStop(container.Id)} title="Stop">
                            <FiSquare className="h-3 w-3" />
                          </button>
                          <button className="btn-info" onClick={() => handleRestart(container.Id)} title="Restart">
                            <FiRefreshCw className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <button className="btn-success" onClick={() => handleStart(container.Id)} title="Start">
                          <FiPlay className="h-3 w-3" />
                        </button>
                      )}
                      <button className="btn-danger" onClick={() => handleRemove(container.Id)} title="Remove">
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    </div>
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

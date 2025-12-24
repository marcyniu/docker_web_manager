import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';
import { FiShare2, FiRefreshCw, FiTrash2, FiAlertCircle } from 'react-icons/fi';

interface Network {
  Id: string;
  Name: string;
  Driver: string;
  Scope: string;
}

export const Networks: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    try {
      const response = await apiClient.getNetworks();
      setNetworks(response.data || []);
    } catch (error) {
      console.error('Error loading networks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this network?')) return;
    try {
      await apiClient.removeNetwork(id);
      await loadNetworks();
    } catch (error) {
      console.error('Error removing network:', error);
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
          <FiShare2 className="text-blue-600 dark:text-blue-400" />
          Networks
        </h1>
        <button className="btn-primary" onClick={loadNetworks}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {networks.length === 0 ? (
        <div className="card p-8 text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No networks found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Driver</th>
                <th className="table-header-cell">Scope</th>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {networks.map((network) => (
                <tr key={network.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="table-cell font-medium">{network.Name}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">{network.Driver}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">{network.Scope}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400 font-mono text-xs">{network.Id.substring(0, 12)}</td>
                  <td className="table-cell">
                    {!['bridge', 'host', 'none'].includes(network.Name) ? (
                      <button className="btn-danger" onClick={() => handleRemove(network.Id)} title="Remove">
                        <FiTrash2 className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">System</span>
                    )}
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

import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';

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
    return <div className="has-text-centered"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="title">Networks</h1>
      <button className="button is-primary action-button" onClick={loadNetworks}>
        Refresh
      </button>

      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Driver</th>
              <th>Scope</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {networks.map((network) => (
              <tr key={network.Id}>
                <td>{network.Name}</td>
                <td>{network.Driver}</td>
                <td>{network.Scope}</td>
                <td>{network.Id.substring(0, 12)}</td>
                <td>
                  {!['bridge', 'host', 'none'].includes(network.Name) && (
                    <button className="button is-small is-danger" onClick={() => handleRemove(network.Id)}>
                      Remove
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

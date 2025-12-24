import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';

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
    return <div className="has-text-centered"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="title">Volumes</h1>
      <button className="button is-primary action-button" onClick={loadVolumes}>
        Refresh
      </button>

      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Driver</th>
              <th>Mountpoint</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {volumes.map((volume) => (
              <tr key={volume.Name}>
                <td>{volume.Name}</td>
                <td>{volume.Driver}</td>
                <td>{volume.Mountpoint}</td>
                <td>
                  <button className="button is-small is-danger" onClick={() => handleRemove(volume.Name)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

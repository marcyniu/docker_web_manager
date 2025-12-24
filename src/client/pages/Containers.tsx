import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';

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
    return <div className="has-text-centered"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="title">Containers</h1>
      <button className="button is-primary action-button" onClick={loadContainers}>
        Refresh
      </button>

      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>State</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((container) => (
              <tr key={container.Id}>
                <td>{container.Names[0]?.replace('/', '')}</td>
                <td>{container.Image}</td>
                <td>
                  <span className={`status-${container.State}`}>
                    {container.State}
                  </span>
                </td>
                <td>{container.Status}</td>
                <td>
                  {container.State === 'running' ? (
                    <>
                      <button className="button is-small is-warning action-button" onClick={() => handleStop(container.Id)}>
                        Stop
                      </button>
                      <button className="button is-small is-info action-button" onClick={() => handleRestart(container.Id)}>
                        Restart
                      </button>
                    </>
                  ) : (
                    <button className="button is-small is-success action-button" onClick={() => handleStart(container.Id)}>
                      Start
                    </button>
                  )}
                  <button className="button is-small is-danger action-button" onClick={() => handleRemove(container.Id)}>
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

import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';

interface Stats {
  containers: number;
  running: number;
  images: number;
  volumes: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ containers: 0, running: 0, images: 0, volumes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [containersRes, imagesRes, volumesRes] = await Promise.all([
        apiClient.getContainers(true),
        apiClient.getImages(),
        apiClient.getVolumes()
      ]);

      const containers = containersRes.data || [];
      const running = containers.filter((c: any) => c.State === 'running').length;

      setStats({
        containers: containers.length,
        running,
        images: imagesRes.data?.length || 0,
        volumes: volumesRes.data?.length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="has-text-centered"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <div className="columns is-multiline">
        <div className="column is-3">
          <div className="card stat-card">
            <div className="stat-number">{stats.containers}</div>
            <div className="stat-label">Total Containers</div>
          </div>
        </div>
        <div className="column is-3">
          <div className="card stat-card">
            <div className="stat-number status-running">{stats.running}</div>
            <div className="stat-label">Running Containers</div>
          </div>
        </div>
        <div className="column is-3">
          <div className="card stat-card">
            <div className="stat-number">{stats.images}</div>
            <div className="stat-label">Images</div>
          </div>
        </div>
        <div className="column is-3">
          <div className="card stat-card">
            <div className="stat-number">{stats.volumes}</div>
            <div className="stat-label">Volumes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

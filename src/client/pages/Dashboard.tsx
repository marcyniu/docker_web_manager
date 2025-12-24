import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';
import { FiBox, FiPlay, FiLayers, FiDatabase } from 'react-icons/fi';

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Containers', 
      value: stats.containers, 
      icon: FiBox,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900'
    },
    { 
      label: 'Running Containers', 
      value: stats.running, 
      icon: FiPlay,
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-100 dark:bg-green-900'
    },
    { 
      label: 'Images', 
      value: stats.images, 
      icon: FiLayers,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900'
    },
    { 
      label: 'Volumes', 
      value: stats.volumes, 
      icon: FiDatabase,
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-100 dark:bg-orange-900'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <FiBox className="text-blue-600 dark:text-blue-400" />
          Dashboard
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon className="h-6 w-6 text-current" />
                </div>
              </div>
              <div className={`stat-number bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

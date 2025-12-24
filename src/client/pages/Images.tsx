import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';
import { FiLayers, FiRefreshCw, FiTrash2, FiDownload, FiAlertCircle } from 'react-icons/fi';

interface Image {
  Id: string;
  RepoTags: string[];
  Created: number;
  Size: number;
}

export const Images: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [pullName, setPullName] = useState('');
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await apiClient.getImages();
      setImages(response.data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this image?')) return;
    try {
      await apiClient.removeImage(id, true);
      await loadImages();
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handlePull = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pullName.trim()) return;
    setPulling(true);
    try {
      await apiClient.pullImage(pullName);
      setPullName('');
      await loadImages();
    } catch (error) {
      console.error('Error pulling image:', error);
    } finally {
      setPulling(false);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
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
          <FiLayers className="text-blue-600 dark:text-blue-400" />
          Images
        </h1>
      </div>
      
      <div className="card p-6 mb-6">
        <form onSubmit={handlePull} className="flex gap-3">
          <input
            className="input-field flex-1"
            type="text"
            placeholder="Image name (e.g., nginx:latest)"
            value={pullName}
            onChange={(e) => setPullName(e.target.value)}
            disabled={pulling}
          />
          <button type="submit" className="btn-primary" disabled={pulling}>
            <FiDownload className="mr-2 h-4 w-4" />
            {pulling ? 'Pulling...' : 'Pull Image'}
          </button>
        </form>
      </div>

      <button className="btn-secondary mb-6" onClick={loadImages}>
        <FiRefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </button>

      {images.length === 0 ? (
        <div className="card p-8 text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No images found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Repository:Tag</th>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Size</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {images.map((image) => (
                <tr key={image.Id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="table-cell font-medium">{image.RepoTags?.[0] || '<none>'}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400 font-mono text-xs">{image.Id.substring(7, 19)}</td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">{formatSize(image.Size)}</td>
                  <td className="table-cell">
                    <button className="btn-danger" onClick={() => handleRemove(image.Id)} title="Remove">
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

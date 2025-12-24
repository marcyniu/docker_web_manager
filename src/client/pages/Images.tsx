import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/ApiClient';

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
    try {
      await apiClient.pullImage(pullName);
      setPullName('');
      await loadImages();
    } catch (error) {
      console.error('Error pulling image:', error);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return <div className="has-text-centered"><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1 className="title">Images</h1>
      
      <div className="box">
        <form onSubmit={handlePull}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input"
                type="text"
                placeholder="Image name (e.g., nginx:latest)"
                value={pullName}
                onChange={(e) => setPullName(e.target.value)}
              />
            </div>
            <div className="control">
              <button type="submit" className="button is-primary">
                Pull Image
              </button>
            </div>
          </div>
        </form>
      </div>

      <button className="button is-info action-button" onClick={loadImages}>
        Refresh
      </button>

      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>Repository:Tag</th>
              <th>ID</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.Id}>
                <td>{image.RepoTags?.[0] || '<none>'}</td>
                <td>{image.Id.substring(7, 19)}</td>
                <td>{formatSize(image.Size)}</td>
                <td>
                  <button className="button is-small is-danger" onClick={() => handleRemove(image.Id)}>
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

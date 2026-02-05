import React, { useEffect, useState } from 'react';
import { Poster } from '../types/Poster';
import { posterService } from '../services/posterService';
import './PosterList.css';

export const PosterList: React.FC<{ refresh: number }> = ({ refresh }) => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadPosters();
  }, [refresh]);

  const loadPosters = async () => {
    try {
      setLoading(true);
      const data = await posterService.getAllPosters();
      setPosters(data);
      setError('');
    } catch (err) {
      setError('Failed to load posters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this poster?')) return;

    try {
      await posterService.deletePoster(id);
      loadPosters();
    } catch (err) {
      alert('Failed to delete poster');
      console.error(err);
    }
  };

  const handleDownload = async (poster: Poster) => {
    try {
      await posterService.incrementDownloadCount(poster.id);
      window.open(posterService.getImageUrl(poster.fileUrl), '_blank');
      loadPosters();
    } catch (err) {
      console.error(err);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) return <div className="loading">Loading posters...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="poster-list">
        <h2>Posters ({posters.length})</h2>
        {posters.length === 0 ? (
          <p>No posters yet. Upload your first one!</p>
        ) : (
          <div className="poster-grid">
            {posters.map((poster) => (
              <div key={poster.id} className="poster-card">
                <div 
                  className="poster-image" 
                  onClick={() => {
                    const imageUrl = poster.thumbnailUrl || poster.fileUrl;
                    if (!imageUrl.toLowerCase().endsWith('.pdf')) {
                      openImageModal(imageUrl);
                    }
                  }}
                  style={{ cursor: poster.thumbnailUrl || !poster.fileUrl.toLowerCase().endsWith('.pdf') ? 'pointer' : 'default' }}
                >
                  {poster.thumbnailUrl ? (
                    <img
                      src={posterService.getImageUrl(poster.thumbnailUrl)}
                      alt={poster.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                      }}
                    />
                  ) : poster.fileUrl.toLowerCase().endsWith('.pdf') ? (
                    <div className="pdf-placeholder">📄 PDF</div>
                  ) : (
                    <img
                      src={posterService.getImageUrl(poster.fileUrl)}
                      alt={poster.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                      }}
                    />
                  )}
                </div>
                <div className="poster-info">
                  <h3>{poster.title}</h3>
                  {poster.description && <p>{poster.description}</p>}
                  <div className="poster-meta">
                    <span>Size: {(poster.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>Downloads: {poster.downloadCount}</span>
                  </div>
                  <div className="poster-actions">
                    <button onClick={() => handleDownload(poster)} className="btn-download">
                      View/Download
                    </button>
                    {/* <button onClick={() => handleDelete(poster.id)} className="btn-delete">
                      Delete
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeImageModal}>&times;</button>
            <img src={posterService.getImageUrl(selectedImage)} alt="Full size" />
          </div>
        </div>
      )}
    </>
  );
};

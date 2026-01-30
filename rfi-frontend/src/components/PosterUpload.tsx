import React, { useState } from 'react';
import { posterService } from '../services/posterService';
import './PosterUpload.css';

export const PosterUpload: React.FC<{ onUploadSuccess: () => void }> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Please provide both a file and title');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await posterService.uploadPoster({ file, title, description });
      setFile(null);
      setTitle('');
      setDescription('');
      onUploadSuccess();
      alert('Poster uploaded successfully!');
    } catch (err) {
      setError('Failed to upload poster. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="poster-upload">
      <h2>Upload Poster</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file">File:</label>
          <input
            type="file"
            id="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Poster'}
        </button>
      </form>
    </div>
  );
};

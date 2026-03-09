import { useState } from 'react';
import { Poster } from '../../types/Poster';
import { posterService } from '../../services/posterService';

interface PosterAdminListProps {
  posters: Poster[];
  onDelete: (id: number) => void;
  onDownload: (poster: Poster) => void;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export const PosterAdminList: React.FC<PosterAdminListProps> = ({ posters, onDelete, onDownload, onUpdate }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (poster: Poster) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${poster.title}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingId(poster.id);
    try {
      await onDelete(poster.id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (poster: Poster) => {
    setEditingId(poster.id);
    setEditTitle(poster.title);
    setEditDescription(poster.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (posterId: number) => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }

    setSaving(true);
    try {
      await onUpdate(posterId, editTitle, editDescription);
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
    } catch (error) {
      console.error('Error updating poster:', error);
      alert('Failed to update poster');
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileExtension = (url: string): string => {
    const parts = url.split('.');
    return parts[parts.length - 1]?.toUpperCase() || 'FILE';
  };

  const isPDF = (url: string): boolean => {
    return url.toLowerCase().endsWith('.pdf');
  };

  if (posters.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Posters Yet</h3>
        <p className="text-gray-500">Upload your first poster to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posters.map((poster) => (
        <div
          key={poster.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Thumbnail/Preview */}
              <div className="flex-shrink-0">
                {poster.thumbnailUrl || !isPDF(poster.fileUrl) ? (
                  <img
                    src={posterService.getImageUrl(poster.thumbnailUrl || poster.fileUrl)}
                    alt={poster.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-red-50 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-pdf text-4xl text-red-500"></i>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {editingId === poster.id ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            placeholder="Enter description (optional)"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(poster.id)}
                            disabled={saving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                          >
                            {saving ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-1"></i>Saving...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save mr-1"></i>Save
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {poster.title}
                        </h3>
                        {poster.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {poster.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="fas fa-calendar"></i>
                            {formatDate(poster.uploadedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fas fa-file"></i>
                            {getFileExtension(poster.fileUrl)}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fas fa-hdd"></i>
                            {formatFileSize(poster.fileSize)}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fas fa-download"></i>
                            {poster.downloadCount} downloads
                          </span>
                        </div>
                        {poster.tags && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-600">
                              <i className="fas fa-tags mr-1"></i>
                              {poster.tags}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {editingId !== poster.id && (
                      <>
                        <button
                          onClick={() => handleEdit(poster)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => onDownload(poster)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button
                          onClick={() => toggleExpand(poster.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={expandedId === poster.id ? 'Collapse' : 'Expand'}
                        >
                          <i className={`fas fa-chevron-${expandedId === poster.id ? 'up' : 'down'}`}></i>
                        </button>
                        <button
                          onClick={() => handleDelete(poster)}
                          disabled={deletingId === poster.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === poster.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === poster.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">File Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File URL:</span>
                        <a
                          href={posterService.getImageUrl(poster.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {poster.fileUrl.split('/').pop()}
                        </a>
                      </div>
                      {poster.thumbnailUrl && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thumbnail URL:</span>
                          <a
                            href={posterService.getImageUrl(poster.thumbnailUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-xs"
                          >
                            {poster.thumbnailUrl.split('/').pop()}
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded:</span>
                        <span className="text-gray-900">
                          {new Date(poster.uploadedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="text-gray-900">{formatFileSize(poster.fileSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Downloads:</span>
                        <span className="text-gray-900">{poster.downloadCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-48">
                      {poster.thumbnailUrl || !isPDF(poster.fileUrl) ? (
                        <img
                          src={posterService.getImageUrl(poster.thumbnailUrl || poster.fileUrl)}
                          alt={poster.title}
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      ) : (
                        <div className="text-center">
                          <i className="fas fa-file-pdf text-6xl text-red-500 mb-2"></i>
                          <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {poster.description && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Full Description</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {poster.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

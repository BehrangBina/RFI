import { useState } from 'react';
import { NewsArticle } from '../../types/News';

interface NewsAdminListProps {
  newsList: NewsArticle[];
  onEdit: (news: NewsArticle) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const NewsAdminList: React.FC<NewsAdminListProps> = ({
  newsList,
  onEdit,
  onDelete,
  loading,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-2"></i>
        <p className="text-gray-600">Loading news articles...</p>
      </div>
    );
  }

  if (newsList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <i className="fas fa-newspaper text-5xl text-gray-300 mb-4"></i>
        <p className="text-gray-600 text-lg">No news articles yet</p>
        <p className="text-gray-500 text-sm mt-2">Click "Create News Article" to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsList.map((news) => (
        <div key={news.id} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <i className="fas fa-calendar text-blue-600"></i>
                  {formatDate(news.date)}
                </span>
                {news.category && (
                  <span className="flex items-center gap-1">
                    <i className="fas fa-tag text-blue-600"></i>
                    {news.category}
                  </span>
                )}
                {news.readTimeMinutes && (
                  <span className="flex items-center gap-1">
                    <i className="fas fa-clock text-blue-600"></i>
                    {news.readTimeMinutes} min read
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <i className="fas fa-layer-group text-blue-600"></i>
                  {news.sections.length} section{news.sections.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => toggleExpand(news.id)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                title={expandedId === news.id ? 'Collapse' : 'Expand'}
              >
                <i
                  className={`fas fa-chevron-${expandedId === news.id ? 'up' : 'down'}`}
                ></i>
              </button>
              <button
                onClick={() => onEdit(news)}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
              >
                <i className="fas fa-edit mr-1"></i>Edit
              </button>
              <button
                onClick={() => handleDelete(news.id, news.title)}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
              >
                <i className="fas fa-trash mr-1"></i>Delete
              </button>
            </div>
          </div>

          {/* Summary Preview */}
          <div className="px-4 pb-4">
            <p className="text-gray-700 text-sm line-clamp-2">{news.summary}</p>
          </div>

          {/* Expanded Content */}
          {expandedId === news.id && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              {/* Media Info */}
              {(news.videoUrl || news.imageUrl) && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Media:</h4>
                  <div className="flex gap-2 text-sm">
                    {news.videoUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        <i className="fas fa-video"></i>
                        Video
                      </span>
                    )}
                    {news.imageUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded">
                        <i className="fas fa-image"></i>
                        Image
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Sections */}
              {news.sections.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Sections:</h4>
                  <div className="space-y-3">
                    {news.sections
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((section, index) => (
                        <div
                          key={section.id}
                          className="bg-white border border-gray-200 rounded p-3"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">
                                  {section.sectionType.replace(/_/g, ' ')}
                                </span>
                              </div>
                              {section.title && (
                                <h5 className="font-medium text-gray-800">{section.title}</h5>
                              )}
                            </div>
                          </div>

                          {/* Key Points */}
                          {section.keyPoints.length > 0 && (
                            <div className="mt-2 ml-8">
                              <p className="text-xs text-gray-500 mb-1">
                                {section.keyPoints.length} key point
                                {section.keyPoints.length !== 1 ? 's' : ''}
                              </p>
                              <div className="space-y-1">
                                {section.keyPoints
                                  .sort((a, b) => a.orderIndex - b.orderIndex)
                                  .slice(0, 3)
                                  .map((kp) => (
                                    <div
                                      key={kp.id}
                                      className="text-sm text-gray-600 flex items-start gap-2"
                                    >
                                      <i className="fas fa-check-circle text-green-500 text-xs mt-1"></i>
                                      <span className="line-clamp-1">
                                        {kp.title || kp.description}
                                      </span>
                                    </div>
                                  ))}
                                {section.keyPoints.length > 3 && (
                                  <p className="text-xs text-gray-500 italic ml-5">
                                    +{section.keyPoints.length - 3} more
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>
                    <i className="fas fa-link mr-1"></i>
                    Slug: <code className="bg-gray-200 px-1 rounded">{news.slug}</code>
                  </span>
                  <span>
                    <i className="fas fa-clock mr-1"></i>
                    Created: {formatDate(news.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

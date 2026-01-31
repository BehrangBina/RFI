import { motion } from 'framer-motion';
import { NewsArticle } from '../../types/News';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  news: NewsArticle;
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow mb-8"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Video or Image */}
      {news.videoUrl && (
        <div className="relative pb-[56.25%] h-0 overflow-hidden bg-black">
          <iframe
            src={news.videoUrl}
            title={news.title}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {!news.videoUrl && news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-64 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {news.title}
        </h2>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 mb-5 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-calendar text-[#449CB2]"></i>
            <span>{formatDate(news.date)}</span>
          </div>
          {news.category && (
            <div className="flex items-center gap-2">
              <i className="fas fa-tag text-[#449CB2]"></i>
              <span>{news.category}</span>
            </div>
          )}
          {news.readTimeMinutes && (
            <div className="flex items-center gap-2">
              <i className="fas fa-clock text-[#449CB2]"></i>
              <span>{news.readTimeMinutes} min read</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mb-5">
          <h5 className="font-semibold text-gray-700 mb-2 text-lg">Summary</h5>
          <div className="max-h-36 overflow-y-auto p-4 bg-gray-50 rounded-lg text-gray-700 leading-relaxed custom-scrollbar">
            {news.summary}
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/news/${news.id}`}
          className="inline-block px-6 py-3 bg-[#449CB2] text-white font-semibold rounded-lg hover:bg-[#3a8ca0] transition-colors"
        >
          Read Full Article <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </motion.div>
  );
};

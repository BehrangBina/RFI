import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsArticle } from '../types/News';
import { newsService } from '../services/newsService';
import { NewsSectionComponent } from '../components/news/NewsSectionComponent';
import { FadeIn } from '../components/animations/FadeIn';
import { motion } from 'framer-motion';

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadNewsDetail(parseInt(id));
    }
  }, [id]);

  const loadNewsDetail = async (newsId: number) => {
    try {
      setLoading(true);
      const data = await newsService.getNewsById(newsId);
      setNews(data);
      setError('');
    } catch (err) {
      setError('Failed to load news article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <i className="fas fa-spinner text-4xl text-[#449CB2]"></i>
        </motion.div>
        <p className="text-gray-400 mt-4">Loading article...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error || 'News article not found'}
        </div>
        <Link to="/news" className="text-[#449CB2] hover:text-[#5bc0de]">
          <i className="fas fa-arrow-left mr-2"></i>Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <FadeIn direction="left">
        <Link
          to="/news"
          className="inline-flex items-center text-[#449CB2] hover:text-[#5bc0de] mb-6 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to News
        </Link>
      </FadeIn>

      {/* Article */}
      <motion.article
        className="bg-white rounded-xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            className="w-full h-96 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-8 md:p-12">
          <FadeIn delay={0.2}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>
          </FadeIn>

          {/* Meta info */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-5 mb-8 text-gray-600 text-sm pb-6 border-b border-gray-200">
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
          </FadeIn>

          {/* Summary */}
          <FadeIn delay={0.4}>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary</h3>
              <div className="p-5 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">
                {news.summary}
              </div>
            </div>
          </FadeIn>

          {/* Sections */}
          {news.sections
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((section, index) => (
              <NewsSectionComponent
                key={section.id}
                section={section}
                index={index}
              />
            ))}
        </div>
      </motion.article>
    </div>
  );
};

export default NewsDetail;

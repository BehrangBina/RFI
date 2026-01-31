import { useState, useEffect } from 'react';
import { NewsArticle } from '../types/News';
import { newsService } from '../services/newsService';
import { NewsCard } from '../components/news/NewsCard';
import { FadeIn } from '../components/animations/FadeIn';
import { motion } from 'framer-motion';

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews();
      setNews(data);
      setError('');
    } catch (err) {
      setError('Failed to load news articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <i className="fas fa-spinner text-4xl text-[#449CB2]"></i>
        </motion.div>
        <p className="text-gray-400 mt-4">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <FadeIn direction="down" className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Latest News</h1>
        <div className="h-1 w-24 bg-[#449CB2] mx-auto rounded-full"></div>
      </FadeIn>

      {news.length === 0 ? (
        <FadeIn>
          <div className="text-center py-12 text-gray-400">
            <i className="fas fa-newspaper text-6xl mb-4 opacity-50"></i>
            <p className="text-xl">No news articles available yet.</p>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-8">
          {news.map((article) => (
            <NewsCard key={article.id} news={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default News;

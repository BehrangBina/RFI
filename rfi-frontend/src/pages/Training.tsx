import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubjectCategory } from '../types/Training';
import { trainingService } from '../services/trainingService';
import { FadeIn } from '../components/animations/FadeIn';
import { motion } from 'framer-motion';

const Training = () => {
  const [categories, setCategories] = useState<SubjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getAllCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError('Failed to load training categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/training/category/${slug}`);
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
        <p className="text-gray-400 mt-4">Loading training categories...</p>
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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Training Center</h1>
        <p className="text-gray-300 text-lg mb-4">
          Explore our comprehensive training materials organized by subject
        </p>
        <div className="h-1 w-24 bg-[#449CB2] mx-auto rounded-full"></div>
      </FadeIn>

      {categories.length === 0 ? (
        <FadeIn>
          <div className="text-center py-12 text-gray-400">
            <i className="fas fa-graduation-cap text-6xl mb-4 opacity-50"></i>
            <p className="text-xl">No training categories available yet.</p>
          </div>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <FadeIn key={category.id} delay={index * 0.1}>
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700 hover:border-[#449CB2] transition-all duration-300 cursor-pointer h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleCategoryClick(category.slug)}
              >
                {category.imageUrl && (
                  <div className="h-48 overflow-hidden bg-slate-700">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#449CB2] to-[#2d7a8a]"><i class="fas fa-book-open text-6xl text-white/30"></i></div>';
                      }}
                    />
                  </div>
                )}
                {!category.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-[#449CB2] to-[#2d7a8a] flex items-center justify-center">
                    <i className="fas fa-book-open text-6xl text-white/30"></i>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#449CB2] flex items-center gap-2">
                      <i className="fas fa-book"></i>
                      {category.trainingCount || 0} training{category.trainingCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                      View <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;

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
            <motion.div
              key={category.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 hover:border-[#449CB2] transition-all duration-500 cursor-pointer group shadow-xl hover:shadow-2xl hover:shadow-[#449CB2]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleCategoryClick(category.slug)}
            >
              {/* Category Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={category.imageUrl?.startsWith('http') 
                    ? category.imageUrl 
                    : category.imageUrl 
                      ? `http://localhost:5000${category.imageUrl}`
                      : 'http://localhost:5000/images/training/constitutional-monarchy-intro.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  onError={(e) => {
                    e.currentTarget.src = 'http://localhost:5000/images/training/constitutional-monarchy-intro.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182134] via-[#182134]/60 to-transparent" />
                
                {/* Animated Orb */}
                <motion.div
                  className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#449CB2] to-[#5bb5cc] opacity-20"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Training Count Badge */}
                <div className="absolute top-4 left-4 bg-[#449CB2]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  <i className="fas fa-book mr-2"></i>
                  {category.trainingCount || 0} training{category.trainingCount !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Category Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#449CB2] transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-3 text-base">
                  {category.description}
                </p>
                <div className="flex items-center justify-end text-sm">
                  <motion.span 
                    className="text-[#449CB2] flex items-center gap-2 font-medium"
                    whileHover={{ gap: '0.75rem' }}
                  >
                    View Details <i className="fas fa-arrow-right"></i>
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;

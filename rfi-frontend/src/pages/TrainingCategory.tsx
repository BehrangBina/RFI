import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubjectCategory, Training } from '../types/Training';
import { trainingService } from '../services/trainingService';
import { FadeIn } from '../components/animations/FadeIn';
import { motion } from 'framer-motion';

const TrainingCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<SubjectCategory | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadCategory(slug);
    }
  }, [slug]);

  const loadCategory = async (categorySlug: string) => {
    try {
      setLoading(true);
      const categoryData = await trainingService.getCategoryBySlug(categorySlug);
      setCategory(categoryData);
      
      if (categoryData.id) {
        const trainingsData = await trainingService.getTrainingsByCategory(categoryData.id);
        setTrainings(trainingsData);
      }
      setError('');
    } catch (err) {
      setError('Failed to load training category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainingClick = (trainingSlug: string) => {
    navigate(`/training/view/${trainingSlug}`);
  };

  const handleBackClick = () => {
    navigate('/training');
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
        <p className="text-gray-400 mt-4">Loading training materials...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error || 'Category not found'}
        </div>
        <button
          onClick={handleBackClick}
          className="mt-4 text-[#449CB2] hover:text-[#5bb5cc] transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Training
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={handleBackClick}
        className="mb-6 text-[#449CB2] hover:text-[#5bb5cc] transition-colors flex items-center gap-2"
      >
        <i className="fas fa-arrow-left"></i>
        Back to Training
      </button>

      <FadeIn direction="down" className="mb-12">
        <div className="relative h-64 rounded-lg overflow-hidden mb-8">
          {category.imageUrl ? (
            <>
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#449CB2] to-[#2d7a8a]"></div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {category.name}
            </h1>
            <p className="text-gray-200 text-lg max-w-3xl">
              {category.description}
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Available Training Materials</h2>
        <div className="h-1 w-16 bg-[#449CB2] rounded-full"></div>
      </div>

      {trainings.length === 0 ? (
        <FadeIn>
          <div className="text-center py-12 text-gray-400 bg-slate-800/30 rounded-lg">
            <i className="fas fa-book-open text-6xl mb-4 opacity-50"></i>
            <p className="text-xl">No training materials available yet for this category.</p>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {trainings.map((training, index) => (
            <FadeIn key={training.id} delay={index * 0.1}>
              <motion.div
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 hover:border-[#449CB2] transition-all duration-300 cursor-pointer"
                whileHover={{ x: 8 }}
                onClick={() => handleTrainingClick(training.slug)}
              >
                <div className="p-6 flex items-start gap-4">
                  {training.imageUrl && (
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-700">
                      <img
                        src={training.imageUrl}
                        alt={training.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {training.title}
                    </h3>
                    {training.summary && (
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {training.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {training.readTimeMinutes && (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-clock text-[#449CB2]"></i>
                          {training.readTimeMinutes} min read
                        </span>
                      )}
                      {training.videoUrl && (
                        <span className="flex items-center gap-2">
                          <i className="fas fa-video text-[#449CB2]"></i>
                          Video included
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-[#449CB2] text-2xl">
                    <i className="fas fa-chevron-right"></i>
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

export default TrainingCategory;

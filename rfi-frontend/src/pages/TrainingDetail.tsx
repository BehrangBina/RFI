import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Training } from '../types/Training';
import { trainingService } from '../services/trainingService';
import { FadeIn } from '../components/animations/FadeIn';
import { motion } from 'framer-motion';

const TrainingDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadTraining(slug);
    }
  }, [slug]);

  const loadTraining = async (trainingSlug: string) => {
    try {
      setLoading(true);
      const data = await trainingService.getTrainingBySlug(trainingSlug);
      setTraining(data);
      setError('');
    } catch (err) {
      setError('Failed to load training');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
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
        <p className="text-gray-400 mt-4">Loading training...</p>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error || 'Training not found'}
        </div>
        <button
          onClick={handleBackClick}
          className="mt-4 text-[#449CB2] hover:text-[#5bb5cc] transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={handleBackClick}
        className="mb-6 text-[#449CB2] hover:text-[#5bb5cc] transition-colors flex items-center gap-2"
      >
        <i className="fas fa-arrow-left"></i>
        Back
      </button>

      <FadeIn direction="down">
        <article className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
          {training.imageUrl && (
            <div className="h-80 overflow-hidden bg-slate-700">
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

          <div className="p-8">
            <div className="mb-6">
              {training.subjectCategoryName && (
                <span className="inline-block bg-[#449CB2]/20 text-[#449CB2] px-3 py-1 rounded-full text-sm mb-4">
                  {training.subjectCategoryName}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {training.title}
              </h1>
              {training.summary && (
                <p className="text-xl text-gray-300 mb-4">
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
                <span className="flex items-center gap-2">
                  <i className="fas fa-calendar text-[#449CB2]"></i>
                  {new Date(training.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-700 my-8"></div>

            {training.videoUrl && (
              <div className="mb-8">
                <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden bg-slate-900">
                  <iframe
                    src={training.videoUrl.includes('youtube.com/watch') 
                      ? training.videoUrl.replace('watch?v=', 'embed/')
                      : training.videoUrl.includes('youtu.be/')
                      ? training.videoUrl.replace('youtu.be/', 'youtube.com/embed/')
                      : training.videoUrl}
                    title={training.title}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-6
                prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:pl-6
                prose-li:mb-2
                prose-strong:text-white prose-strong:font-semibold
                prose-a:text-[#449CB2] prose-a:no-underline hover:prose-a:underline
                prose-table:border-collapse prose-table:w-full
                prose-th:bg-slate-700 prose-th:text-white prose-th:p-3 prose-th:text-left
                prose-td:border prose-td:border-slate-700 prose-td:p-3 prose-td:text-gray-300"
              dangerouslySetInnerHTML={{ __html: training.content }}
            />
          </div>
        </article>
      </FadeIn>
    </div>
  );
};

export default TrainingDetail;

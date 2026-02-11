import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Training } from '../types/Training';
import { trainingService } from '../services/trainingService';
import { motion, useScroll } from 'framer-motion';

const TrainingDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "end start"]
  });

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
    <div className="max-w-5xl mx-auto px-4 py-8" ref={contentRef}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#449CB2] to-[#5bb5cc] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      
      <motion.button
        onClick={handleBackClick}
        className="mb-8 text-[#449CB2] hover:text-[#5bb5cc] transition-all duration-300 flex items-center gap-2 group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -5 }}
      >
        <i className="fas fa-arrow-left group-hover:animate-pulse"></i>
        <span className="font-medium">Back to Training</span>
      </motion.button>

      <article>
        {/* Header Section with Image */}
        {training.imageUrl && (
          <motion.div
            className="relative h-96 overflow-hidden rounded-2xl mb-8 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#182134] via-[#182134]/60 to-transparent z-10" />
            <img
              src={training.imageUrl.startsWith('http') 
                ? training.imageUrl 
                : `http://localhost:5000${training.imageUrl}`}
              alt={training.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              {training.subjectCategoryName && (
                <motion.span
                  className="inline-block bg-[#449CB2] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <i className="fas fa-bookmark mr-2"></i>
                  {training.subjectCategoryName}
                </motion.span>
              )}
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {training.title}
              </motion.h1>
            </div>
          </motion.div>
        )}

        {/* Summary Card */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-[#449CB2]/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {training.summary && (
            <motion.p
              className="text-xl leading-relaxed text-white mb-6 font-light relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {training.summary}
            </motion.p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm relative z-10">
            {training.readTimeMinutes && (
              <motion.div
                className="flex items-center gap-2 text-white bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/50"
                whileHover={{ scale: 1.08, y: -2 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.i
                  className="fas fa-clock text-[#449CB2]"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-medium">{training.readTimeMinutes} min read</span>
              </motion.div>
            )}
            <motion.div
              className="flex items-center gap-2 text-white bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/50"
              whileHover={{ scale: 1.08, y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <i className="fas fa-calendar text-[#449CB2]"></i>
              <span className="font-medium">{new Date(training.createdAt).toLocaleDateString()}</span>
            </motion.div>
            {training.videoUrl && (
              <motion.div
                className="flex items-center gap-2 text-white bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/50"
                whileHover={{ scale: 1.08, y: -2 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.i
                  className="fas fa-video text-[#449CB2]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-medium">Video included</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Video Section */}
        {training.videoUrl && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700/50">
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
          </motion.div>
        )}

        {/* Content Section */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <style>{`
            .training-content * {
              color: white !important;
            }
            .training-content h2 {
              font-size: 2.5rem !important;
              font-weight: 800 !important;
              margin-top: 3rem !important;
              margin-bottom: 2rem !important;
              padding-bottom: 1rem !important;
              border-bottom: 2px solid rgba(68, 156, 178, 0.3) !important;
              background: linear-gradient(to right, #449CB2, #5bb5cc) !important;
              -webkit-background-clip: text !important;
              -webkit-text-fill-color: transparent !important;
              background-clip: text !important;
              animation: fadeInUp 0.6s ease-out !important;
            }
            .training-content h3 {
              font-size: 1.875rem !important;
              font-weight: 700 !important;
              margin-top: 2.5rem !important;
              margin-bottom: 1.5rem !important;
              color: white !important;
              animation: fadeInUp 0.6s ease-out !important;
            }
            .training-content p {
              font-size: 1.25rem !important;
              line-height: 2 !important;
              margin-bottom: 1.5rem !important;
              color: white !important;
              animation: fadeIn 0.8s ease-out !important;
            }
            .training-content ul {
              margin-bottom: 2rem !important;
              padding-left: 0 !important;
            }
            .training-content li {
              font-size: 1.125rem !important;
              padding-left: 2rem !important;
              margin-bottom: 1rem !important;
              position: relative !important;
              color: white !important;
              animation: slideInLeft 0.5s ease-out !important;
              transition: transform 0.3s ease !important;
            }
            .training-content li:hover {
              transform: translateX(8px) !important;
            }
            .training-content li:before {
              content: '▸' !important;
              position: absolute !important;
              left: 0 !important;
              color: #449CB2 !important;
              font-size: 1.5rem !important;
              font-weight: bold !important;
              animation: pulse 2s infinite !important;
            }
            .training-content strong {
              font-weight: 800 !important;
              background: rgba(71, 85, 105, 0.5) !important;
              padding: 0.25rem 0.5rem !important;
              border-radius: 0.25rem !important;
              color: white !important;
            }
            .training-content table {
              width: 100% !important;
              margin: 2rem 0 !important;
              border-collapse: collapse !important;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
              border-radius: 0.75rem !important;
              overflow: hidden !important;
              animation: fadeInUp 0.8s ease-out !important;
            }
            .training-content thead {
              background: linear-gradient(to right, #449CB2, #5bb5cc) !important;
            }
            .training-content th {
              padding: 1.25rem !important;
              text-align: left !important;
              font-weight: 700 !important;
              font-size: 1.125rem !important;
              color: white !important;
              border: none !important;
            }
            .training-content td {
              padding: 1.25rem !important;
              border: 1px solid rgba(71, 85, 105, 0.5) !important;
              background: rgba(30, 41, 59, 0.3) !important;
              color: white !important;
              font-size: 1.0625rem !important;
              transition: all 0.3s ease !important;
            }
            .training-content tr:hover td {
              background: rgba(51, 65, 85, 0.3) !important;
              transform: scale(1.01) !important;
            }
            .training-content a {
              color: #449CB2 !important;
              font-weight: 600 !important;
              text-decoration: none !important;
              transition: all 0.3s ease !important;
            }
            .training-content a:hover {
              color: #5bb5cc !important;
              text-decoration: underline !important;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.6;
              }
            }
          `}</style>
          <div 
            className="training-content"
            dangerouslySetInnerHTML={{ __html: training.content }}
          />
        </motion.div>

        {/* Back to Top  Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-[#449CB2] to-[#5bb5cc] text-white p-4 rounded-full shadow-2xl z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className="fas fa-arrow-up text-xl"></i>
        </motion.button>
      </article>
    </div>
  );
};

export default TrainingDetail;

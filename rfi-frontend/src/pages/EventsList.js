import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsAPI } from '../services/api';
import { useFetch } from '../hooks/useApi';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/UIComponents';
import { ROUTES } from '../constants';

function EventsList() {
  const { data: events, loading, error } = useFetch(() => eventsAPI.getAll());

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          🎉 All Events
        </motion.h1>
      
        {!events || events.length === 0 ? (
          <EmptyState icon="🎭" message="No events found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Link 
                  to={`${ROUTES.EVENTS}/${event.id}`}
                  className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
                >
                  {event.imageUrls && event.imageUrls.length > 0 && (
                    <div className="overflow-hidden">
                      <img 
                        src={event.imageUrls[0]} 
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <span className="text-xl">📍</span> {event.location}
                    </p>
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                      <span className="text-xl">📅</span>
                      {new Date(event.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-700 line-clamp-3">{event.description}</p>
                    <div className="mt-4 text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                      Learn More <span>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsList;

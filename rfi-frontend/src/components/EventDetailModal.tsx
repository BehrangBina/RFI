import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../services/eventService';

const API_BASE_URL = 'http://localhost:5000';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 py-8 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-8 border-b border-gray-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <div className="pr-12">
                <span className="inline-block px-3 py-1 bg-[#46A2B9]/20 text-[#46A2B9] rounded-full text-sm font-medium mb-3 capitalize">
                  {event.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {event.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-400">
                  <span className="flex items-center gap-2">
                    📅 {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    📍 {event.location}
                  </span>
                  {event.attendeeCount && (
                    <span className="flex items-center gap-2">
                      👥 {event.attendeeCount} attendees
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Image Gallery */}
              {event.images.length > 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={`${API_BASE_URL}${event.images[selectedImageIndex].imageUrl}`}
                      alt={event.images[selectedImageIndex].caption}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  {event.images[selectedImageIndex].caption && (
                    <p className="text-gray-400 text-sm text-center italic">
                      {event.images[selectedImageIndex].caption}
                    </p>
                  )}
                  
                  {/* Thumbnail Gallery */}
                  {event.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {event.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-[#46A2B9] ring-2 ring-[#46A2B9]/50'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <img
                            src={`${API_BASE_URL}${image.imageUrl}`}
                            alt={image.caption}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video */}
              {event.videoUrl && (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={event.videoUrl}
                    title={event.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300 leading-relaxed">
                  {event.summary}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-white mb-3">About This Event</h3>
                <p className="text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Sections */}
              {event.sections.length > 0 && (
                <div className="space-y-4">
                  {event.sections
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((section) => (
                      <div
                        key={section.id}
                        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                      >
                        <h4 className="text-lg font-bold text-[#46A2B9] mb-3">
                          {section.title}
                        </h4>
                        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-900/50">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#46A2B9] hover:bg-[#5bc0de] text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetailModal;

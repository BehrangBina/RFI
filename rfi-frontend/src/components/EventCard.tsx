import React from 'react';
import { motion } from 'framer-motion';
import { Event } from '../services/eventService';

interface EventCardProps {
  event: Event;
  isLeft: boolean;
  onViewDetails: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isLeft, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vigil':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'rally':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'statement':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'solidarity':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'vigil':
        return '🕯️';
      case 'rally':
        return '📢';
      case 'statement':
        return '📝';
      case 'solidarity':
        return '🤝';
      default:
        return '📅';
    }
  };

  return (
    <div className={`flex items-center justify-between ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
        className={`w-full md:w-5/12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700 hover:border-[#46A2B9] transition-all cursor-pointer ${
          isLeft ? 'md:text-right' : 'md:text-left'
        }`}
        onClick={() => onViewDetails(event)}
      >
        {/* Image */}
        {event.images.length > 0 && (
          <div className="h-48 overflow-hidden">
            <img
              src={event.images[0].imageUrl}
              alt={event.images[0].caption}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-3 ${getCategoryColor(event.category)}`}>
            <span>{getCategoryIcon(event.category)}</span>
            <span className="capitalize">{event.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              📅 {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              📍 {event.location}
            </span>
          </div>

          {/* Summary */}
          <p className="text-gray-300 mb-4 line-clamp-3">
            {event.summary}
          </p>

          {/* Read More Button */}
          <motion.button
            whileHover={{ x: isLeft ? -5 : 5 }}
            className="text-[#46A2B9] font-semibold hover:text-[#5bc0de] transition-colors inline-flex items-center gap-2"
          >
            Read More
            <span>{isLeft ? '←' : '→'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Timeline Dot */}
      <div className="hidden md:flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-6 h-6 rounded-full bg-[#46A2B9] shadow-lg shadow-[#46A2B9]/50 ring-4 ring-gray-800"
        />
      </div>

      {/* Spacer for opposite side */}
      <div className="hidden md:block w-5/12"></div>
    </div>
  );
};

export default EventCard;

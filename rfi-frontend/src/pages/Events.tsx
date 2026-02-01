import React, { useState, useEffect } from 'react';
import { eventService, Event } from '../services/eventService';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import { TimelineItem } from '../components/animations/TimelineAnimation';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await eventService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const filterEvents = async (category: string) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      
      if (category === 'all') {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } else {
        const data = await eventService.getEventsByCategory(category);
        setEvents(data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to filter events. Please try again later.');
      console.error('Error filtering events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46A2B9] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadEvents}
            className="px-6 py-2 bg-[#46A2B9] text-white rounded-lg hover:bg-[#5bc0de] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Our Events Timeline
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Join us in standing up for freedom and human rights. Browse our past and upcoming events.
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => filterEvents('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#46A2B9] text-white shadow-lg shadow-[#46A2B9]/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Events
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterEvents(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-[#46A2B9] text-white shadow-lg shadow-[#46A2B9]/50'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-gray-400 text-lg">No events found for this category.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto relative">
          {/* Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#46A2B9] via-[#46A2B9]/50 to-transparent hidden md:block"></div>

          {/* Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <TimelineItem key={event.id} isLeft={index % 2 === 0}>
                <EventCard
                  event={event}
                  isLeft={index % 2 === 0}
                  onViewDetails={handleViewDetails}
                />
              </TimelineItem>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Events;

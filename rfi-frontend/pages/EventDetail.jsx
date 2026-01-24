import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsAPI, postersAPI } from '../services/api';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event details
    eventsAPI.getById(id)
      .then(response => {
        setEvent(response.data);
        return postersAPI.getByEventId(id);
      })
      .then(response => {
        setPosters(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleDownload = async (poster) => {
    try {
      // Track the download
      await postersAPI.trackDownload(poster.id);
      
      // Update local state
      setPosters(posters.map(p => 
        p.id === poster.id 
          ? { ...p, downloadCount: p.downloadCount + 1 }
          : p
      ));

      // In production, this would trigger actual file download
      alert(`Downloading: ${poster.title}\nDownload count: ${poster.downloadCount + 1}`);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Event not found</h2>
          <Link to="/events" className="text-blue-600 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-8">
        {/* Back button */}
        <Link 
          to="/events" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg">
                  {new Date(event.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{event.location}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {event.detailedContent}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Posters Section */}
        {posters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-6">Download Posters & Flyers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={poster.thumbnailUrl} 
                    alt={poster.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{poster.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Size: {(poster.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Downloads: {poster.downloadCount}
                    </p>
                    <button
                      onClick={() => handleDownload(poster)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Support This Event</h2>
          <p className="text-xl mb-6">Your donation helps make events like this possible</p>
          <Link 
            to="/donate"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            Donate Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default EventDetail;
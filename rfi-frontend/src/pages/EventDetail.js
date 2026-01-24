import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    eventsAPI.getById(id)
      .then(response => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading event...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
        <button 
          onClick={() => navigate('/events')}
          className="mt-4 text-primary hover:underline"
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Event not found</p>
        <button 
          onClick={() => navigate('/events')}
          className="mt-4 text-primary hover:underline"
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/events')}
        className="mb-6 text-primary hover:underline flex items-center gap-2"
      >
        ← Back to Events
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {event.imageUrl && (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-col gap-3 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span className="text-lg">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span className="text-lg">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-3">About this event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {event.imageUrls && event.imageUrls.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.imageUrls.map((url, index) => (
                  <img 
                    key={index}
                    src={url} 
                    alt={`${event.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;

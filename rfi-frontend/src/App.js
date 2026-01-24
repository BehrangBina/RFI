import React, { useEffect, useState } from 'react';
import { eventsAPI } from './services/api';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    eventsAPI.getAll()
      .then(response => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">{event.location}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p className="mt-4">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
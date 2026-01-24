import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-5xl font-bold mb-6">Welcome to RFI Events</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Discover and participate in amazing events. Connect with people who share your interests.
          </p>
          <Link 
            to="/events"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
            <p className="text-gray-600">
              Stay updated with the latest events and never miss out
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
            <p className="text-gray-600">
              Simple and quick registration process for all events
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Join a vibrant community of event enthusiasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

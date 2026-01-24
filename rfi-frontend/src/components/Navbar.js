import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              RFI
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Events
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            RFI Community
          </Link>
          <div className="space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-blue-600 font-semibold">
              Events
            </Link>
            <Link to="/donate" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 font-semibold">
              Donate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
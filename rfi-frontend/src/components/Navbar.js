import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-white flex items-center">
            <span className="mr-2">🌟</span>
            RFI Community
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-300 font-semibold text-lg transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-white hover:text-yellow-300 font-semibold text-lg transition-colors"
            >
              Events
            </Link>
            <Link 
              to="/donate" 
              className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full hover:bg-yellow-300 font-bold text-lg shadow-lg transition-all hover:shadow-xl"
            >
              💝 Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-yellow-300 font-semibold text-lg py-2 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-yellow-300 font-semibold text-lg py-2 transition-colors"
            >
              Events
            </Link>
            <Link 
              to="/donate" 
              onClick={() => setIsOpen(false)}
              className="block bg-yellow-400 text-blue-900 px-6 py-2 rounded-full hover:bg-yellow-300 font-bold text-lg shadow-lg mt-2 text-center"
            >
              💝 Donate
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
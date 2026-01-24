import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses =
    'text-white font-semibold tracking-wide uppercase text-sm xl:text-base transition-colors duration-200 hover:text-yellow-100';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#46A2B9]/95 shadow-lg backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
            <span className="text-yellow-200 text-3xl">✺</span>
            <span>Rise For Iran</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <Link
              to="/"
              className={[
                linkClasses,
                'relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:scale-x-0 after:bg-white/80 after:origin-left after:transition-transform hover:after:scale-x-100',
              ].join(' ')}
            >
              Home
            </Link>
            <Link to="/events" className={linkClasses}>
              Events
            </Link>
            <Link to="/donate" className="pill-button pill-button--secondary shadow-glow">
              💝 Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle navigation"
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
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-xl bg-white/10 text-white font-semibold tracking-wide"
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-xl bg-white/10 text-white font-semibold tracking-wide"
            >
              Events
            </Link>
            <Link
              to="/donate"
              onClick={() => setIsOpen(false)}
              className="block text-center pill-button pill-button--secondary"
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
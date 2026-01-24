import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-32 px-8 text-center"
      >
        <motion.h1 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl font-bold mb-6"
        >
          Welcome to Our Community
        </motion.h1>
        <motion.p 
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl mb-8"
        >
          Making a difference, one event at a time
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <Link 
            to="/events" 
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            View Events
          </Link>
        </motion.div>
      </motion.section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-5xl font-bold text-blue-600 mb-2">100+</h3>
              <p className="text-gray-600">Events Organized</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-5xl font-bold text-green-600 mb-2">$50K+</h3>
              <p className="text-gray-600">Donations Raised</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-5xl font-bold text-purple-600 mb-2">5K+</h3>
              <p className="text-gray-600">Community Members</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Support Our Cause</h2>
        <p className="text-xl mb-8">Every donation makes a difference</p>
        <Link 
          to="/donate" 
          className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-shadow inline-block"
        >
          Donate Now
        </Link>
      </section>
    </div>
  );
}

export default Home;
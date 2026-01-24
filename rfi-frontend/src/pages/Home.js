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
        className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-32 px-8 text-center overflow-hidden"
      >
        {/* Animated background circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-6xl md:text-7xl font-bold mb-6"
          >
            Welcome to Our Community
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl mb-10 max-w-3xl mx-auto"
          >
            Making a difference, one event at a time 🌍
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/events" 
              className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              🎉 View Events
            </Link>
            <Link 
              to="/donate" 
              className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              💝 Donate Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Our Impact
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white p-10 rounded-2xl shadow-xl"
            >
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-5xl font-bold text-blue-600 mb-2">100+</h3>
              <p className="text-gray-600 text-lg">Events Organized</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-10 rounded-2xl shadow-xl"
            >
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-5xl font-bold text-green-600 mb-2">$50K+</h3>
              <p className="text-gray-600 text-lg">Donations Raised</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-10 rounded-2xl shadow-xl"
            >
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-5xl font-bold text-purple-600 mb-2">5K+</h3>
              <p className="text-gray-600 text-lg">Community Members</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">Support Our Cause</h2>
          <p className="text-2xl mb-10 max-w-2xl mx-auto">
            Every donation makes a difference in our community 💪
          </p>
          <Link 
            to="/donate" 
            className="inline-block bg-yellow-400 text-blue-900 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            💝 Donate Now
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-lg">© 2026 RFI Community. Making the world better, together.</p>
      </footer>
    </div>
  );
}

export default Home;
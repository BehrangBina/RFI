import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
    />
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
    >
      <strong className="font-bold">Error: </strong>
      <span>{message}</span>
    </motion.div>
  </div>
);

export const EmptyState = ({ icon = '🎭', message = 'No data found' }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20"
  >
    <div className="text-6xl mb-4">{icon}</div>
    <p className="text-2xl text-gray-600">{message}</p>
  </motion.div>
);

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineItemProps {
  children: React.ReactNode;
  isLeft: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ children, isLeft }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

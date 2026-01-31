import { motion } from 'framer-motion';

interface ActivityCardProps {
  title: string;
  description: string;
  icon?: string;
}

export const ActivityCard = ({ title, description, icon }: ActivityCardProps) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && (
        <div className="text-4xl mb-4">{icon}</div>
      )}
      <h5 className="text-xl font-semibold text-white mb-3">{title}</h5>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
};

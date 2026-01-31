import { motion } from 'framer-motion';
import { KeyPoint } from '../../types/News';

interface KeyPointItemProps {
  keyPoint: KeyPoint;
  index: number;
}

export const KeyPointItem = ({ keyPoint, index }: KeyPointItemProps) => {
  return (
    <motion.div
      className="flex gap-3 mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#449CB2]"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 5, backgroundColor: '#f0f9ff' }}
    >
      <div className="flex-shrink-0 text-[#449CB2] mt-1">
        <i className="fas fa-check-circle"></i>
      </div>
      <div className="flex-1">
        {keyPoint.title && (
          <h6 className="font-semibold text-gray-900 mb-1">{keyPoint.title}</h6>
        )}
        <p className="text-gray-700 text-sm leading-relaxed">{keyPoint.description}</p>
      </div>
    </motion.div>
  );
};

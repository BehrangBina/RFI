import { motion } from 'framer-motion';
import { NewsSection } from '../../types/News';
import { KeyPointItem } from './KeyPointItem';

interface NewsSectionComponentProps {
  section: NewsSection;
  index: number;
}

export const NewsSectionComponent = ({ section, index }: NewsSectionComponentProps) => {
  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
    >
      {section.title && (
        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-[#449CB2] pb-2 inline-block">
          {section.title}
        </h4>
      )}
      
      <div className="mt-4">
        {section.keyPoints.map((keyPoint, idx) => (
          <KeyPointItem key={keyPoint.id} keyPoint={keyPoint} index={idx} />
        ))}
      </div>
    </motion.div>
  );
};

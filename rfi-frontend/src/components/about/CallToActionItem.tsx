import { motion } from 'framer-motion';

interface CallToActionItemProps {
  number: number;
  text: string;
}

export const CallToActionItem = ({ number, text }: CallToActionItemProps) => {
  return (
    <motion.li
      className="mb-4 p-4 bg-gradient-to-r from-[#00AEB2]/10 to-transparent rounded-lg border-l-4 border-[#00AEB2]"
      whileHover={{ x: 10, backgroundColor: 'rgba(70, 162, 185, 0.1)' }}
      transition={{ type: "spring" as const, stiffness: 300 }}
    >
      <div className="flex gap-4 items-start">
        <span className="flex-shrink-0 w-8 h-8 bg-[#00AEB2] text-white rounded-full flex items-center justify-center font-bold">
          {number}
        </span>
        <p className="text-gray-200 leading-relaxed">{text}</p>
      </div>
    </motion.li>
  );
};

import { motion } from 'framer-motion';

const Card = ({ children, className = '', whileHover = {}, ...props }) => {
  return (
    <motion.div
      whileHover={whileHover}
      className={`bg-white rounded-lg p-6 border border-gray-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
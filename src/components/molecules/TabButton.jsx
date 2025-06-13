import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TabButton = ({ isActive, onClick, icon, label, count, className = '', iconClassName = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {icon && <ApperIcon name={icon} size={16} className={`mr-2 ${iconClassName}`} />}
      {label}
      {typeof count === 'number' && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          isActive
            ? 'bg-white bg-opacity-20 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  );
};

export default TabButton;
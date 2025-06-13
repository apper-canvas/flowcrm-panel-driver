import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onChange}
      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        checked
          ? 'bg-success border-success text-white'
          : 'border-gray-300 hover:border-primary'
      } ${className}`}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <ApperIcon name="Check" size={12} />
        </motion.div>
      )}
    </motion.button>
  );
};

export default Checkbox;
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-full p-6"
    >
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="AlertCircle" size={48} className="text-white" />
        </motion.div>
        
        <Text as="h1" className="text-6xl font-heading font-bold text-gray-900 mb-4">404</Text>
        <Text as="h2" className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</Text>
        <Text className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a different location.
        </Text>
        
        <div className="space-y-4">
          <Link to="/pipeline">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 inline-flex items-center"
            >
              <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
              Back to Pipeline
            </Button>
          </Link>
          
          <div className="text-center">
            <Link to="/contacts" className="text-primary hover:text-secondary transition-colors">
              View Contacts
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <Link to="/tasks" className="text-primary hover:text-secondary transition-colors">
              View Tasks
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
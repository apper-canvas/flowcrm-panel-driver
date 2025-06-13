import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DealCard = ({ contact, onClick, onDragStart, className = '' }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
    draggable
    onDragStart={(e) => onDragStart(e, contact)}
    onClick={() => onClick(contact)}
    className={`bg-white rounded-lg p-4 border border-gray-200 cursor-move shadow-sm hover:shadow-md transition-all duration-150 ${className}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <Text as="h4" className="font-semibold text-gray-900 truncate">{contact.name}</Text>
        <Text className="text-sm text-gray-600 truncate">{contact.company}</Text>
        <Text className="text-xs text-gray-500 truncate">{contact.email}</Text>
      </div>
      <div className="ml-2 flex-shrink-0">
        <Text className="text-sm font-bold text-primary">
          ${contact.dealValue?.toLocaleString() || '0'}
        </Text>
      </div>
    </div>
    
    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
      <div className="flex items-center">
        <ApperIcon name="User" size={12} className="mr-1" />
        {contact.assignedTo}
      </div>
      <div className="flex items-center">
        <ApperIcon name="Clock" size={12} className="mr-1" />
        {new Date(contact.lastContactedAt).toLocaleDateString()}
      </div>
    </div>
    
    {/* Deal value indicator bar */}
    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
        style={{ 
          width: `${Math.min((contact.dealValue || 0) / 100000 * 100, 100)}%` 
        }}
      />
    </div>
  </motion.div>
);

export default DealCard;
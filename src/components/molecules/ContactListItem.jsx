import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const ContactListItem = ({ contact, index, onEdit, onDelete }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'lead': return 'bg-gray-100 text-gray-700';
      case 'qualified': return 'bg-blue-100 text-blue-700';
      case 'proposal': return 'bg-yellow-100 text-yellow-700';
      case 'negotiation': return 'bg-orange-100 text-orange-700';
      case 'closed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card
      key={contact.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      className="p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <Text as="h3" className="font-semibold text-gray-900 truncate">{contact.name}</Text>
              <Text className="text-sm text-gray-600 truncate">{contact.email}</Text>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <Text className="text-sm font-medium text-gray-900">{contact.company}</Text>
            <Text className="text-xs text-gray-500">{contact.phone}</Text>
          </div>

          <div className="text-right">
            <Text className="text-sm font-bold text-primary">
              ${contact.dealValue?.toLocaleString() || '0'}
            </Text>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(contact.status)}`}>
              {contact.status}
            </span>
          </div>

          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => onEdit(contact)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-primary">
              <ApperIcon name="Edit" size={16} />
            </Button>
            <Button variant="ghost" onClick={() => onDelete(contact.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-error">
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactListItem;
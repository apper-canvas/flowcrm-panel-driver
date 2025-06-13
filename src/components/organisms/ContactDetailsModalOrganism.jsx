import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import CommunicationLogFormOrganism from '@/components/organisms/CommunicationLogFormOrganism';

const ContactDetailsModalOrganism = ({ isOpen, onClose, contact, onLogCommunication }) => {
  if (!isOpen || !contact) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Text as="h2" className="text-xl font-heading font-bold text-gray-900">
                {contact.name}
              </Text>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <Text className="text-gray-600 mt-1">{contact.company}</Text>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Text as="label" className="block text-sm font-medium text-gray-700 mb-1">Email</Text>
                <Text className="text-sm text-gray-900">{contact.email}</Text>
              </div>
              <div>
                <Text as="label" className="block text-sm font-medium text-gray-700 mb-1">Phone</Text>
                <Text className="text-sm text-gray-900">{contact.phone}</Text>
              </div>
              <div>
                <Text as="label" className="block text-sm font-medium text-gray-700 mb-1">Deal Value</Text>
                <Text className="text-sm text-gray-900">${contact.dealValue?.toLocaleString() || '0'}</Text>
              </div>
              <div>
                <Text as="label" className="block text-sm font-medium text-gray-700 mb-1">Assigned To</Text>
                <Text className="text-sm text-gray-900">{contact.assignedTo}</Text>
              </div>
            </div>

            <CommunicationLogFormOrganism onLogCommunication={onLogCommunication} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactDetailsModalOrganism;
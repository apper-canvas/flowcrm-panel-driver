import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import NotificationItem from '@/components/molecules/NotificationItem';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const NotificationsDropdownOrganism = ({ notifications }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="p-2 rounded-lg relative hover:bg-gray-100 shadow-none"
      >
        <ApperIcon name="Bell" size={20} className="text-gray-600" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
          {notifications.length}
        </span>
      </Button>

      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <Text as="h3" className="font-semibold text-gray-900">Notifications</Text>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {notificationsOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationsDropdownOrganism;
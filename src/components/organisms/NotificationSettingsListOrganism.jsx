import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';
import SettingsToggle from '@/components/molecules/SettingsToggle';

const NotificationSettingsListOrganism = ({ initialSettings, onSave }) => {
  const [formData, setFormData] = useState(initialSettings);

  useEffect(() => {
    setFormData(initialSettings);
  }, [initialSettings]);

  const handleToggle = (key) => {
    const newData = { ...formData, [key]: !formData[key] };
    setFormData(newData);
    onSave(newData);
  };

  const notificationOptions = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
    { key: 'taskReminders', label: 'Task Reminders', description: 'Get notified about upcoming tasks' },
    { key: 'dealUpdates', label: 'Deal Updates', description: 'Notifications when deals move stages' },
    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance summaries' },
    { key: 'mobileNotifications', label: 'Mobile Push Notifications', description: 'Push notifications on mobile devices' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</Text>
        <div className="space-y-4">
          {notificationOptions.map((option) => (
            <SettingsToggle
              key={option.key}
              label={option.label}
              description={option.description}
              checked={formData[option.key]}
              onToggle={() => handleToggle(option.key)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettingsListOrganism;
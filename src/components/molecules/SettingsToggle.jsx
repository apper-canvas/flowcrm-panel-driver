import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const SettingsToggle = ({ label, description, checked, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
      <div>
        <Text as="h4" className="font-medium text-gray-900">{label}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <motion.span
          layout
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </motion.button>
    </div>
  );
};

export default SettingsToggle;
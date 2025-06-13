import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ProfileSettingsFormOrganism = ({ initialSettings, onSave }) => {
  const [formData, setFormData] = useState(initialSettings);

  useEffect(() => {
    setFormData(initialSettings);
  }, [initialSettings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Profile Information</Text>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <FormField
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <FormField
              label="Phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <FormField
              label="Company"
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          <FormField
            label="Timezone"
            id="timezone"
            type="select"
            value={formData.timezone}
            onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
            options={timezoneOptions}
          />
          <Button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Profile
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfileSettingsFormOrganism;
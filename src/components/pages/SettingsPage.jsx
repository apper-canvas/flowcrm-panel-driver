import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import ProfileSettingsFormOrganism from '@/components/organisms/ProfileSettingsFormOrganism';
import NotificationSettingsListOrganism from '@/components/organisms/NotificationSettingsListOrganism';
import PipelineStageSettingsOrganism from '@/components/organisms/PipelineStageSettingsOrganism';
import TeamMembersListOrganism from '@/components/organisms/TeamMembersListOrganism';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@company.com',
      phone: '+1 (555) 123-4567',
      company: 'FlowCRM Inc',
      timezone: 'America/New_York'
    },
    notifications: {
      emailNotifications: true,
      taskReminders: true,
      dealUpdates: true,
      weeklyReports: false,
      mobileNotifications: true
    },
    pipeline: {
      stages: [
        { id: 'lead', name: 'Lead', color: '#6B7280' },
        { id: 'qualified', name: 'Qualified', color: '#3B82F6' },
        { id: 'proposal', name: 'Proposal', color: '#F59E0B' },
        { id: 'negotiation', name: 'Negotiation', color: '#F97316' },
        { id: 'closed', name: 'Closed Won', color: '#10B981' }
      ]
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'pipeline', label: 'Pipeline', icon: 'GitBranch' },
    { id: 'team', label: 'Team', icon: 'Users' }
  ];

  const handleSaveSettings = (section, data) => {
    setSettings(prev => ({
      ...prev,
      [section]: data 
    }));
    toast.success('Settings saved successfully');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettingsFormOrganism initialSettings={settings.profile} onSave={(data) => handleSaveSettings('profile', data)} />;
      case 'notifications':
        return <NotificationSettingsListOrganism initialSettings={settings.notifications} onSave={(data) => handleSaveSettings('notifications', data)} />;
      case 'pipeline':
        return <PipelineStageSettingsOrganism initialStages={settings.pipeline.stages} onSave={(data) => handleSaveSettings('pipeline', { stages: data })} />;
      case 'team':
        return <TeamMembersListOrganism />;
      default:
        return <ProfileSettingsFormOrganism initialSettings={settings.profile} onSave={(data) => handleSaveSettings('profile', data)} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full overflow-auto"
    >
      <div className="max-w-4xl mx-auto">
        <Text as="h1" className="text-2xl font-heading font-bold text-gray-900 mb-6">Settings</Text>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-surface'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} className="mr-3" />
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
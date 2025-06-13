import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

const Settings = () => {
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
      [section]: { ...prev[section], ...data }
    }));
    toast.success('Settings saved successfully');
  };

  const ProfileSettings = () => {
    const [formData, setFormData] = useState(settings.profile);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveSettings('profile', formData);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Save Profile
            </motion.button>
          </form>
        </div>
      </motion.div>
    );
  };

  const NotificationSettings = () => {
    const [formData, setFormData] = useState(settings.notifications);

    const handleToggle = (key) => {
      const newData = { ...formData, [key]: !formData[key] };
      setFormData(newData);
      handleSaveSettings('notifications', newData);
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {notificationOptions.map((option) => (
              <div key={option.key} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggle(option.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData[option.key] ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <motion.span
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData[option.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const PipelineSettings = () => {
    const [stages, setStages] = useState(settings.pipeline.stages);
    const [editingStage, setEditingStage] = useState(null);

    const handleUpdateStage = (stageId, updates) => {
      const newStages = stages.map(stage => 
        stage.id === stageId ? { ...stage, ...updates } : stage
      );
      setStages(newStages);
      handleSaveSettings('pipeline', { stages: newStages });
      setEditingStage(null);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Stages</h3>
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-gray-900">{stage.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">Stage {index + 1}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingStage(stage)}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                  <ApperIcon name="Edit" size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stage Editor Modal */}
        {editingStage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Stage</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage Name</label>
                  <input
                    type="text"
                    value={editingStage.name}
                    onChange={(e) => setEditingStage(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex space-x-2">
                    {['#6B7280', '#3B82F6', '#F59E0B', '#F97316', '#10B981', '#EF4444', '#8B5CF6'].map(color => (
                      <button
                        key={color}
                        onClick={() => setEditingStage(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingStage.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingStage(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStage(editingStage.id, editingStage)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  };

  const TeamSettings = () => {
    const teamMembers = [
      { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Sales Rep', status: 'Active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Sales Rep', status: 'Pending' }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Invite Member
          </motion.button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -2 }}
              className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{member.role}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {member.status}
                </span>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-error transition-colors"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'pipeline':
        return <PipelineSettings />;
      case 'team':
        return <TeamSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full overflow-auto"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">Settings</h1>

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

export default Settings;
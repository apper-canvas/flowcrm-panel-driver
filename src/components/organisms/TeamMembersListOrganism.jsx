import { motion } => 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const TeamMembersListOrganism = () => {
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
        <Text as="h3" className="text-lg font-semibold text-gray-900">Team Members</Text>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Invite Member
        </Button>
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
                <Text as="h4" className="font-medium text-gray-900">{member.name}</Text>
                <Text className="text-sm text-gray-600">{member.email}</Text>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Text className="text-sm text-gray-600">{member.role}</Text>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {member.status}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-primary"
                >
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-error"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TeamMembersListOrganism;
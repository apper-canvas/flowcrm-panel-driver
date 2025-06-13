import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const PipelineHealthOrganism = ({ contacts, totalPipelineValue }) => {
  const pipelineStages = [
    { id: 'lead', name: 'Lead', color: '#6B7280' }, // actual color not used for bar, but good for context
    { id: 'qualified', name: 'Qualified', color: '#3B82F6' },
    { id: 'proposal', name: 'Proposal', color: '#F59E0B' },
    { id: 'negotiation', name: 'Negotiation', color: '#F97316' },
    { id: 'closed', name: 'Closed Won', color: '#10B981' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
    >
      <Text as="h3" className="text-lg font-semibold text-gray-900 mb-6">Pipeline Health</Text>
      <div className="space-y-4">
        {pipelineStages.map((stage, index) => {
          const stageContacts = contacts.filter(c => c.status === stage.id);
          const stageValue = stageContacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
          const percentage = totalPipelineValue > 0 ? (stageValue / totalPipelineValue) * 100 : 0;
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 bg-surface rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Text className="font-medium text-gray-900 capitalize">{stage.name}</Text>
                  <Text className="text-sm text-gray-600">
                    {stageContacts.length} deals · ${stageValue.toLocaleString()}
                  </Text>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PipelineHealthOrganism;
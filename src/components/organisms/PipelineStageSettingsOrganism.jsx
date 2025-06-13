import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import StageColorPicker from '@/components/molecules/StageColorPicker';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const PipelineStageSettingsOrganism = ({ initialStages, onSave }) => {
  const [stages, setStages] = useState(initialStages);
  const [editingStage, setEditingStage] = useState(null);

  useEffect(() => {
    setStages(initialStages);
  }, [initialStages]);

  const handleUpdateStage = (stageId, updates) => {
    const newStages = stages.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    );
    setStages(newStages);
    onSave(newStages);
    setEditingStage(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Pipeline Stages</Text>
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
                  <Text className="font-medium text-gray-900">{stage.name}</Text>
                </div>
                <Text className="text-sm text-gray-500">Stage {index + 1}</Text>
              </div>
              <Button
                variant="ghost"
                onClick={() => setEditingStage(stage)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-primary"
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {editingStage && (
        <AnimatePresence>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Text as="h4" className="text-lg font-semibold text-gray-900 mb-4">Edit Stage</Text>
              <div className="space-y-4">
                <FormField
                  label="Stage Name"
                  id="stageName"
                  type="text"
                  value={editingStage.name}
                  onChange={(e) => setEditingStage(prev => ({ ...prev, name: e.target.value }))}
                />
                <StageColorPicker
                  selectedColor={editingStage.color}
                  onSelectColor={(color) => setEditingStage(prev => ({ ...prev, color }))}
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setEditingStage(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateStage(editingStage.id, editingStage)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default PipelineStageSettingsOrganism;
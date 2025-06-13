import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const TaskFormOrganism = ({ isOpen, onClose, task = null, contacts = [], onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contactId: '',
    assignedTo: 'Current User',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    completed: false
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate.split('T')[0],
        contactId: task.contactId || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        contactId: '',
        assignedTo: 'Current User',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        completed: false
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    };
    
    onSave(taskData);
  };

  const contactOptions = [{ value: '', label: 'Select a contact' }].concat(
    contacts.map(contact => ({
      value: contact.id,
      label: `${contact.name} - ${contact.company}`
    }))
  );

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {(isOpen) && (
        <>
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
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <Text as="h2" className="text-xl font-heading font-bold text-gray-900">
                  {task ? 'Edit Task' : 'Add Task'}
                </Text>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField
                  label="Title"
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
                <FormField
                  label="Description"
                  id="description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
                <FormField
                  label="Contact"
                  id="contactId"
                  type="select"
                  value={formData.contactId}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                  options={contactOptions}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Due Date"
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                  <FormField
                    label="Priority"
                    id="priority"
                    type="select"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    options={priorityOptions}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {task ? 'Update Task' : 'Add Task'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskFormOrganism;
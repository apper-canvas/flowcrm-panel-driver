import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const TaskListItem = ({ 
  task = {}, 
  relatedContact = null, 
  index = 0, 
  onToggleComplete = () => {}, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) => {
  // Validate task object and provide defaults
  const safeTask = {
    id: '',
    title: 'Untitled Task',
    dueDate: new Date().toISOString(),
    completed: false,
    priority: 'low',
    description: '',
    ...task
  };

  const getDateDisplay = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      if (isPast(date)) return 'Overdue';
      return format(date, 'MMM d');
    } catch (error) {
      console.warn('Date parsing error:', error);
      return 'Invalid date';
    }
  };

  const getDateColor = (dateString, completed) => {
    if (completed) return 'text-green-600';
    if (!dateString) return 'text-gray-600';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'text-gray-600';
      
      if (isPast(date) && !isToday(date)) return 'text-red-600';
      if (isToday(date)) return 'text-amber-600';
      return 'text-gray-600';
    } catch (error) {
      console.warn('Date color parsing error:', error);
      return 'text-gray-600';
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <Card className={`p-4 hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-4">
        <Checkbox checked={task.completed} onChange={() => onToggleComplete(task)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Text as="h3" className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {task.title}
            </Text>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityClasses(task.priority)}`}>
                {task.priority}
              </span>

              <Text className={`flex items-center text-sm ${getDateColor(task.dueDate, task.completed)}`}>
                <ApperIcon name="Calendar" size={14} className="mr-1" />
                {getDateDisplay(task.dueDate)}
              </Text>
            </div>
          </div>

          {task.description && (
            <Text className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </Text>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {relatedContact && (
                <div className="flex items-center">
                  <ApperIcon name="User" size={12} className="mr-1" />
                  {relatedContact.name}
                </div>
              )}
              <div className="flex items-center">
                <ApperIcon name="UserCheck" size={12} className="mr-1" />
                {task.assignedTo}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="ghost" onClick={() => onEdit(task)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1 text-gray-400 hover:text-primary">
                <ApperIcon name="Edit" size={14} />
              </Button>
              <Button variant="ghost" onClick={() => onDelete(task.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1 text-gray-400 hover:text-error">
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
</Card>
    </motion.div>
  );
};

export default TaskListItem;
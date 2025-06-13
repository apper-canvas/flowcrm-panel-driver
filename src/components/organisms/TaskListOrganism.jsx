import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { isPast, isToday } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import TabButton from '@/components/molecules/TabButton';
import TaskListItem from '@/components/molecules/TaskListItem';
import TaskFormOrganism from '@/components/organisms/TaskFormOrganism';
import { taskService, contactService } from '@/services';

const TaskListOrganism = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { value: 'overdue', label: 'Overdue', icon: 'AlertCircle' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.update(task.id, { 
        completed: !task.completed 
      });
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as pending');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, taskData);
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task created successfully');
      }
      setShowAddModal(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      switch (filter) {
        case 'pending':
          return !task.completed;
        case 'completed':
          return task.completed;
        case 'overdue':
          return !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="flex space-x-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();
  const taskStats = {
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => !t.completed && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))).length
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">Tasks</Text>
          <Button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Task
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <TabButton
              key={option.value}
              isActive={filter === option.value}
              onClick={() => setFilter(option.value)}
              icon={option.icon}
              label={option.label}
              count={taskStats[option.value]}
            />
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckSquare" size={32} className="text-gray-400" />
          </div>
          <Text as="h3" className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </Text>
          <Text className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Get organized by creating your first task'
              : `You don't have any ${filter} tasks at the moment`
            }
          </Text>
          {filter === 'all' && (
            <Button
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3"
            >
              Create Your First Task
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const relatedContact = contacts.find(c => c.id === task.contactId);
              return (
                <TaskListItem
                  key={task.id}
                  task={task}
                  relatedContact={relatedContact}
                  index={index}
                  onToggleComplete={handleToggleComplete}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <TaskFormOrganism
        isOpen={showAddModal || !!editingTask}
        onClose={() => { setShowAddModal(false); setEditingTask(null); }}
        task={editingTask}
        contacts={contacts}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskListOrganism;
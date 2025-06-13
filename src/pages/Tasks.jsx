import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { taskService, contactService } from '../services';

const Tasks = () => {
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

  const getDateDisplay = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM d');
  };

  const getDateColor = (dateString, completed) => {
    if (completed) return 'text-green-600';
    const date = new Date(dateString);
    if (isPast(date) && !isToday(date)) return 'text-red-600';
    if (isToday(date)) return 'text-amber-600';
    return 'text-gray-600';
  };

  const TaskModal = () => {
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
      if (editingTask) {
        setFormData({
          ...editingTask,
          dueDate: editingTask.dueDate.split('T')[0],
          contactId: editingTask.contactId || ''
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
    }, [editingTask]);

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
      
      handleSaveTask(taskData);
    };

    return (
      <AnimatePresence>
        {(showAddModal || editingTask) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => {
                setShowAddModal(false);
                setEditingTask(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-heading font-bold text-gray-900">
                    {editingTask ? 'Edit Task' : 'Add Task'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                    <select
                      value={formData.contactId}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select a contact</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} - {contact.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingTask(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-sm"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full overflow-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-gray-900">Tasks</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-sm flex items-center"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Task
          </motion.button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(option.value)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === option.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ApperIcon name={option.icon} size={16} className="mr-2" />
              {option.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === option.value
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {taskStats[option.value]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckSquare" size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Get organized by creating your first task'
              : `You don't have any ${filter} tasks at the moment`
            }
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-sm"
            >
              Create Your First Task
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const relatedContact = contacts.find(c => c.id === task.contactId);
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-success border-success text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <ApperIcon name="Check" size={12} />
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                          {/* Priority Badge */}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority}
                          </span>

                          {/* Due Date */}
                          <div className={`flex items-center text-sm ${getDateColor(task.dueDate, task.completed)}`}>
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            {getDateDisplay(task.dueDate)}
                          </div>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm mb-2 ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
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
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingTask(task)}
                            className="p-1 text-gray-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit" size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-gray-400 hover:text-error transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <TaskModal />
    </motion.div>
  );
};

export default Tasks;
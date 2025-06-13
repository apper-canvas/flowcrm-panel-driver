import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { contactService, taskService, communicationService } from '../services';

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [contacts, setContacts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const pipelineStages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-100 text-gray-700' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-700' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-100 text-green-700' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contactsData, tasksData] = await Promise.all([
        contactService.getAll(),
        taskService.getAll()
      ]);
      setContacts(contactsData);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDealMove = async (dealId, newStage) => {
    try {
      const updatedContact = await contactService.update(dealId, { status: newStage });
      setContacts(prev => prev.map(c => c.id === dealId ? updatedContact : c));
      toast.success(`Deal moved to ${pipelineStages.find(s => s.id === newStage)?.name}`);
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
  };

  const handleDragStart = (e, contact) => {
    setDraggedDeal(contact);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.status !== stageId) {
      handleDealMove(draggedDeal.id, stageId);
    }
    setDraggedDeal(null);
  };

  const DealCard = ({ contact }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      draggable
      onDragStart={(e) => handleDragStart(e, contact)}
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-move shadow-sm hover:shadow-md transition-all duration-150"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{contact.name}</h4>
          <p className="text-sm text-gray-600 truncate">{contact.company}</p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span className="text-sm font-bold text-primary">
            ${contact.dealValue?.toLocaleString() || '0'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="User" size={12} className="mr-1" />
          {contact.assignedTo}
        </div>
        <div className="flex items-center">
          <ApperIcon name="Clock" size={12} className="mr-1" />
          {new Date(contact.lastContactedAt).toLocaleDateString()}
        </div>
      </div>
      
      {/* Deal value indicator bar */}
      <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          style={{ 
            width: `${Math.min((contact.dealValue || 0) / 100000 * 100, 100)}%` 
          }}
        />
      </div>
    </motion.div>
  );

  const PipelineView = () => (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Sales Pipeline</h2>
        <p className="text-gray-600">Drag deals between stages to update their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[600px]">
        {pipelineStages.map((stage) => {
          const stageDeals = contacts.filter(c => c.status === stage.id);
          const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);

          return (
            <div
              key={stage.id}
              className="bg-surface rounded-lg p-4 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  ${stageValue.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {stageDeals.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <DealCard contact={contact} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="GitBranch" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No deals in this stage</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const QuickStats = () => {
    const totalDeals = contacts.length;
    const totalValue = contacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <QuickStats />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface rounded-lg p-4 min-h-[500px]">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <QuickStats />
      <PipelineView />
    </div>
  );
};

export default MainFeature;
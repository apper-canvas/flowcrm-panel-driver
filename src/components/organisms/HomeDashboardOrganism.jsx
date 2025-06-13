import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import InfoCard from '@/components/molecules/InfoCard';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import DealCard from '@/components/molecules/DealCard';
import { motion, AnimatePresence } from 'framer-motion';
import { contactService, taskService } from '@/services';

const HomeDashboardOrganism = () => {
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

  const totalDeals = contacts.length;
  const totalValue = contacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
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
    <div className="h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          title="Total Deals"
          value={totalDeals}
          icon="TrendingUp"
          iconBgColor="bg-primary bg-opacity-10"
          iconColor="text-primary"
        />
        <InfoCard
          title="Pipeline Value"
          value={`$${totalValue.toLocaleString()}`}
          icon="DollarSign"
          iconBgColor="bg-accent bg-opacity-10"
          iconColor="text-accent"
        />
        <InfoCard
          title="Completed Tasks"
          value={completedTasks}
          icon="CheckCircle"
          iconBgColor="bg-success bg-opacity-10"
          iconColor="text-success"
        />
        <InfoCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="Clock"
          iconBgColor="bg-warning bg-opacity-10"
          iconColor="text-warning"
        />
      </div>

      <div className="mb-6">
        <Text as="h2" className="text-2xl font-heading font-bold text-gray-900 mb-2">Sales Pipeline Overview</Text>
        <Text className="text-gray-600">Drag deals between stages to update their status</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[500px]">
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
                  <Text as="h3" className="font-semibold text-gray-900">{stage.name}</Text>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {stageDeals.length}
                  </span>
                </div>
                <Text className="text-sm text-gray-600 font-medium">
                  ${stageValue.toLocaleString()}
                </Text>
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
                      <DealCard 
                        contact={contact} 
                        onDragStart={handleDragStart} 
                        onClick={() => { /* No modal for home page */ }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="GitBranch" size={32} className="mx-auto mb-2 opacity-50" />
                  <Text className="text-sm">No deals in this stage</Text>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeDashboardOrganism;
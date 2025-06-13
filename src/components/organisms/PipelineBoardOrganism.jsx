import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import DealCard from '@/components/molecules/DealCard';
import ContactDetailsModalOrganism from '@/components/organisms/ContactDetailsModalOrganism';
import { contactService, communicationService } from '@/services';

const PipelineBoardOrganism = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const pipelineStages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-100 text-gray-700', bgColor: 'bg-gray-50' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-700', bgColor: 'bg-yellow-50' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700', bgColor: 'bg-orange-50' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50' }
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
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

  const handleLogCommunication = async (communication) => {
    try {
      await communicationService.create({
        ...communication,
        contactId: selectedContact.id,
        date: new Date().toISOString(),
        createdBy: 'Current User'
      });
      toast.success('Communication logged successfully');
      setShowContactModal(false);
    } catch (error) {
      toast.error('Failed to log communication');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface rounded-lg p-4 min-h-[600px]">
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

  const totalPipelineValue = contacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text as="h1" className="text-2xl font-heading font-bold text-gray-900 mb-2">Sales Pipeline</Text>
            <Text className="text-gray-600">Drag deals between stages to update their status</Text>
          </div>
          <div className="text-right">
            <Text className="text-sm text-gray-600">Total Pipeline Value</Text>
            <Text className="text-2xl font-bold text-primary">${totalPipelineValue.toLocaleString()}</Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-[600px]">
        {pipelineStages.map((stage) => {
          const stageDeals = contacts.filter(c => c.status === stage.id);
          const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);

          return (
            <div
              key={stage.id}
              className={`${stage.bgColor} rounded-lg p-4 min-h-[600px] transition-colors duration-200 ${
                draggedDeal ? 'border-2 border-dashed border-primary opacity-75' : ''
              }`}
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
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${totalPipelineValue > 0 ? (stageValue / totalPipelineValue) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {stageDeals.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DealCard 
                        contact={contact} 
                        onDragStart={handleDragStart} 
                        onClick={() => { setSelectedContact(contact); setShowContactModal(true); }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {stageDeals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-400"
                >
                  <ApperIcon name="GitBranch" size={32} className="mx-auto mb-2 opacity-50" />
                  <Text className="text-sm">No deals in this stage</Text>
                  <Text className="text-xs mt-1">Drag deals here to move them</Text>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <ContactDetailsModalOrganism
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        contact={selectedContact}
        onLogCommunication={handleLogCommunication}
      />
    </div>
  );
};

export default PipelineBoardOrganism;
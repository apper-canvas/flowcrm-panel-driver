import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { contactService, communicationService } from '../services';

const Pipeline = () => {
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

  const handleLogCommunication = async (contactId, communication) => {
    try {
      await communicationService.create({
        ...communication,
        contactId,
        date: new Date().toISOString(),
        createdBy: 'Current User'
      });
      toast.success('Communication logged successfully');
      setShowContactModal(false);
    } catch (error) {
      toast.error('Failed to log communication');
    }
  };

  const DealCard = ({ contact }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      draggable
      onDragStart={(e) => handleDragStart(e, contact)}
      onClick={() => {
        setSelectedContact(contact);
        setShowContactModal(true);
      }}
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-move shadow-sm hover:shadow-md transition-all duration-150"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{contact.name}</h4>
          <p className="text-sm text-gray-600 truncate">{contact.company}</p>
          <p className="text-xs text-gray-500 truncate">{contact.email}</p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span className="text-sm font-bold text-primary">
            ${contact.dealValue?.toLocaleString() || '0'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min((contact.dealValue || 0) / 100000 * 100, 100)}%` 
          }}
        />
      </div>
    </motion.div>
  );

  const ContactModal = () => {
    const [communicationType, setCommunicationType] = useState('email');
    const [subject, setSubject] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!subject.trim() || !notes.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      handleLogCommunication(selectedContact.id, {
        type: communicationType,
        subject,
        notes
      });

      setSubject('');
      setNotes('');
    };

    return (
      <AnimatePresence>
        {showContactModal && selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowContactModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-heading font-bold text-gray-900">
                      {selectedContact.name}
                    </h2>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">{selectedContact.company}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
                      <p className="text-sm text-gray-900">${selectedContact.dealValue?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <p className="text-sm text-gray-900">{selectedContact.assignedTo}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Log Communication</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={communicationType}
                        onChange={(e) => setCommunicationType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="email">Email</option>
                        <option value="call">Phone Call</option>
                        <option value="meeting">Meeting</option>
                        <option value="note">Note</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter communication subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter communication details"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowContactModal(false)}
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
                        Log Communication
                      </motion.button>
                    </div>
                  </form>
                </div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full overflow-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Sales Pipeline</h1>
            <p className="text-gray-600">Drag deals between stages to update their status</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Pipeline Value</p>
            <p className="text-2xl font-bold text-primary">${totalPipelineValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
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
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  ${stageValue.toLocaleString()}
                </p>
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
                      <DealCard contact={contact} />
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
                  <p className="text-sm">No deals in this stage</p>
                  <p className="text-xs mt-1">Drag deals here to move them</p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <ContactModal />
    </motion.div>
  );
};

export default Pipeline;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ContactFormOrganism = ({ isOpen, onClose, contact = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    assignedTo: 'Current User',
    dealValue: 0
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'lead',
        assignedTo: 'Current User',
        dealValue: 0
      });
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    onSave(formData);
  };

  const statusOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed', label: 'Closed Won' }
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
                  {contact ? 'Edit Contact' : 'Add Contact'}
                </Text>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField
                  label="Name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <FormField
                  label="Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <FormField
                  label="Phone"
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <FormField
                  label="Company"
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
                <FormField
                  label="Status"
                  id="status"
                  type="select"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  options={statusOptions}
                />
                <FormField
                  label="Deal Value ($)"
                  id="dealValue"
                  type="number"
                  value={formData.dealValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, dealValue: parseInt(e.target.value) || 0 }))}
                  min="0"
                />

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
                    {contact ? 'Update Contact' : 'Add Contact'}
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

export default ContactFormOrganism;
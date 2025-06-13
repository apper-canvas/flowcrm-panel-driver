import { useState } from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const CommunicationLogFormOrganism = ({ onLogCommunication }) => {
  const [communicationType, setCommunicationType] = useState('email');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !notes.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onLogCommunication({
      type: communicationType,
      subject,
      notes
    });

    setSubject('');
    setNotes('');
  };

  const communicationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'call', label: 'Phone Call' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'note', label: 'Note' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Text as="h3" className="text-lg font-semibold text-gray-900">Log Communication</Text>
      
      <FormField
        label="Type"
        id="communicationType"
        type="select"
        value={communicationType}
        onChange={(e) => setCommunicationType(e.target.value)}
        options={communicationOptions}
      />

      <FormField
        label="Subject"
        id="subject"
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter communication subject"
        required
      />

      <FormField
        label="Notes"
        id="notes"
        type="textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter communication details"
        rows={4}
        required
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Log Communication
        </Button>
      </div>
    </form>
  );
};

export default CommunicationLogFormOrganism;
import { motion } from 'framer-motion';
import ContactListOrganism from '@/components/organisms/ContactListOrganism';

const ContactsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-auto"
    >
      <ContactListOrganism />
    </motion.div>
  );
};

export default ContactsPage;
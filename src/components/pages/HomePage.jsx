import { motion } from 'framer-motion';
import HomeDashboardOrganism from '@/components/organisms/HomeDashboardOrganism';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <HomeDashboardOrganism />
    </motion.div>
  );
};

export default HomePage;
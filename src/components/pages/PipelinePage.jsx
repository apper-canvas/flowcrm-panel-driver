import { motion } from 'framer-motion';
import PipelineBoardOrganism from '@/components/organisms/PipelineBoardOrganism';

const PipelinePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-auto"
    >
      <PipelineBoardOrganism />
    </motion.div>
  );
};

export default PipelinePage;
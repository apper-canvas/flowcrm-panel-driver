import { motion } from 'framer-motion';
import TaskListOrganism from '@/components/organisms/TaskListOrganism';

const TasksPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-auto"
    >
      <TaskListOrganism />
    </motion.div>
  );
};

export default TasksPage;
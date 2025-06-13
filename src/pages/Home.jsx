import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <MainFeature />
    </motion.div>
  );
};

export default Home;
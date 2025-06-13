import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import AnalyticsMetricsOrganism from '@/components/organisms/AnalyticsMetricsOrganism';
import SalesFunnelChartOrganism from '@/components/organisms/SalesFunnelChartOrganism';
import TaskStatusChartOrganism from '@/components/organisms/TaskStatusChartOrganism';
import CommunicationTrendChartOrganism from '@/components/organisms/CommunicationTrendChartOrganism';
import PipelineHealthOrganism from '@/components/organisms/PipelineHealthOrganism';
import { contactService, taskService, communicationService } from '@/services';

const AnalyticsPage = () => {
  const [data, setData] = useState({
    contacts: [],
    tasks: [],
    communications: []
  });
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState('month'); // State for time frame is here but not fully integrated with data fetching for simplicity.

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [contacts, tasks, communications] = await Promise.all([
        contactService.getAll(),
        taskService.getAll(),
        communicationService.getAll()
      ]);
      setData({ contacts, tasks, communications });
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getKeyMetrics = () => {
    const totalDeals = data.contacts.length;
    const totalValue = data.contacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
    const closedDeals = data.contacts.filter(c => c.status === 'closed').length;
    const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const taskCompletionRate = data.tasks.length > 0 ? (completedTasks / data.tasks.length) * 100 : 0;

    return {
      totalDeals,
      totalValue,
      conversionRate,
      taskCompletionRate,
      avgDealValue: totalDeals > 0 ? totalValue / totalDeals : 0,
      totalCommunications: data.communications.length
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = getKeyMetrics();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full overflow-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Text as="h1" className="text-2xl font-heading font-bold text-gray-900">Analytics</Text>
          <div className="flex space-x-2">
            {['week', 'month', 'quarter'].map(period => (
              <Button
                key={period}
                variant={timeFrame === period ? 'primary' : 'ghost'}
                onClick={() => setTimeFrame(period)}
                className={`px-3 py-1 text-sm ${timeFrame === period ? '' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <AnalyticsMetricsOrganism metrics={metrics} data={data} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SalesFunnelChartOrganism data={data} />
        <TaskStatusChartOrganism data={data} />
      </div>

      <CommunicationTrendChartOrganism data={data} />

      <PipelineHealthOrganism contacts={data.contacts} totalPipelineValue={metrics.totalValue} />
    </motion.div>
  );
};

export default AnalyticsPage;
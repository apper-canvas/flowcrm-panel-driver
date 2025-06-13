import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '../components/ApperIcon';
import { contactService, taskService, communicationService } from '../services';

const Analytics = () => {
  const [data, setData] = useState({
    contacts: [],
    tasks: [],
    communications: []
  });
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState('month');

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

  const getConversionFunnelData = () => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
    const stageData = stages.map(stage => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: data.contacts.filter(c => c.status === stage).length,
      value: data.contacts.filter(c => c.status === stage).reduce((sum, c) => sum + (c.dealValue || 0), 0)
    }));

    return {
      series: [{
        name: 'Deals',
        data: stageData.map(s => s.count)
      }, {
        name: 'Value ($)',
        data: stageData.map(s => Math.round(s.value / 1000))
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#5B3FF9', '#F59E0B'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: { enabled: false },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: stageData.map(s => s.stage)
        },
        yaxis: [{
          title: { text: 'Number of Deals' }
        }, {
          opposite: true,
          title: { text: 'Value (Thousands)' }
        }],
        fill: { opacity: 1 },
        tooltip: {
          y: {
            formatter: function (val, { seriesIndex }) {
              return seriesIndex === 0 ? val + ' deals' : '$' + (val * 1000).toLocaleString();
            }
          }
        }
      }
    };
  };

  const getTaskCompletionData = () => {
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const pendingTasks = data.tasks.filter(t => !t.completed).length;
    const overdueTasks = data.tasks.filter(t => 
      !t.completed && new Date(t.dueDate) < new Date()
    ).length;

    return {
      series: [completedTasks, pendingTasks, overdueTasks],
      options: {
        chart: {
          type: 'donut',
          height: 350
        },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        labels: ['Completed', 'Pending', 'Overdue'],
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Tasks',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#374151'
                }
              }
            }
          }
        },
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return Math.round(val) + '%';
          }
        }
      }
    };
  };

  const getCommunicationTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const communicationsByDay = last7Days.map(date => {
      const dayComms = data.communications.filter(c => 
        c.date.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayComms.length
      };
    });

    return {
      series: [{
        name: 'Communications',
        data: communicationsByDay.map(d => d.count)
      }],
      options: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#5B3FF9'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3
          }
        },
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          categories: communicationsByDay.map(d => d.date)
        },
        yaxis: {
          title: { text: 'Number of Communications' }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + ' communications';
            }
          }
        }
      }
    };
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
  const funnelData = getConversionFunnelData();
  const taskData = getTaskCompletionData();
  const trendData = getCommunicationTrendData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 h-full overflow-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-heading font-bold text-gray-900">Analytics</h1>
          <div className="flex space-x-2">
            {['week', 'month', 'quarter'].map(period => (
              <motion.button
                key={period}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeFrame(period)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeFrame === period
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{metrics.totalDeals} active deals</p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Lead to closed won</p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Value</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.avgDealValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Per closed deal</p>
            </div>
            <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Task Completion</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.taskCompletionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">{data.tasks.filter(t => t.completed).length} of {data.tasks.length} tasks</p>
            </div>
            <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h3>
          <Chart
            options={funnelData.options}
            series={funnelData.series}
            type="bar"
            height={350}
          />
        </motion.div>

        {/* Task Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
          <Chart
            options={taskData.options}
            series={taskData.series}
            type="donut"
            height={350}
          />
        </motion.div>
      </div>

      {/* Communication Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Communication Activity</h3>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="MessageCircle" size={16} className="mr-1" />
            Last 7 days
          </div>
        </div>
        <Chart
          options={trendData.options}
          series={trendData.series}
          type="area"
          height={350}
        />
      </motion.div>

      {/* Pipeline Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Health</h3>
        <div className="space-y-4">
          {['lead', 'qualified', 'proposal', 'negotiation', 'closed'].map((stage, index) => {
            const stageContacts = data.contacts.filter(c => c.status === stage);
            const stageValue = stageContacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
            const percentage = metrics.totalValue > 0 ? (stageValue / metrics.totalValue) * 100 : 0;
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-surface rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 capitalize">{stage}</span>
                    <span className="text-sm text-gray-600">
                      {stageContacts.length} deals · ${stageValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
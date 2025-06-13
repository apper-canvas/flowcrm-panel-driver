import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';

const TaskStatusChartOrganism = ({ data }) => {
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

  const taskData = getTaskCompletionData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
    >
      <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Task Status</Text>
      <Chart
        options={taskData.options}
        series={taskData.series}
        type="donut"
        height={350}
      />
    </motion.div>
  );
};

export default TaskStatusChartOrganism;
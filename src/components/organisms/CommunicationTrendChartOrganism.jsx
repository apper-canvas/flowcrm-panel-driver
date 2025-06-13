import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';

const CommunicationTrendChartOrganism = ({ data }) => {
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

  const trendData = getCommunicationTrendData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" className="text-lg font-semibold text-gray-900">Communication Activity</Text>
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
  );
};

export default CommunicationTrendChartOrganism;
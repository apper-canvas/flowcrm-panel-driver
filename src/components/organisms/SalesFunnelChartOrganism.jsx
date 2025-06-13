import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';

const SalesFunnelChartOrganism = ({ data }) => {
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

  const funnelData = getConversionFunnelData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
    >
      <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</Text>
      <Chart
        options={funnelData.options}
        series={funnelData.series}
        type="bar"
        height={350}
      />
    </motion.div>
  );
};

export default SalesFunnelChartOrganism;
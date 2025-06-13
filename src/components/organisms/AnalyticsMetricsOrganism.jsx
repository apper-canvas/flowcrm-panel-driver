import InfoCard from '@/components/molecules/InfoCard';

const AnalyticsMetricsOrganism = ({ metrics, data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <InfoCard
        title="Total Pipeline Value"
        value={`$${metrics.totalValue.toLocaleString()}`}
        description={`${metrics.totalDeals} active deals`}
        icon="DollarSign"
        iconBgColor="bg-primary bg-opacity-10"
        iconColor="text-primary"
      />
      <InfoCard
        title="Conversion Rate"
        value={`${metrics.conversionRate.toFixed(1)}%`}
        description="Lead to closed won"
        icon="TrendingUp"
        iconBgColor="bg-success bg-opacity-10"
        iconColor="text-success"
      />
      <InfoCard
        title="Avg Deal Value"
        value={`$${metrics.avgDealValue.toLocaleString()}`}
        description="Per closed deal"
        icon="Target"
        iconBgColor="bg-accent bg-opacity-10"
        iconColor="text-accent"
      />
      <InfoCard
        title="Task Completion"
        value={`${metrics.taskCompletionRate.toFixed(1)}%`}
        description={`${data.tasks.filter(t => t.completed).length} of ${data.tasks.length} tasks`}
        icon="CheckCircle"
        iconBgColor="bg-info bg-opacity-10"
        iconColor="text-info"
      />
    </div>
  );
};

export default AnalyticsMetricsOrganism;
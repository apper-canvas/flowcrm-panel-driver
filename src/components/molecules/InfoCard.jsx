import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Text from '@/components/atoms/Text';

const InfoCard = ({ title, value, description, icon, iconBgColor, iconColor, className = '' }) => {
  return (
    <Card whileHover={{ y: -2 }} className={className}>
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-sm text-gray-600">{title}</Text>
          <Text as="p" className="text-2xl font-bold text-gray-900">{value}</Text>
          {description && <Text className="text-xs text-gray-500 mt-1">{description}</Text>}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
            <ApperIcon name={icon} size={24} className={iconColor} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default InfoCard;
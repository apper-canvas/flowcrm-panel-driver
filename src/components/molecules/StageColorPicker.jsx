import Text from '@/components/atoms/Text';

const StageColorPicker = ({ selectedColor, onSelectColor }) => {
  const colors = ['#6B7280', '#3B82F6', '#F59E0B', '#F97316', '#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div>
      <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">Color</Text>
      <div className="flex space-x-2">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default StageColorPicker;
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Text from '@/components/atoms/Text';

const FormField = ({ type = 'text', label, id, value, onChange, options, rows, className = '', ...props }) => {
  if (type === 'select') {
    return (
      <Select
        label={label}
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        className={className}
        {...props}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        {label && (
          <Text as="label" htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {props.required && '*'}
          </Text>
        )}
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <Input
      label={label}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  );
};

export default FormField;
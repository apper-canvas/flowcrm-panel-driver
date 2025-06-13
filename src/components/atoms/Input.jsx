const Input = ({ label, id, type = 'text', value, onChange, placeholder, className = '', required = false, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
        required={required}
        {...props}
      />
    </div>
  );
};

export default Input;
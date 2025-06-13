import { motion } from 'framer-motion';

const Button = ({ children, className = '', variant = 'primary', whileHover = {}, whileTap = {}, ...props }) => {
  let baseClasses = 'px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center';
  
  switch (variant) {
    case 'primary':
      baseClasses += ' bg-primary text-white hover:bg-secondary';
      break;
    case 'secondary':
      baseClasses += ' bg-accent text-white hover:bg-accent-dark';
      break;
    case 'outline':
      baseClasses += ' border border-gray-300 text-gray-700 hover:bg-gray-100';
      break;
    case 'ghost':
      baseClasses += ' text-gray-700 hover:bg-gray-100 shadow-none';
      break;
    case 'danger':
      baseClasses += ' bg-error text-white hover:bg-red-700';
      break;
    default:
      baseClasses += ' bg-primary text-white hover:bg-secondary';
  }

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
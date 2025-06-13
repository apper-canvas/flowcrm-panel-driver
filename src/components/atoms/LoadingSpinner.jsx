const LoadingSpinner = ({ className = 'w-6 h-6' }) => {
  return (
    <div className={`animate-spin rounded-full border-4 border-t-4 border-primary border-t-transparent ${className}`}></div>
  );
};

export default LoadingSpinner;
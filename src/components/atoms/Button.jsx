import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  className = '', 
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-gray-600 hover:text-primary hover:bg-primary/5 py-2 px-4',
    danger: 'bg-error text-white hover:bg-error/90 py-3 px-6 shadow-md hover:shadow-lg transform hover:scale-105',
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

  const iconElement = icon && (
    <ApperIcon 
      name={icon} 
      size={18} 
      className={children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}
    />
  );

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </motion.button>
  );
};

export default Button;
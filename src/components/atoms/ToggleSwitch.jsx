import { motion } from 'framer-motion';

const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <motion.button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        checked 
          ? 'bg-gradient-to-r from-primary to-secondary' 
          : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <motion.span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        layout
      />
    </motion.button>
  );
};

export default ToggleSwitch;
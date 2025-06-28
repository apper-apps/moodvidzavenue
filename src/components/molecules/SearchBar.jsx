import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const SearchBar = ({ value, onChange, placeholder }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={18} className="text-gray-400" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t('search')}
        className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-800 placeholder-gray-500"
      />
      
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <ApperIcon name="X" size={18} className="text-gray-400 hover:text-gray-600" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;
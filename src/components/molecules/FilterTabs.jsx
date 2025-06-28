import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FilterTabs = ({ options, selected, onSelect }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {options.map((option, index) => (
        <motion.button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
            selected === option.id
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name={option.icon} size={16} />
          <span className="text-sm font-medium">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default FilterTabs;
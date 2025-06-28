import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const MoodCard = ({ mood, isSelected, onSelect }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      className={`mood-card card-premium p-6 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-xl shadow-primary/20' 
          : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, ${mood.color}15, ${mood.color}05)`
          : undefined
      }}
    >
      <div className="text-center space-y-4">
        {/* Icon */}
        <motion.div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: mood.color + '20',
            border: isSelected ? `2px solid ${mood.color}` : 'none'
          }}
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ApperIcon 
            name={mood.icon} 
            size={32} 
            style={{ color: mood.color }}
          />
        </motion.div>
        
        {/* Name */}
        <div className="space-y-2">
          <h3 className="text-lg font-display font-semibold text-gray-800">
            {mood.name}
          </h3>
          <p className="text-sm text-gray-600">
            {mood.description}
          </p>
        </div>
        
        {/* Preview Elements */}
        <div className="space-y-3">
          {/* Color Palette */}
          <div className="flex justify-center space-x-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: mood.color }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: mood.color + '80' }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: mood.color + '40' }}
            />
          </div>
          
          {/* Music Indicator */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <ApperIcon name="Music" size={14} />
            <span>{mood.musicCount || 3} {t('tracks')}</span>
          </div>
        </div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="flex items-center justify-center space-x-2 text-primary text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="Check" size={16} />
            <span>{t('selected')}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodCard;
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';

const Empty = ({ icon = 'Inbox', title, description, actionLabel, onAction }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="card-premium p-12 text-center space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            type: "spring",
            stiffness: 100
          }}
        >
          <ApperIcon name={icon} size={40} className="text-white" />
        </motion.div>
        
        <div className="space-y-3">
          <motion.h3
            className="text-xl font-display font-bold gradient-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {title || t('nothingHereYet')}
          </motion.h3>
          
          <motion.p
            className="text-gray-600 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {description || t('getStartedByCreating')}
          </motion.p>
        </div>
      </motion.div>
      
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            onClick={onAction}
            className="btn-primary shadow-xl"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
      
      <motion.div
        className="pt-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="flex justify-center space-x-1">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/30 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400">{t('letsGetCreative')}</p>
      </motion.div>
    </motion.div>
  );
};

export default Empty;
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';

const Error = ({ message, onRetry }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="card-premium p-8 text-center space-y-6 bg-gradient-to-br from-error/5 to-error/10 border border-error/20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <motion.div
          className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ApperIcon name="AlertCircle" size={32} className="text-error" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-display font-semibold text-gray-800">
            {t('oopsError')}
          </h3>
          <p className="text-gray-600">
            {message || t('somethingWentWrong')}
          </p>
        </div>
      </div>
      
      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            onClick={onRetry}
            className="btn-primary"
            icon="RefreshCw"
          >
            {t('tryAgain')}
          </Button>
        </motion.div>
      )}
      
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <p className="text-sm text-gray-500">{t('errorPersists')}</p>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/80"
          icon="MessageCircle"
        >
          {t('contactSupport')}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Error;
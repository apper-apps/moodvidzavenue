import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return t('home');
      case '/create':
        return t('createVideo');
      case '/upload':
        return t('uploadPhotos');
      case '/mood':
        return t('selectMood');
      case '/preview':
        return t('videoPreview');
      case '/library':
        return t('myVideos');
      case '/settings':
        return t('settings');
      default:
        return 'MoodVidz';
    }
  };

  return (
    <motion.header 
      className="bg-surface/80 backdrop-blur-lg border-b border-white/20 px-4 py-4 sticky top-0 z-40"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Video" size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-display font-bold gradient-text">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Bell" size={20} className="text-primary" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
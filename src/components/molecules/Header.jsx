import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';
import authService from '@/services/api/authService';
const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setShowProfileMenu(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };
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
          
          {/* Profile Menu */}
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </motion.button>
              
              {showProfileMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ApperIcon name="LogOut" size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              onClick={() => window.location.href = '/login'}
              className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="User" size={16} />
              <span className="text-sm font-medium">Login</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
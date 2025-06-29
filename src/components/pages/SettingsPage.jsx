import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import LanguageSelector from '@/components/molecules/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import authService from '@/services/api/authService';

const SettingsPage = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    highQuality: false,
    pinLock: false,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Error logging out');
    }
  };
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(t('settingUpdated'));
  };

  const handleExportData = () => {
    toast.info(t('exportingData'));
    // Simulate export
    setTimeout(() => {
      toast.success(t('dataExported'));
    }, 2000);
  };

  const handleClearCache = () => {
    toast.info(t('clearingCache'));
    // Simulate cache clear
    setTimeout(() => {
      toast.success(t('cacheCleared'));
    }, 1000);
  };

  const settingSections = [
    {
      title: t('preferences'),
      items: [
        {
          id: 'notifications',
          icon: 'Bell',
          label: t('notifications'),
          description: t('notificationsDesc'),
          type: 'toggle',
          value: settings.notifications,
        },
        {
          id: 'autoSave',
          icon: 'Save',
          label: t('autoSave'),
          description: t('autoSaveDesc'),
          type: 'toggle',
          value: settings.autoSave,
        },
        {
          id: 'highQuality',
          icon: 'Sparkles',
          label: t('highQuality'),
          description: t('highQualityDesc'),
          type: 'toggle',
          value: settings.highQuality,
        },
      ],
    },
    {
      title: t('privacy'),
      items: [
        {
          id: 'pinLock',
          icon: 'Lock',
          label: t('pinLock'),
          description: t('pinLockDesc'),
          type: 'toggle',
          value: settings.pinLock,
        },
      ],
    },
    {
      title: t('data'),
      items: [
        {
          id: 'export',
          icon: 'Download',
          label: t('exportData'),
          description: t('exportDataDesc'),
          type: 'action',
          action: handleExportData,
        },
        {
          id: 'cache',
          icon: 'Trash2',
          label: t('clearCache'),
          description: t('clearCacheDesc'),
          type: 'action',
          action: handleClearCache,
        },
      ],
    },
];

  return (
    <div className="space-y-8 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
          {t('settings')}
        </h1>
        <p className="text-gray-600">
          {t('settingsSubtitle')}
        </p>
      </motion.div>

      {/* Account Settings */}
      {user ? (
        <motion.div
          className="card-premium p-6 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-gray-800">
                Account
              </h3>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
                icon="Edit"
              >
                Edit Profile
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="LogOut" size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Sign Out</p>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="card-premium p-6 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="User" size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-gray-800">
                Sign In Required
              </h3>
              <p className="text-sm text-gray-600">Sign in to access all features</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => window.location.href = '/login'}
                className="flex-1"
              >
                Sign In
              </Button>
              <Button
                onClick={() => window.location.href = '/register'}
                variant="secondary"
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Language Settings */}
      <motion.div
        className="card-premium p-6 space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Languages" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-800">
              {t('language')}
            </h3>
            <p className="text-sm text-gray-600">{t('languageDesc')}</p>
          </div>
        </div>
        <LanguageSelector />
      </motion.div>
      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          className="card-premium p-6 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.1 }}
        >
          <h3 className="text-lg font-display font-semibold text-gray-800">
            {section.title}
          </h3>
          
          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + sectionIndex * 0.1 + itemIndex * 0.05 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <ApperIcon name={item.icon} size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {item.type === 'toggle' ? (
                    <ToggleSwitch
                      checked={item.value}
                      onChange={(checked) => handleSettingChange(item.id, checked)}
                    />
                  ) : (
                    <Button
                      onClick={item.action}
                      variant="ghost"
                      className="text-primary hover:text-primary/80"
                      icon="ChevronRight"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Support Section */}
      <motion.div
        className="card-premium p-6 space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg font-display font-semibold text-gray-800">
          {t('support')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="secondary"
            className="justify-start"
            icon="HelpCircle"
          >
            {t('helpCenter')}
          </Button>
          
          <Button
            variant="secondary"
            className="justify-start"
            icon="MessageCircle"
          >
            {t('contactSupport')}
          </Button>
          
          <Button
            variant="secondary"
            className="justify-start"
            icon="Star"
          >
            {t('rateApp')}
          </Button>
          
          <Button
            variant="secondary"
            className="justify-start"
            icon="Share"
          >
            {t('shareApp')}
          </Button>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        className="text-center space-y-2 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p>{t('appVersion')} 1.0.0</p>
        <p>© 2024 MoodVidz. {t('allRightsReserved')}</p>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const BottomNavigation = () => {
  const { t } = useLanguage();

const navItems = [
    { to: '/', icon: 'Home', label: t('home') },
    { to: '/create', icon: 'Plus', label: t('create') },
    { to: '/library', icon: 'Library', label: t('library') },
    { to: '/settings', icon: 'Settings', label: t('settings') },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-white/20 px-4 py-2 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-600 hover:text-primary hover:bg-primary/10'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon name={item.icon} size={20} />
                </motion.div>
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
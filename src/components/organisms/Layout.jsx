import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/molecules/BottomNavigation';
import Header from '@/components/molecules/Header';
import { useLanguage } from '@/hooks/useLanguage';

const Layout = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <motion.main 
        className="flex-1 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
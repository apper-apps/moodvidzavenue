import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageSelector = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  ];

  return (
    <div className="space-y-3">
      {languages.map((lang, index) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
            language === lang.code
              ? 'bg-primary/10 border-2 border-primary text-primary'
              : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{lang.flag}</span>
            <div className="text-left">
              <p className="font-medium">{lang.name}</p>
              <p className="text-xs opacity-70">
                {lang.rtl ? 'Right to Left' : 'Left to Right'}
              </p>
            </div>
          </div>
          
          {language === lang.code && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Check" size={20} />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageSelector;
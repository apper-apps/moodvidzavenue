import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const QuoteCarousel = () => {
  const { t } = useLanguage();
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      text: t('quote1'),
      author: t('quote1Author'),
    },
    {
      text: t('quote2'),
      author: t('quote2Author'),
    },
    {
      text: t('quote3'),
      author: t('quote3Author'),
    },
    {
      text: t('quote4'),
      author: t('quote4Author'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="card-premium p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 min-h-[200px] flex items-center justify-center">
      <div className="space-y-6">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="Quote" size={24} className="text-white" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <blockquote className="text-lg sm:text-xl font-medium text-gray-800 italic">
              "{quotes[currentQuote].text}"
            </blockquote>
            <cite className="text-primary font-semibold">
              — {quotes[currentQuote].author}
            </cite>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuote(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentQuote 
                  ? 'bg-primary w-6' 
                  : 'bg-gray-300 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteCarousel;
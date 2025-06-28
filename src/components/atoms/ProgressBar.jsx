import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, className = '', animated = true }) => {
  return (
    <div className={`progress-bar ${className}`}>
      <motion.div
        className="progress-fill"
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
};

export default ProgressBar;
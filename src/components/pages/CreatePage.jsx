import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { useVideo } from '@/hooks/useVideo';

const CreatePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { resetProject } = useVideo();

  const handleStartNew = () => {
    resetProject();
    navigate('/upload');
  };

  const createSteps = [
    {
      step: 1,
      icon: 'Upload',
      title: t('uploadPhotos'),
      description: t('uploadPhotosStepDesc'),
    },
    {
      step: 2,
      icon: 'Palette',
      title: t('selectMood'),
      description: t('selectMoodStepDesc'),
    },
    {
      step: 3,
      icon: 'Video',
      title: t('generateVideo'),
      description: t('generateVideoStepDesc'),
    },
    {
      step: 4,
      icon: 'Download',
      title: t('downloadShare'),
      description: t('downloadShareStepDesc'),
    },
  ];

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
      >
<h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text">
          Create Your Moodvidz Video
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('createVideoSubtitle')}
        </p>
      </motion.div>

      {/* Steps Guide */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-display font-bold text-gray-800 text-center">
          {t('howItWorks')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {createSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="card-premium p-6 space-y-4"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name={step.icon} size={20} className="text-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-display font-semibold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Button
          onClick={handleStartNew}
          className="btn-primary text-lg px-12 py-4 shadow-2xl"
          icon="Play"
        >
          {t('startCreating')}
        </Button>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        className="card-premium p-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="flex items-center space-x-3">
          <ApperIcon name="Lightbulb" size={24} className="text-accent" />
          <h3 className="text-lg font-display font-semibold text-gray-800">
            {t('proTips')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>{t('tip1')}</span>
          </div>
          <div className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>{t('tip2')}</span>
          </div>
          <div className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>{t('tip3')}</span>
          </div>
          <div className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <span>{t('tip4')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MoodCard from '@/components/molecules/MoodCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useVideo } from '@/hooks/useVideo';
import { moodService } from '@/services/api/moodService';

const MoodSelectionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectedMood, setSelectedMood, photos } = useVideo();
  const [moods] = useState(moodService.getAll());

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    toast.success(t('moodSelected', { mood: mood.name }));
  };

  const handleContinue = () => {
    if (!selectedMood) {
      toast.error(t('selectMoodFirst'));
      return;
    }
    navigate('/preview');
  };

  const handleBack = () => {
    navigate('/upload');
  };

  if (photos.length === 0) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="p-2"
            icon="ArrowLeft"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
              {t('selectMood')}
            </h1>
            <p className="text-gray-600">
              {t('selectMoodSubtitle')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Photo Preview */}
      <motion.div
        className="card-premium p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <ApperIcon name="Image" size={20} className="text-primary" />
          <span className="font-medium text-gray-800">
            {t('selectedPhotos', { count: photos.length })}
          </span>
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {photos.slice(0, 5).map((photo, index) => (
            <div key={photo.Id} className="flex-shrink-0">
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          ))}
          {photos.length > 5 && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              +{photos.length - 5}
            </div>
          )}
        </div>
      </motion.div>

      {/* Mood Grid */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-display font-semibold text-gray-800">
          {t('choosePerfectMood')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <MoodCard
                mood={mood}
                isSelected={selectedMood?.Id === mood.Id}
                onSelect={() => handleMoodSelect(mood)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Current Selection */}
      {selectedMood && (
        <motion.div
          className="card-premium p-6 bg-gradient-to-br from-primary/5 to-secondary/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: selectedMood.color + '20' }}
            >
              <ApperIcon 
                name={selectedMood.icon} 
                size={24} 
                style={{ color: selectedMood.color }}
              />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-gray-800">
                {selectedMood.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {selectedMood.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        className="flex justify-between items-center pt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Button
          onClick={handleBack}
          variant="secondary"
          className="px-6"
          icon="ArrowLeft"
        >
          {t('back')}
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!selectedMood}
          className="btn-primary px-8"
          icon="ArrowRight"
        >
          {t('generateVideo')}
        </Button>
      </motion.div>
    </div>
  );
};

export default MoodSelectionPage;
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';

const PhotoGrid = ({ photos, onRemovePhoto, onReorderPhotos }) => {
  const { t } = useLanguage();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-800">
          {t('selectedPhotos')}
        </h3>
        <span className="text-sm text-gray-500">
          {photos.length}/10
        </span>
      </div>

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.Id}
            className="relative group bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
          >
            {/* Photo */}
            <div className="aspect-square relative">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  onClick={() => onRemovePhoto(photo.Id)}
                  variant="danger"
                  className="p-2 text-white bg-error/80 hover:bg-error"
                  icon="X"
                />
              </div>
              
              {/* Order Number */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
            
            {/* Photo Info */}
            <div className="p-3 space-y-1">
              <p className="text-xs font-medium text-gray-800 truncate">
                {photo.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(photo.size)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {photos.length > 0 && (
        <motion.div
          className="card-premium p-4 bg-gradient-to-br from-info/5 to-primary/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" size={16} className="text-info mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-1">{t('photoOrderInfo')}</p>
              <p>{t('photoOrderDesc')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoGrid;
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PhotoUploadZone from '@/components/molecules/PhotoUploadZone';
import PhotoGrid from '@/components/molecules/PhotoGrid';
import { useLanguage } from '@/hooks/useLanguage';
import { useVideo } from '@/hooks/useVideo';

const PhotoUploadPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { photos, setPhotos } = useVideo();
  const [uploading, setUploading] = useState(false);

const handleFilesSelect = useCallback(async (files) => {
    if (files.length === 0) return;

    if (photos.length + files.length > 10) {
      toast.error(t('maxPhotosError'));
      return;
    }

    setUploading(true);

    try {
      const newPhotos = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(t('invalidFileType'));
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(t('fileSizeError'));
          continue;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Prepare photo object with API integration placeholders
        const photoData = {
          Id: Date.now() + i,
          file,
          url,
          name: file.name,
          size: file.size,
          originalUrl: url,
          processedUrl: null,
          backgroundRemoved: false,
          processing: false,
          apiMetadata: {
            removeBg: {
              processed: false,
              originalSize: file.size,
              processedSize: null,
              processingTime: null
            }
          }
        };

        newPhotos.push(photoData);
      }

      setPhotos([...photos, ...newPhotos]);
      
      if (newPhotos.length > 0) {
        toast.success(t('photosUploadedSuccess', { count: newPhotos.length }));
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error(t('uploadError'));
    } finally {
      setUploading(false);
    }
  }, [photos, setPhotos, t]);

  const handleRemovePhoto = (photoId) => {
    const photoToRemove = photos.find(p => p.Id === photoId);
    if (photoToRemove?.url) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    setPhotos(photos.filter(p => p.Id !== photoId));
    toast.success(t('photoRemoved'));
  };

  const handleReorderPhotos = (startIndex, endIndex) => {
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(startIndex, 1);
    newPhotos.splice(endIndex, 0, removed);
    setPhotos(newPhotos);
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      toast.error(t('selectPhotosFirst'));
      return;
    }
    navigate('/mood');
  };

  const handleBack = () => {
    navigate('/create');
  };

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
              {t('uploadPhotos')}
            </h1>
            <p className="text-gray-600">
              {t('uploadPhotosSubtitle')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t('photosSelected', { count: photos.length, max: 10 })}
          </div>
          {photos.length > 0 && (
            <div className="text-sm text-primary font-medium">
              {t('dragToReorder')}
            </div>
          )}
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PhotoUploadZone
          onFilesSelect={handleFilesSelect}
          uploading={uploading}
          disabled={photos.length >= 10}
        />
      </motion.div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PhotoGrid
            photos={photos}
            onRemovePhoto={handleRemovePhoto}
            onReorderPhotos={handleReorderPhotos}
          />
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        className="flex justify-between items-center pt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
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
          disabled={photos.length === 0}
          className="btn-primary px-8"
          icon="ArrowRight"
        >
          {t('selectMood')}
        </Button>
      </motion.div>

      {/* Tips */}
      <motion.div
        className="card-premium p-4 bg-gradient-to-br from-info/5 to-primary/5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" size={20} className="text-info mt-1 flex-shrink-0" />
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-medium text-gray-800">{t('uploadTipsTitle')}</p>
            <ul className="space-y-1">
              <li>• {t('uploadTip1')}</li>
              <li>• {t('uploadTip2')}</li>
              <li>• {t('uploadTip3')}</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoUploadPage;
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';

const PhotoUploadZone = ({ onFilesSelect, uploading, disabled }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    onFilesSelect(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelect(files);
    e.target.value = '';
  };

  const openFileSelector = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={openFileSelector}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={disabled ? {} : { scale: 1.02 }}
        animate={uploading ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3, repeat: uploading ? Infinity : 0 }}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <ApperIcon name="Loader2" size={32} className="text-white" />
              </motion.div>
            ) : (
              <ApperIcon name="Upload" size={32} className="text-white" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-display font-semibold text-gray-800">
              {uploading ? t('uploadingPhotos') : t('uploadYourPhotos')}
            </h3>
            <p className="text-gray-600">
              {disabled 
                ? t('maxPhotosReached') 
                : uploading 
                ? t('pleaseWait') 
                : t('dragDropOrClick')
              }
            </p>
          </div>
          
          {!uploading && !disabled && (
            <Button
              variant="secondary"
              className="mx-auto"
              icon="FolderOpen"
            >
              {t('browseFiles')}
            </Button>
          )}
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      <div className="text-center space-y-2 text-sm text-gray-500">
        <p>{t('supportedFormats')}: JPG, PNG, WEBP</p>
        <p>{t('maxFileSize')}: 5MB {t('perPhoto')}</p>
        <p>{t('maxPhotos')}: 10</p>
      </div>
    </div>
  );
};

export default PhotoUploadZone;
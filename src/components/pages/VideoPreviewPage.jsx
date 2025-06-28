import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import VideoPlayer from '@/components/molecules/VideoPlayer';
import Loading from '@/components/ui/Loading';
import { useLanguage } from '@/hooks/useLanguage';
import { useVideo } from '@/hooks/useVideo';
import { videoService } from '@/services/api/videoService';

const VideoPreviewPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { photos, selectedMood, resetProject } = useVideo();
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [generating, setGenerating] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!photos.length || !selectedMood) {
      navigate('/upload');
      return;
    }

    generateVideo();
  }, [photos, selectedMood, navigate]);

  const generateVideo = async () => {
    try {
      setGenerating(true);
      
      // Simulate video generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newVideo = await videoService.create({
        photos: photos.map(p => p.url),
        moodId: selectedMood.Id,
        mood: selectedMood.name,
        duration: Math.min(photos.length * 3, 30), // 3 seconds per photo, max 30s
        music: selectedMood.music?.[0] || 'default-music.mp3',
        createdAt: new Date().toISOString(),
      });

      setGeneratedVideo(newVideo);
      toast.success(t('videoGenerated'));
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error(t('videoGenerationError'));
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedVideo) return;

    try {
      setDownloading(true);
      
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would trigger actual download
      toast.success(t('videoDownloaded'));
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error(t('downloadError'));
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!generatedVideo) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: t('myMoodVideo'),
          text: t('shareMessage'),
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t('linkCopied'));
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      toast.error(t('shareError'));
    }
  };

  const handleCreateAnother = () => {
    resetProject();
    navigate('/create');
  };

  const handleBack = () => {
    navigate('/mood');
  };

  if (generating) {
    return (
      <div className="space-y-8 py-6 max-w-4xl mx-auto">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Video" size={32} className="text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
              {t('generatingVideo')}
            </h1>
            <p className="text-gray-600">
              {t('generatingVideoSubtitle')}
            </p>
          </div>

          <Loading />

          <div className="card-premium p-6 max-w-md mx-auto">
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
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  {selectedMood.name} {t('mood')}
                </p>
                <p className="text-sm text-gray-600">
                  {photos.length} {t('photos')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
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
              {t('videoPreview')}
            </h1>
            <p className="text-gray-600">
              {t('videoPreviewSubtitle')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <VideoPlayer video={generatedVideo} />
      </motion.div>

      {/* Video Info */}
      <motion.div
        className="card-premium p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Palette" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('mood')}</p>
              <p className="font-medium text-gray-800">{selectedMood.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('duration')}</p>
              <p className="font-medium text-gray-800">{generatedVideo?.duration}s</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Image" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('photos')}</p>
              <p className="font-medium text-gray-800">{photos.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-primary"
          icon={downloading ? "Loader2" : "Download"}
        >
          {downloading ? t('downloading') : t('download')}
        </Button>
        
        <Button
          onClick={handleShare}
          variant="secondary"
          className="btn-secondary"
          icon="Share"
        >
          {t('share')}
        </Button>
        
        <Button
          onClick={handleCreateAnother}
          variant="secondary"
          className="btn-secondary"
          icon="Plus"
        >
          {t('createAnother')}
        </Button>
      </motion.div>

      {/* Watermark Notice */}
      <motion.div
        className="card-premium p-4 bg-gradient-to-br from-warning/10 to-accent/10 border border-warning/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" size={20} className="text-warning mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium text-gray-800">{t('freeVersionNotice')}</p>
            <p className="text-sm text-gray-600">{t('upgradeForWatermarkFree')}</p>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              icon="Crown"
            >
              {t('upgradeToVIP')}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPreviewPage;
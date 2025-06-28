import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video, onDelete, showActions = false }) => {
  const { t } = useLanguage();

  const handlePlay = () => {
    toast.info(t('playingVideo'));
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${t('myMoodVideo')} - ${video.mood}`,
          text: t('shareMessage'),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t('linkCopied'));
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      toast.error(t('shareError'));
    }
  };

  const handleDownload = () => {
    toast.info(t('downloadingVideo'));
    // Simulate download
    setTimeout(() => {
      toast.success(t('videoDownloaded'));
    }, 2000);
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#FFD93D',
      romantic: '#FF6B9D',
      sad: '#6C8EBF',
      calm: '#4ECDC4',
      adventure: '#FF8C42',
      custom: '#7B68EE',
    };
    return colors[mood.toLowerCase()] || colors.custom;
  };

  const getMoodIcon = (mood) => {
    const icons = {
      happy: 'Smile',
      romantic: 'Heart',
      sad: 'Cloud',
      calm: 'Leaf',
      adventure: 'Mountain',
      custom: 'Palette',
    };
    return icons[mood.toLowerCase()] || icons.custom;
  };

  return (
    <motion.div
      className="card-premium overflow-hidden group"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {video.photos && video.photos.length > 0 ? (
          <img
            src={video.photos[0]}
            alt={`${video.mood} video`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <ApperIcon name="Video" size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            onClick={handlePlay}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Play" size={24} className="text-gray-800 ml-1" />
          </motion.button>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {video.duration}s
        </div>
        
        {/* Watermark Indicator */}
        <div className="absolute bottom-3 left-3 bg-warning/20 text-warning text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          {t('watermark')}
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: getMoodColor(video.mood) + '20' }}
            >
              <ApperIcon 
                name={getMoodIcon(video.mood)} 
                size={16} 
                style={{ color: getMoodColor(video.mood) }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 capitalize">
                {video.mood} {t('mood')}
              </h3>
              <p className="text-xs text-gray-500">
                {video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : t('justNow')}
              </p>
            </div>
          </div>
          
          <div className="text-right text-xs text-gray-500">
            {video.photos?.length || 0} {t('photos')}
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2 pt-2 border-t border-gray-100">
            <Button
              onClick={handleShare}
              variant="ghost"
              className="flex-1 text-xs py-2"
              icon="Share"
            >
              {t('share')}
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="ghost"
              className="flex-1 text-xs py-2"
              icon="Download"
            >
              {t('download')}
            </Button>
            
            {onDelete && (
              <Button
                onClick={onDelete}
                variant="ghost"
                className="text-error hover:text-error/80 text-xs py-2 px-3"
                icon="Trash2"
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import QuoteCarousel from '@/components/molecules/QuoteCarousel';
import VideoCard from '@/components/molecules/VideoCard';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { useLanguage } from '@/hooks/useLanguage';
import { videoService } from '@/services/api/videoService';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentVideos = async () => {
      try {
        setLoading(true);
        const videos = await videoService.getAll();
        setRecentVideos(videos.slice(0, 3));
      } catch (error) {
        console.error('Error loading recent videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentVideos();
  }, []);

  const handleCreateVideo = () => {
    navigate('/create');
  };

  const handleViewAllVideos = () => {
    navigate('/library');
  };

  return (
    <div className="space-y-8 py-6">
      {/* Welcome Section */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text">
          {t('welcomeToMoodVidz')}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('homeSubtitle')}
        </p>
      </motion.div>

      {/* Quote Carousel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <QuoteCarousel />
      </motion.div>

      {/* Create Video Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Button
          onClick={handleCreateVideo}
          className="btn-primary text-lg px-8 py-4 shadow-2xl"
          icon="Video"
        >
          {t('createYourMoodVideo')}
        </Button>
      </motion.div>

      {/* Recent Videos Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            {t('recentVideos')}
          </h2>
          {recentVideos.length > 0 && (
            <Button
              onClick={handleViewAllVideos}
              variant="ghost"
              className="text-primary hover:text-primary/80"
              icon="ArrowRight"
            >
              {t('viewAll')}
            </Button>
          )}
        </div>

        {loading ? (
          <Loading />
        ) : recentVideos.length === 0 ? (
          <Empty
            icon="Video"
            title={t('noVideosYet')}
            description={t('createFirstVideo')}
            actionLabel={t('createVideo')}
            onAction={handleCreateVideo}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video, index) => (
              <motion.div
                key={video.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {[
          {
            icon: 'Upload',
            title: t('uploadPhotos'),
            description: t('uploadPhotosDesc'),
          },
          {
            icon: 'Palette',
            title: t('chooseMood'),
            description: t('chooseMoodDesc'),
          },
          {
            icon: 'Download',
            title: t('downloadShare'),
            description: t('downloadShareDesc'),
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            className="card-premium p-6 text-center space-y-4"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name={feature.icon} size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;
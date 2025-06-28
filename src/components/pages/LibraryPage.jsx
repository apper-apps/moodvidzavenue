import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import VideoCard from '@/components/molecules/VideoCard';
import SearchBar from '@/components/molecules/SearchBar';
import FilterTabs from '@/components/molecules/FilterTabs';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { useLanguage } from '@/hooks/useLanguage';
import { videoService } from '@/services/api/videoService';

const LibraryPage = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: t('allVideos'), icon: 'Grid3X3' },
    { id: 'happy', label: t('happy'), icon: 'Smile' },
    { id: 'romantic', label: t('romantic'), icon: 'Heart' },
    { id: 'sad', label: t('sad'), icon: 'Cloud' },
    { id: 'calm', label: t('calm'), icon: 'Leaf' },
    { id: 'adventure', label: t('adventure'), icon: 'Mountain' },
  ];

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchQuery, selectedFilter]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const videosData = await videoService.getAll();
      setVideos(videosData);
    } catch (err) {
      console.error('Error loading videos:', err);
      setError(t('errorLoadingVideos'));
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    // Filter by mood
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(video => 
        video.mood.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video =>
        video.mood.toLowerCase().includes(query) ||
        video.Id.toString().includes(query)
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredVideos(filtered);
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await videoService.delete(videoId);
      setVideos(videos.filter(v => v.Id !== videoId));
      toast.success(t('videoDeleted'));
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error(t('deleteError'));
    }
  };

  const handleRetry = () => {
    loadVideos();
  };

  if (loading) {
    return (
      <div className="space-y-8 py-6">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
            {t('myVideos')}
          </h1>
          <div className="h-12 bg-surface rounded-xl animate-pulse" />
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-20 bg-surface rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
          {t('myVideos')}
        </h1>
        <Error
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
            {t('myVideos')}
          </h1>
          <div className="text-sm text-gray-500">
            {filteredVideos.length} {t('videos')}
          </div>
        </div>
        
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('searchVideos')}
        />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <FilterTabs
          options={filterOptions}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </motion.div>

      {/* Videos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredVideos.length === 0 ? (
          <Empty
            icon="Video"
            title={searchQuery || selectedFilter !== 'all' ? t('noVideosFound') : t('noVideosYet')}
            description={searchQuery || selectedFilter !== 'all' ? t('tryDifferentSearch') : t('createFirstVideo')}
            actionLabel={t('createVideo')}
            onAction={() => window.location.href = '/create'}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <VideoCard
                  video={video}
                  onDelete={() => handleDeleteVideo(video.Id)}
                  showActions
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Statistics */}
      {videos.length > 0 && (
        <motion.div
          className="card-premium p-6 bg-gradient-to-br from-primary/5 to-secondary/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-display font-bold gradient-text">
                {videos.length}
              </div>
              <div className="text-sm text-gray-600">{t('totalVideos')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-display font-bold gradient-text">
                {videos.reduce((sum, video) => sum + (video.duration || 0), 0)}s
              </div>
              <div className="text-sm text-gray-600">{t('totalDuration')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-display font-bold gradient-text">
                {new Set(videos.map(v => v.mood)).size}
              </div>
              <div className="text-sm text-gray-600">{t('moodsUsed')}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LibraryPage;
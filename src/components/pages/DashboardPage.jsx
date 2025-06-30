import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import VideoCard from '@/components/molecules/VideoCard';
import { useLanguage } from '@/hooks/useLanguage';
import authService from '@/services/api/authService';
import { videoService } from '@/services/api/videoService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalShares: 0,
    storageUsed: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Load user's videos
      const videos = await videoService.getAll();
      const filteredVideos = videos.filter(video => video.userId === currentUser.Id);
      setUserVideos(filteredVideos);

      // Calculate stats
      const totalViews = filteredVideos.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalShares = filteredVideos.reduce((sum, video) => sum + (video.shares || 0), 0);
      const storageUsed = filteredVideos.reduce((sum, video) => sum + (video.fileSize || 0), 0);

      setStats({
        totalVideos: filteredVideos.length,
        totalViews,
        totalShares,
        storageUsed: Math.round(storageUsed / (1024 * 1024)) // Convert to MB
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleCreateVideo = () => {
    navigate('/create');
  };

  const handleViewVideo = (video) => {
    navigate('/preview', { state: { video } });
  };

  const statCards = [
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: 'Video',
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: 'Eye',
      color: 'secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Shares',
      value: stats.totalShares,
      icon: 'Share2',
      color: 'accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Storage Used',
      value: `${stats.storageUsed} MB`,
      icon: 'HardDrive',
      color: 'info',
      bgColor: 'bg-info/10'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Video',
      description: 'Start creating your next mood video',
      icon: 'Plus',
      action: handleCreateVideo,
      variant: 'primary'
    },
    {
      title: 'Browse Library',
      description: 'View all your created videos',
      icon: 'Library',
      action: () => navigate('/library'),
      variant: 'secondary'
    },
    {
      title: 'Upgrade to VIP',
      description: 'Remove watermarks and get premium features',
      icon: 'Crown',
      action: () => navigate('/vip'),
      variant: 'secondary'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8 py-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your mood videos
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCreateVideo}
              className="btn-primary"
              icon="Plus"
            >
              Create Video
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
              icon="LogOut"
            >
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="card-premium p-6 space-y-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} size={20} className={`text-${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-display font-semibold text-gray-800">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className="card-premium p-6 space-y-4 cursor-pointer group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={action.action}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${action.variant === 'primary' ? 'bg-primary' : 'bg-gray-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <ApperIcon 
                    name={action.icon} 
                    size={24} 
                    className={action.variant === 'primary' ? 'text-white' : 'text-gray-600'} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
                <ApperIcon name="ArrowRight" size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Videos */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-gray-800">
            Recent Videos
          </h2>
          {userVideos.length > 0 && (
            <Button
              onClick={() => navigate('/library')}
              variant="ghost"
              className="text-primary hover:text-primary/80"
              icon="ArrowRight"
            >
              View All
            </Button>
          )}
        </div>

        {userVideos.length === 0 ? (
          <motion.div
            className="card-premium p-12 text-center space-y-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Video" size={32} className="text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-800">
                No videos yet
              </h3>
              <p className="text-gray-600">
                Create your first mood video to get started
              </p>
            </div>
            <Button
              onClick={handleCreateVideo}
              className="btn-primary"
              icon="Plus"
            >
              Create Your First Video
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userVideos.slice(0, 6).map((video, index) => (
              <motion.div
                key={video.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <VideoCard
                  video={video}
                  onView={() => handleViewVideo(video)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
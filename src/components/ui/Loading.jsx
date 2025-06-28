import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl shimmer-effect w-3/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer-effect w-1/2" />
      </div>
      
      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="card-premium p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {/* Video Thumbnail Skeleton */}
            <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl shimmer-effect" />
            
            {/* Content Skeleton */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full shimmer-effect" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer-effect w-3/4" />
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer-effect w-1/2" />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer-effect flex-1" />
                <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer-effect flex-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
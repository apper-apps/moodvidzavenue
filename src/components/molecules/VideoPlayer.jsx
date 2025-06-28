import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import { useLanguage } from '@/hooks/useLanguage';

const VideoPlayer = ({ video }) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual video playback
  };

  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = (x / rect.width) * 100;
    setProgress(newProgress);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * (video?.duration || 30);
  const totalTime = video?.duration || 30;

  return (
    <div 
      className="video-player group"
      onMouseMove={handleMouseMove}
    >
      {/* Video Content */}
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
        {/* Mock Video Preview */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20">
          {video?.photos && video.photos.length > 0 && (
            <motion.img
              src={video.photos[0]}
              alt="Video preview"
              className="w-full h-full object-cover"
              animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
            />
          )}
        </div>
        
        {/* Play/Pause Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handlePlayPause}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon 
              name={isPlaying ? "Pause" : "Play"} 
              size={32} 
              className="text-white ml-1" 
            />
          </motion.button>
        </motion.div>
        
        {/* Video Controls */}
        <motion.div
          className="video-controls"
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-3">
            {/* Progress Bar */}
            <div 
              className="cursor-pointer"
              onClick={handleProgressChange}
            >
              <ProgressBar progress={progress} className="h-1" />
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handlePlayPause}
                  variant="ghost"
                  className="text-white hover:text-white p-2"
                  icon={isPlaying ? "Pause" : "Play"}
                />
                
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Volume2" size={16} className="text-white" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none slider"
                  />
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(totalTime)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white p-2"
                  icon="Settings"
                />
                <Button
                  variant="ghost"
                  className="text-white hover:text-white p-2"
                  icon="Maximize"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Watermark */}
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          MoodVidz
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
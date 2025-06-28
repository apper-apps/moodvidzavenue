import { createContext, useContext, useState } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  const resetProject = () => {
    setPhotos([]);
    setSelectedMood(null);
    setCurrentProject(null);
  };

  const value = {
    photos,
    setPhotos,
    selectedMood,
    setSelectedMood,
    currentProject,
    setCurrentProject,
    resetProject,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
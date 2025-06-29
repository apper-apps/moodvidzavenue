import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import HomePage from '@/components/pages/HomePage';
import CreatePage from '@/components/pages/CreatePage';
import PhotoUploadPage from '@/components/pages/PhotoUploadPage';
import MoodSelectionPage from '@/components/pages/MoodSelectionPage';
import VideoPreviewPage from '@/components/pages/VideoPreviewPage';
import LibraryPage from '@/components/pages/LibraryPage';
import SettingsPage from '@/components/pages/SettingsPage';
import VipPage from '@/components/pages/VipPage';
import AdminDashboard from '@/components/pages/AdminDashboard';
import AdminUsers from '@/components/pages/AdminUsers';
// NOTE: Authentication pages need to be created separately
// import LoginPage from '@/components/pages/LoginPage';
// import RegisterPage from '@/components/pages/RegisterPage';
import { LanguageProvider } from '@/hooks/useLanguage';
import { VideoProvider } from '@/hooks/useVideo';
function App() {
  return (
    <LanguageProvider>
      <VideoProvider>
        <Router>
          <div className="min-h-screen bg-background">
<Routes>
              {/* Authentication routes - outside Layout */}
              {/* <Route path="/login" element={<LoginPage />} /> */}
              {/* <Route path="/register" element={<RegisterPage />} /> */}
              
              {/* Main app routes - inside Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="create" element={<CreatePage />} />
<Route path="upload" element={<PhotoUploadPage />} />
                <Route path="mood" element={<MoodSelectionPage />} />
                <Route path="preview" element={<VideoPreviewPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="vip" element={<VipPage />} />
                
                {/* Admin routes */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<AdminUsers />} />
              </Route>
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 9999 }}
            />
          </div>
        </Router>
      </VideoProvider>
    </LanguageProvider>
  );
}

export default App;
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: 'Home',
    create: 'Create',
    library: 'Library',
    settings: 'Settings',
    
    // Home Page
    welcomeToMoodVidz: 'Welcome to MoodVidz',
    homeSubtitle: 'Transform your photos into beautiful mood-based videos with music and effects',
    createYourMoodVideo: 'Create Your Mood Video',
    recentVideos: 'Recent Videos',
    noVideosYet: 'No videos yet',
    createFirstVideo: 'Start creating your first mood video',
    createVideo: 'Create Video',
    viewAll: 'View All',
    
    // Features
    uploadPhotos: 'Upload Photos',
    uploadPhotosDesc: 'Add 1-10 beautiful photos',
    chooseMood: 'Choose Mood',
    chooseMoodDesc: 'Select the perfect mood for your video',
    downloadShare: 'Download & Share',
    downloadShareDesc: 'Save and share your creation',
    
    // Create Page
    createMoodVideo: 'Create Mood Video',
    createVideoSubtitle: 'Follow these simple steps to create your perfect mood video',
    howItWorks: 'How It Works',
    uploadPhotosStepDesc: 'Select 1-10 photos from your device',
    selectMoodStepDesc: 'Choose the mood that matches your story',
    generateVideoStepDesc: 'Our AI creates your video with music and effects',
    downloadShareStepDesc: 'Save and share your masterpiece',
    startCreating: 'Start Creating',
    proTips: 'Pro Tips',
    tip1: 'Use high-quality photos for best results',
    tip2: 'Photos with similar lighting work great together',
    tip3: 'Consider the story you want to tell',
    tip4: 'Experiment with different moods',
    
    // Upload Page
    uploadPhotosSubtitle: 'Add your favorite photos to create your mood video',
    photosSelected: '{count} of {max} photos selected',
    dragToReorder: 'Drag to reorder',
    selectPhotosFirst: 'Please select at least one photo',
    selectMood: 'Select Mood',
    back: 'Back',
    uploadingPhotos: 'Uploading Photos...',
    uploadYourPhotos: 'Upload Your Photos',
    maxPhotosReached: 'Maximum 10 photos reached',
    pleaseWait: 'Please wait...',
    dragDropOrClick: 'Drag & drop photos here or click to browse',
    browseFiles: 'Browse Files',
    supportedFormats: 'Supported formats',
    maxFileSize: 'Max file size',
    perPhoto: 'per photo',
    maxPhotos: 'Max photos',
    selectedPhotos: 'Selected Photos',
    photoOrderInfo: 'Photo Order',
    photoOrderDesc: 'The order of photos determines the sequence in your video',
    maxPhotosError: 'You can only upload up to 10 photos',
    invalidFileType: 'Please select only image files',
    fileSizeError: 'File size must be less than 5MB',
    photosUploadedSuccess: '{count} photos uploaded successfully',
    uploadError: 'Error uploading photos',
    photoRemoved: 'Photo removed',
    uploadTipsTitle: 'Upload Tips:',
    uploadTip1: 'JPG, PNG, WEBP formats supported',
    uploadTip2: 'Maximum 5MB per photo',
    uploadTip3: 'Up to 10 photos per video',
    
    // Mood Selection
    selectMoodSubtitle: 'Choose the perfect mood for your video story',
    choosePerfectMood: 'Choose the Perfect Mood',
    moodSelected: '{mood} mood selected',
    selectMoodFirst: 'Please select a mood first',
    generateVideo: 'Generate Video',
    mood: 'Mood',
    photos: 'Photos',
    tracks: 'tracks',
    selected: 'Selected',
    
    // Moods
    happy: 'Happy',
    romantic: 'Romantic',
    sad: 'Sad',
    calm: 'Calm',
    adventure: 'Adventure',
    custom: 'Custom',
    
    // Video Preview
    videoPreview: 'Video Preview',
    videoPreviewSubtitle: 'Your mood video is ready! Preview, download, or share',
    generatingVideo: 'Generating Your Video',
    generatingVideoSubtitle: 'Please wait while we create your perfect mood video...',
    videoGenerated: 'Video generated successfully!',
    videoGenerationError: 'Error generating video',
    duration: 'Duration',
    download: 'Download',
    share: 'Share',
    createAnother: 'Create Another',
    downloading: 'Downloading...',
    videoDownloaded: 'Video downloaded successfully',
    downloadError: 'Error downloading video',
    myMoodVideo: 'My Mood Video',
    shareMessage: 'Check out this amazing mood video I created with MoodVidz!',
    linkCopied: 'Link copied to clipboard',
    shareError: 'Error sharing video',
    freeVersionNotice: 'Free Version',
    upgradeForWatermarkFree: 'Upgrade to VIP for watermark-free videos and more features',
    upgradeToVIP: 'Upgrade to VIP',
    watermark: 'Watermark',
    playingVideo: 'Playing video...',
    downloadingVideo: 'Downloading video...',
    
    // Library
    myVideos: 'My Videos',
    searchVideos: 'Search videos...',
    allVideos: 'All Videos',
    noVideosFound: 'No videos found',
    tryDifferentSearch: 'Try a different search or filter',
    videos: 'videos',
    videoDeleted: 'Video deleted successfully',
    deleteError: 'Error deleting video',
    totalVideos: 'Total Videos',
    totalDuration: 'Total Duration',
    moodsUsed: 'Moods Used',
    errorLoadingVideos: 'Error loading videos',
    
    // Settings
    settingsSubtitle: 'Customize your MoodVidz experience',
    language: 'Language',
    languageDesc: 'Choose your preferred language',
    preferences: 'Preferences',
    notifications: 'Notifications',
    notificationsDesc: 'Receive updates and reminders',
    autoSave: 'Auto Save',
    autoSaveDesc: 'Automatically save your projects',
    highQuality: 'High Quality',
    highQualityDesc: 'Export videos in highest quality (VIP)',
    privacy: 'Privacy & Security',
    pinLock: 'PIN Lock',
    pinLockDesc: 'Protect your videos with a PIN',
    data: 'Data Management',
    exportData: 'Export Data',
    exportDataDesc: 'Download all your data',
    clearCache: 'Clear Cache',
    clearCacheDesc: 'Free up storage space',
    settingUpdated: 'Setting updated',
    exportingData: 'Exporting data...',
    dataExported: 'Data exported successfully',
    clearingCache: 'Clearing cache...',
    cacheCleared: 'Cache cleared successfully',
    support: 'Support & Feedback',
    helpCenter: 'Help Center',
    contactSupport: 'Contact Support',
    rateApp: 'Rate App',
    shareApp: 'Share App',
    appVersion: 'App Version',
    allRightsReserved: 'All rights reserved',
    
    // Common
    search: 'Search',
    justNow: 'Just now',
    
    // Quotes
    quote1: 'Every picture tells a story, every story deserves the perfect mood.',
    quote1Author: 'MoodVidz Team',
    quote2: 'Memories are timeless treasures of the heart.',
    quote2Author: 'Unknown',
    quote3: 'Life is like a camera. Focus on what\'s important.',
    quote3Author: 'Photography Wisdom',
    quote4: 'In every photo, there\'s a story waiting to be told.',
    quote4Author: 'Creative Vision',
    
    // Error Messages
    oopsError: 'Oops! Something went wrong',
    somethingWentWrong: 'Something went wrong. Please try again.',
    tryAgain: 'Try Again',
    errorPersists: 'If the problem persists:',
    
    // Empty States
    nothingHereYet: 'Nothing here yet',
    getStartedByCreating: 'Get started by creating your first mood video',
    letsGetCreative: 'Let\'s get creative!',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    create: 'إنشاء',
    library: 'المكتبة',
    settings: 'الإعدادات',
    
    // Home Page
    welcomeToMoodVidz: 'مرحباً بك في موود فيديز',
    homeSubtitle: 'حول صورك إلى مقاطع فيديو جميلة مع الموسيقى والتأثيرات',
    createYourMoodVideo: 'أنشئ فيديو المزاج',
    recentVideos: 'الفيديوهات الأخيرة',
    noVideosYet: 'لا توجد فيديوهات بعد',
    createFirstVideo: 'ابدأ بإنشاء فيديو المزاج الأول',
    createVideo: 'إنشاء فيديو',
    viewAll: 'عرض الكل',
    
    // Features
    uploadPhotos: 'رفع الصور',
    uploadPhotosDesc: 'أضف من 1-10 صور جميلة',
    chooseMood: 'اختيار المزاج',
    chooseMoodDesc: 'اختر المزاج المثالي لفيديوك',
    downloadShare: 'تحميل ومشاركة',
    downloadShareDesc: 'احفظ وشارك إبداعك',
    
    // Create Page
    createMoodVideo: 'إنشاء فيديو مزاج',
    createVideoSubtitle: 'اتبع هذه الخطوات البسيطة لإنشاء فيديو المزاج المثالي',
    howItWorks: 'كيف يعمل',
    uploadPhotosStepDesc: 'اختر من 1-10 صور من جهازك',
    selectMoodStepDesc: 'اختر المزاج الذي يناسب قصتك',
    generateVideoStepDesc: 'ذكاؤنا الاصطناعي ينشئ فيديوك مع الموسيقى والتأثيرات',
    downloadShareStepDesc: 'احفظ وشارك تحفتك الفنية',
    startCreating: 'ابدأ الإنشاء',
    proTips: 'نصائح محترفة',
    tip1: 'استخدم صور عالية الجودة للحصول على أفضل النتائج',
    tip2: 'الصور ذات الإضاءة المتشابهة تعمل بشكل رائع معاً',
    tip3: 'فكر في القصة التي تريد حكايتها',
    tip4: 'جرب مزاجات مختلفة',
    
    // Upload Page
    uploadPhotosSubtitle: 'أضف صورك المفضلة لإنشاء فيديو المزاج',
    photosSelected: '{count} من {max} صور محددة',
    dragToReorder: 'اسحب لإعادة الترتيب',
    selectPhotosFirst: 'يرجى اختيار صورة واحدة على الأقل',
    selectMood: 'اختيار المزاج',
    back: 'رجوع',
    uploadingPhotos: 'جاري رفع الصور...',
    uploadYourPhotos: 'ارفع صورك',
    maxPhotosReached: 'تم الوصول للحد الأقصى 10 صور',
    pleaseWait: 'يرجى الانتظار...',
    dragDropOrClick: 'اسحب وأفلت الصور هنا أو انقر للتصفح',
    browseFiles: 'تصفح الملفات',
    supportedFormats: 'الصيغ المدعومة',
    maxFileSize: 'الحد الأقصى لحجم الملف',
    perPhoto: 'لكل صورة',
    maxPhotos: 'الحد الأقصى للصور',
    selectedPhotos: 'الصور المحددة',
    photoOrderInfo: 'ترتيب الصور',
    photoOrderDesc: 'ترتيب الصور يحدد التسلسل في الفيديو',
    maxPhotosError: 'يمكنك رفع 10 صور فقط كحد أقصى',
    invalidFileType: 'يرجى اختيار ملفات الصور فقط',
    fileSizeError: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت',
    photosUploadedSuccess: 'تم رفع {count} صور بنجاح',
    uploadError: 'خطأ في رفع الصور',
    photoRemoved: 'تم حذف الصورة',
    uploadTipsTitle: 'نصائح الرفع:',
    uploadTip1: 'صيغ JPG، PNG، WEBP مدعومة',
    uploadTip2: 'حد أقصى 5 ميجابايت لكل صورة',
    uploadTip3: 'حتى 10 صور لكل فيديو',
    
    // Mood Selection
    selectMoodSubtitle: 'اختر المزاج المثالي لقصة الفيديو',
    choosePerfectMood: 'اختر المزاج المثالي',
    moodSelected: 'تم اختيار مزاج {mood}',
    selectMoodFirst: 'يرجى اختيار المزاج أولاً',
    generateVideo: 'إنشاء الفيديو',
    mood: 'المزاج',
    photos: 'الصور',
    tracks: 'المقاطع',
    selected: 'محدد',
    
    // Moods
    happy: 'سعيد',
    romantic: 'رومانسي',
    sad: 'حزين',
    calm: 'هادئ',
    adventure: 'مغامرة',
    custom: 'مخصص',
    
    // Video Preview
    videoPreview: 'معاينة الفيديو',
    videoPreviewSubtitle: 'فيديو المزاج جاهز! عاين، حمل، أو شارك',
    generatingVideo: 'جاري إنشاء الفيديو',
    generatingVideoSubtitle: 'يرجى الانتظار بينما ننشئ فيديو المزاج المثالي...',
    videoGenerated: 'تم إنشاء الفيديو بنجاح!',
    videoGenerationError: 'خطأ في إنشاء الفيديو',
    duration: 'المدة',
    download: 'تحميل',
    share: 'مشاركة',
    createAnother: 'إنشاء آخر',
    downloading: 'جاري التحميل...',
    videoDownloaded: 'تم تحميل الفيديو بنجاح',
    downloadError: 'خطأ في تحميل الفيديو',
    myMoodVideo: 'فيديو المزاج الخاص بي',
    shareMessage: 'شاهد فيديو المزاج المذهل الذي أنشأته باستخدام موود فيديز!',
    linkCopied: 'تم نسخ الرابط',
    shareError: 'خطأ في مشاركة الفيديو',
    freeVersionNotice: 'النسخة المجانية',
    upgradeForWatermarkFree: 'ترقى إلى VIP للحصول على فيديوهات بدون علامة مائية والمزيد',
    upgradeToVIP: 'الترقية إلى VIP',
    watermark: 'علامة مائية',
    playingVideo: 'تشغيل الفيديو...',
    downloadingVideo: 'تحميل الفيديو...',
    
    // Library
    myVideos: 'فيديوهاتي',
    searchVideos: 'البحث في الفيديوهات...',
    allVideos: 'جميع الفيديوهات',
    noVideosFound: 'لم يتم العثور على فيديوهات',
    tryDifferentSearch: 'جرب بحث أو فلتر مختلف',
    videos: 'فيديوهات',
    videoDeleted: 'تم حذف الفيديو بنجاح',
    deleteError: 'خطأ في حذف الفيديو',
    totalVideos: 'إجمالي الفيديوهات',
    totalDuration: 'إجمالي المدة',
    moodsUsed: 'المزاجات المستخدمة',
    errorLoadingVideos: 'خطأ في تحميل الفيديوهات',
    
    // Settings
    settingsSubtitle: 'خصص تجربة موود فيديز الخاصة بك',
    language: 'اللغة',
    languageDesc: 'اختر لغتك المفضلة',
    preferences: 'التفضيلات',
    notifications: 'الإشعارات',
    notificationsDesc: 'تلقي التحديثات والتذكيرات',
    autoSave: 'الحفظ التلقائي',
    autoSaveDesc: 'حفظ مشاريعك تلقائياً',
    highQuality: 'جودة عالية',
    highQualityDesc: 'تصدير الفيديوهات بأعلى جودة (VIP)',
    privacy: 'الخصوصية والأمان',
    pinLock: 'قفل PIN',
    pinLockDesc: 'حماية فيديوهاتك برقم PIN',
    data: 'إدارة البيانات',
    exportData: 'تصدير البيانات',
    exportDataDesc: 'تحميل جميع بياناتك',
    clearCache: 'مسح التخزين المؤقت',
    clearCacheDesc: 'توفير مساحة التخزين',
    settingUpdated: 'تم تحديث الإعداد',
    exportingData: 'جاري تصدير البيانات...',
    dataExported: 'تم تصدير البيانات بنجاح',
    clearingCache: 'جاري مسح التخزين المؤقت...',
    cacheCleared: 'تم مسح التخزين المؤقت بنجاح',
    support: 'الدعم والملاحظات',
    helpCenter: 'مركز المساعدة',
    contactSupport: 'اتصل بالدعم',
    rateApp: 'قيم التطبيق',
    shareApp: 'شارك التطبيق',
    appVersion: 'إصدار التطبيق',
    allRightsReserved: 'جميع الحقوق محفوظة',
    
    // Common
    search: 'بحث',
    justNow: 'الآن',
    
    // Quotes
    quote1: 'كل صورة تحكي قصة، وكل قصة تستحق المزاج المثالي.',
    quote1Author: 'فريق موود فيديز',
    quote2: 'الذكريات كنوز خالدة في القلب.',
    quote2Author: 'مجهول',
    quote3: 'الحياة مثل الكاميرا. ركز على ما هو مهم.',
    quote3Author: 'حكمة التصوير',
    quote4: 'في كل صورة، هناك قصة تنتظر أن تُحكى.',
    quote4Author: 'الرؤية الإبداعية',
    
    // Error Messages
    oopsError: 'عذراً! حدث خطأ ما',
    somethingWentWrong: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    tryAgain: 'حاول مرة أخرى',
    errorPersists: 'إذا استمرت المشكلة:',
    
    // Empty States
    nothingHereYet: 'لا يوجد شيء هنا بعد',
    getStartedByCreating: 'ابدأ بإنشاء فيديو المزاج الأول',
    letsGetCreative: 'لنبدع معاً!',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('moodvidz-language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('moodvidz-language', lang);
      
      // Update document direction
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const isRTL = language === 'ar';

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
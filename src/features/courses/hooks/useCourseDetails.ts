import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { ApiCourse } from '../types/course.types';
import { getCourseById, checkEnrollment, getSavedStatus, saveCourse, unsaveCourse } from '../services/course.service';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { fetchWithCache, cache } from '../../../shared/lib/cache';

export function useCourseDetails(courseId: string | undefined) {
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview'|'reviews'|'qna'|'syllabus'|'resources'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to show skeleton initially
  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        if (!courseId) {
          setIsLoading(false);
          return;
        }
        
        // Check cache first for instant loading
        const cacheKey = `course:details:${courseId}`;
        const cached = cache.get<ApiCourse>(cacheKey);
        
        if (cached) {
          // Set data immediately from cache
          setCourse(cached);
          setIsLoading(false);
          if (cached.lessons && cached.lessons.length > 0) {
            const firstVideoLesson = cached.lessons.find(l => l.videoUrl) || cached.lessons[0];
            setActiveLessonId(firstVideoLesson.id);
          }
          
          // If cache is stale, fetch fresh data in background
          if (cache.isStale(cacheKey)) {
            try {
              const freshData = await getCourseById(courseId);
              if (freshData) {
                cache.set(cacheKey, freshData);
                setCourse(freshData);
              }
            } catch (e) {
              console.warn('Background refresh failed:', e);
            }
          }
        } else {
          // No cache, fetch fresh data with loading state
          setIsLoading(true);
          const data = await fetchWithCache(cacheKey, () => getCourseById(courseId));
          
          if (data) {
            setCourse(data);
            if (data.lessons && data.lessons.length > 0) {
              const firstVideoLesson = data.lessons.find(l => l.videoUrl) || data.lessons[0];
              setActiveLessonId(firstVideoLesson.id);
            }
          }
          setIsLoading(false);
        }
        
        // Load user-specific data if authenticated and user is a STUDENT
        // (Enrollment and saved status are student-only features)
        if (user && courseId && user.role === 'STUDENT') {
          try {
            const resp = await fetchWithCache(
              `course:enrollment:${courseId}:${user.id}`,
              () => checkEnrollment(courseId)
            );
            setIsEnrolled(!!resp.enrolled);
          } catch {
            /* ignore */
          }
          
          try {
            const s = await fetchWithCache(
              `course:saved:${courseId}:${user.id}`,
              () => getSavedStatus(courseId)
            );
            setIsSaved(!!s.saved);
          } catch {
            /* ignore */
          }
        } else {
          setIsEnrolled(false);
          setIsSaved(false);
        }
      } catch (e) {
        console.error('Failed to load course:', e);
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      load();
    }
  }, [courseId, authLoading, user]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      // Consumers pass their own IconStar component; keep logic here minimal if needed
      i < Math.floor(rating)
    ));
  };

  const handleSaveToggle = async () => {
    if (!courseId) return;
    if (!user) {
      // optionally navigate to login
      setIsSaved(false);
      return;
    }
    // Only students can save courses
    if (user.role !== 'STUDENT') {
      return;
    }
    // optimistic
    const previousState = isSaved;
    setIsSaved((prev) => !prev);
    
    try {
      if (!previousState) {
        await saveCourse(courseId);
      } else {
        await unsaveCourse(courseId);
      }
      // Invalidate the saved status cache after successful save/unsave
      cache.delete(`course:saved:${courseId}:${user.id}`);
    } catch (e) {
      // rollback
      setIsSaved(previousState);
      console.error(e);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share === 'function') {
      (navigator as Navigator & { share: (data: ShareData) => Promise<void> })
        .share({
          title: course?.title,
          text: `Check out this course: ${course?.title}`,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
      // noop: UI can show toast
    }
  };

  const handleEnroll = async () => {
    if (!courseId) return;
    if (isEnrolled) return;
    if (!user) {
      // Save current URL to redirect back after login
      const currentPath = window.location.pathname;
      navigate('/login', { state: { from: currentPath } });
      return;
    }
    
    // Navigate to checkout page instead of direct enrollment
    navigate(`/checkout/${courseId}`);
  };

  const handleMessageTutor = () => {
    // TODO: Navigate to messages
  };

  const handleBookSession = () => {
    // The modal will be triggered from the component
    // This is just a placeholder for future logic
  };

  const totalDuration = useMemo(
    () => course?.lessons.reduce((sum, l) => sum + (l.duration || 0), 0) || 0,
    [course]
  );

  return {
    // data
    course,
    isLoading,
    totalDuration,

    // core UI state
    activeTab,
    setActiveTab,
    showFullDescription,
    setShowFullDescription,
    isVideoPlaying,
    setIsVideoPlaying,
    activeLessonId,
    setActiveLessonId,

    // user state
    isSaved,
    isEnrolled,
    isEnrolling: false, // Always false since we navigate to checkout instead

    // handlers
    renderStars,
    handleSaveToggle,
    handleShare,
    handleEnroll,
    handleMessageTutor,
    handleBookSession,
  } as const;
}

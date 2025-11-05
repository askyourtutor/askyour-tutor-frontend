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
  const [isLoading, setIsLoading] = useState(false); // Start as false for instant cache hits
  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const load = async () => {
      // Show loading only if taking longer than 100ms
      const loadingTimeout = setTimeout(() => setIsLoading(true), 100);
      try {
        if (!courseId) return;
        
        // Use cache with stale-while-revalidate pattern
        const data = await fetchWithCache(
          `course:details:${courseId}`,
          () => getCourseById(courseId)
        );
        
        if (data) {
          setCourse(data);
          // Auto-select the first lesson with video, or just the first lesson
          if (data.lessons && data.lessons.length > 0) {
            const firstVideoLesson = data.lessons.find(l => l.videoUrl) || data.lessons[0];
            setActiveLessonId(firstVideoLesson.id);
          }
        }
        // If authenticated student, check enrollment
        if (user && courseId) {
          try {
            // Cache enrollment status with shorter TTL (user-specific data)
            const resp = await fetchWithCache(
              `course:enrollment:${courseId}:${user.id}`,
              () => checkEnrollment(courseId)
            );
            setIsEnrolled(!!resp.enrolled);
          } catch {
            /* ignore */
          }
          // Check saved status
          try {
            // Cache saved status with shorter TTL (user-specific data)
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
        console.error(e);
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };
    if (!authLoading) load();
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
      navigate('/login', { replace: false });
      return;
    }
    
    // Navigate to checkout page instead of direct enrollment
    navigate(`/checkout/${courseId}`);
  };

  const handleMessageTutor = () => {
    // TODO: Navigate to messages
  };

  const handleBookSession = () => {
    // TODO: Navigate to booking flow
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

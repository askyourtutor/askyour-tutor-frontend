import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { ApiCourse } from '../types/course.types';
import { getCourseById, checkEnrollment, enrollInCourse } from '../services/course.service';
import { useAuth } from '../../../shared/contexts/AuthContext';

export function useCourseDetails(courseId: string | undefined) {
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview'|'reviews'|'qna'|'syllabus'|'resources'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        if (!courseId) return;
        const data = await getCourseById(courseId);
        if (data) {
          setCourse(data);
          if (data.lessons && data.lessons.length > 0) setActiveLessonId(data.lessons[0].id);
        }
        // If authenticated student, check enrollment
        if (user && courseId) {
          try {
            const resp = await checkEnrollment(courseId);
            setIsEnrolled(!!resp.enrolled);
          } catch {
            /* ignore */
          }
        } else {
          setIsEnrolled(false);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
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

  const handleSaveToggle = () => {
    setIsSaved((prev) => !prev);
    // TODO: API call to save/unsave course
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any)
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
    setIsEnrolling(true);
    try {
      await enrollInCourse(courseId);
      setIsEnrolled(true);
      // Optionally: switch to syllabus tab after enroll
      setActiveTab('syllabus');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setIsEnrolling(false);
    }
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
    isEnrolling,

    // handlers
    renderStars,
    handleSaveToggle,
    handleShare,
    handleEnroll,
    handleMessageTutor,
    handleBookSession,
  } as const;
}

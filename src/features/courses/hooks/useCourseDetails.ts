import { useEffect, useMemo, useState } from 'react';
import type { ApiCourse } from '../types/course.types';

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

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const base = (import.meta.env.VITE_API_URL as string) || '/api';
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = new URL(`${base.replace(/\/$/, '')}/courses/${courseId}`, origin);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to load course');
        const json = await res.json();
        const data: ApiCourse = json.data;
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) setActiveLessonId(data.lessons[0].id);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) load();
  }, [courseId]);

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
    if (isEnrolled) return;
    setIsEnrolling(true);
    try {
      // TODO: POST /courses/:id/enroll
      await new Promise((r) => setTimeout(r, 800));
      setIsEnrolled(true);
    } catch {
      // TODO: surface error to UI toast
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

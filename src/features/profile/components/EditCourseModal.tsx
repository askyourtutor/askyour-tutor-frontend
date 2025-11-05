import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconPhoto,
  IconUpload,
  IconPlus,
  IconArrowLeft,
  IconArrowRight,
  IconVideo,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconPlayerPlay
} from '@tabler/icons-react';
import {
  updateCourse,
  createLesson,
  deleteLesson,
  getCourseLessons,
  updateLesson as updateLessonAPI,
  type CourseWithStats
} from '../../../shared/services/tutorDashboardService';
import { getSubjects, type Subject } from '../../../shared/services/subjectsService';
import videoUploadService, { type VideoUploadProgress } from '../../../shared/services/videoUploadService';
import { uploadCourseImageForCourse } from '../../../shared/services/imageUploadService';

interface Lesson {
  id?: string;
  title: string;
  description: string;
  duration: number;
  orderIndex: number;
  videoFile: File | null;
  videoPreview: string;
  videoUrl: string | null;         // Bunny CDN URL from database
  bunnyVideoId: string | null;     // Bunny video ID from database
  thumbnailUrl: string | null;     // Thumbnail URL from database
  uploadStatus: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  uploadProgress: number;
  isNew: boolean;                  // Track if lesson is newly created or existing
}

interface CourseFormData {
  title: string;
  description: string;
  subject: string;
  code: string;
  price: string;
  imageFile: File | null;
  imagePreview: string;
  isActive: boolean;
  lessons: Lesson[];
}

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course: CourseWithStats;
}

function EditCourseModal({ isOpen, onClose, onSuccess, course }: EditCourseModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<CourseFormData>({
    title: course.title,
    description: course.description || '',
    subject: course.subject,
    code: course.code || '',
    price: course.price.toString(),
    imageFile: null,
    imagePreview: course.image || '',
    isActive: course.isActive,
    lessons: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);

  const fallbackSubjects = useMemo<Subject[]>(() => [
    { id: '1', name: 'Mathematics', category: 'Science' },
    { id: '2', name: 'Physics', category: 'Science' },
    { id: '3', name: 'Chemistry', category: 'Science' },
    { id: '4', name: 'Biology', category: 'Science' },
    { id: '5', name: 'Computer Science', category: 'Technology' },
    { id: '6', name: 'English Literature', category: 'Languages' },
    { id: '7', name: 'History', category: 'Social Studies' },
    { id: '8', name: 'Geography', category: 'Social Studies' },
    { id: '9', name: 'Economics', category: 'Business' },
    { id: '10', name: 'Psychology', category: 'Social Studies' }
  ], []);

  const loadSubjects = useCallback(async () => {
    try {
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to load subjects, using fallback:', error);
      setSubjects(fallbackSubjects);
    }
  }, [fallbackSubjects]);

  const loadLessons = useCallback(async () => {
    setIsLoadingLessons(true);
    try {
      const lessonsData = await getCourseLessons(course.id);
      const loadedLessons: Lesson[] = lessonsData.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        duration: lesson.duration || 0,
        orderIndex: lesson.orderIndex,
        videoFile: null,
        videoPreview: '',
        videoUrl: lesson.videoUrl || null,
        bunnyVideoId: lesson.bunnyVideoId || null,
        thumbnailUrl: lesson.thumbnailUrl || null,
        uploadStatus: 'pending', // Reset status - not actively uploading when editing
        uploadProgress: 0,
        isNew: false
      }));
      setFormData(prev => ({ ...prev, lessons: loadedLessons }));
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setIsLoadingLessons(false);
    }
  }, [course.id]);

  useEffect(() => {
    if (!isOpen) return;
    
    loadSubjects();
    loadLessons();
    
    // Reset form to course data
    setFormData({
      title: course.title,
      description: course.description || '',
      subject: course.subject,
      code: course.code || '',
      price: course.price.toString(),
      imageFile: null,
      imagePreview: course.image || '',
      isActive: course.isActive,
      lessons: []
    });
    setStep(1);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only run when modal opens/closes

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (parseFloat(formData.price) < 0) newErrors.price = 'Price must be a positive number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    formData.lessons.forEach((lesson, index) => {
      if (!lesson.title.trim()) {
        newErrors[`lesson-${index}-title`] = 'Lesson title is required';
        hasError = true;
      }
    });

    setErrors(newErrors);
    if (hasError) {
      setSubmitError('Please fill in all required lesson fields');
    }
    return !hasError;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setSubmitError('');
      setSubmitSuccess('');
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      title: '',
      description: '',
      duration: 0,
      orderIndex: formData.lessons.length,
      videoFile: null,
      videoPreview: '',
      videoUrl: null,
      bunnyVideoId: null,
      thumbnailUrl: null,
      uploadStatus: 'pending',
      uploadProgress: 0,
      isNew: true
    };
    setFormData(prev => ({ ...prev, lessons: [...prev.lessons, newLesson] }));
  };

  const updateLesson = (lessonId: string, field: keyof Lesson, value: string | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      )
    }));
  };

  const removeLesson = async (lessonId: string) => {
    const lesson = formData.lessons.find(l => l.id === lessonId);
    
    if (lesson?.isNew) {
      setFormData(prev => ({
        ...prev,
        lessons: prev.lessons.filter(l => l.id !== lessonId)
      }));
    } else if (lessonId && !lesson?.isNew) {
      try {
        await deleteLesson(course.id, lessonId);
        setFormData(prev => ({
          ...prev,
          lessons: prev.lessons.filter(l => l.id !== lessonId)
        }));
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        setSubmitError('Failed to delete lesson');
      }
    }
  };

  const moveLessonUp = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const newLessons = [...prev.lessons];
      [newLessons[index - 1], newLessons[index]] = [newLessons[index], newLessons[index - 1]];
      return {
        ...prev,
        lessons: newLessons.map((l, idx) => ({ ...l, orderIndex: idx }))
      };
    });
  };

  const moveLessonDown = (index: number) => {
    if (index === formData.lessons.length - 1) return;
    setFormData(prev => {
      const newLessons = [...prev.lessons];
      [newLessons[index], newLessons[index + 1]] = [newLessons[index + 1], newLessons[index]];
      return {
        ...prev,
        lessons: newLessons.map((l, idx) => ({ ...l, orderIndex: idx }))
      };
    });
  };

  const handleVideoSelect = (lessonId: string, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateLesson(lessonId, 'videoFile', file);
        updateLesson(lessonId, 'videoPreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = (lessonId: string) => {
    updateLesson(lessonId, 'videoFile', null);
    updateLesson(lessonId, 'videoPreview', '');
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Step 1: Upload course image if a new one is provided
      let imageUrl: string | undefined = course.image || undefined;
      if (formData.imageFile) {
        console.log('Uploading course image...');
        const imageUploadResult = await uploadCourseImageForCourse(course.id, formData.imageFile);
        imageUrl = imageUploadResult.url;
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Step 2: Update course details
      await updateCourse(course.id, {
        title: formData.title,
        description: formData.description || undefined,
        subject: formData.subject,
        code: formData.code || undefined,
        price: parseFloat(formData.price),
        image: imageUrl,
        isActive: formData.isActive
      });

      // Step 2: Update/Create lessons (without waiting for video uploads)
      const videoUploads: Array<{ lessonId: string; videoFile: File }> = [];
      
      for (const lesson of formData.lessons) {
        if (lesson.isNew) {
          // Create new lesson
          const createdLesson = await createLesson(course.id, {
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            orderIndex: lesson.orderIndex
          });

          // Queue video upload for background processing
          if (lesson.videoFile) {
            videoUploads.push({ lessonId: createdLesson.id, videoFile: lesson.videoFile });
          }
        } else if (lesson.id) {
          // Update existing lesson
          await updateLessonAPI(course.id, lesson.id, {
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            orderIndex: lesson.orderIndex
          });

          // Only upload video if user explicitly selected a NEW video file
          // lesson.videoFile will only be set when user clicks "Upload Video" or "Replace Video"
          if (lesson.videoFile) {
            videoUploads.push({ lessonId: lesson.id, videoFile: lesson.videoFile });
            console.log(`📹 Queued video ${lesson.videoUrl ? 'replacement' : 'upload'} for lesson: ${lesson.title}`);
          }
        }
      }

      // Show success and close immediately (don't wait for video uploads)
      setSubmitSuccess('Course updated successfully! Videos are uploading in the background.');
      
      // Close modal after brief delay
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

      // Step 3: Upload videos in the background (async, non-blocking)
      if (videoUploads.length > 0) {
        // Start background uploads without blocking
        uploadVideosInBackground(videoUploads);
      }
      
    } catch (error) {
      console.error('Error updating course:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to update course');
      setIsSubmitting(false);
    }
  };

  // Background video upload function (doesn't block UI)
  const uploadVideosInBackground = async (uploads: Array<{ lessonId: string; videoFile: File }>) => {
    for (const { lessonId, videoFile } of uploads) {
      try {
        console.log(`📤 Background upload started for lesson: ${lessonId}`);
        
        await videoUploadService.uploadVideoWithProgress(
          lessonId,
          videoFile,
          (progress: VideoUploadProgress) => {
            console.log(`📊 Upload progress: ${progress.progress}% (${progress.status})`);
          }
        );
        
        console.log(`✅ Video uploaded successfully for lesson: ${lessonId}`);
      } catch (uploadError) {
        console.error(`❌ Background upload failed for lesson ${lessonId}:`, uploadError);
        // Continue with other uploads even if one fails
      }
    }
    
    console.log(`🎉 All background video uploads completed`);
  };

  const handleClose = () => {
    setFormData({
      title: course.title,
      description: course.description || '',
      subject: course.subject,
      code: course.code || '',
      price: course.price.toString(),
      imageFile: null,
      imagePreview: course.image || '',
      isActive: course.isActive,
      lessons: []
    });
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header - Same as CreateCourseModal */}
        <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <IconArrowLeft size={16} />
                    Back
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <IconX size={16} />
                    Close
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-300 ${
                    step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <div className={`w-6 h-px transition-all duration-300 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-300 ${
                    step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                </div>
              </div>

              <div>
                {step < 2 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-all duration-200"
                  >
                    Next
                    <IconArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <IconCheck size={16} />
                        Update Course
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {step === 1 ? 'Edit Course Details' : 'Manage Lessons'}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {step === 1 
                  ? 'Update your course information and settings' 
                  : 'Add, edit, or remove lessons and upload videos'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-6">
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                <IconCheck size={20} />
                <span>{submitSuccess}</span>
              </div>
            )}
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                <IconAlertCircle size={20} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Step 1: Course Details - Copy exact structure from CreateCourseModal */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-900 text-white rounded-full text-xs">1</span>
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Introduction to Calculus"
                      />
                      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                          errors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map(subject => (
                          <option key={subject.id} value={subject.name}>{subject.name}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Code</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                        placeholder="e.g., MATH 101"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.01"
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      rows={4}
                      placeholder="Describe your course content, learning outcomes, and target audience..."
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-gray-900 rounded focus:ring-2 focus:ring-gray-900"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Publish course (make it visible to students)
                    </label>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-900 text-white rounded-full text-xs">2</span>
                    Course Image
                  </h3>
                  
                  <div className="flex flex-col items-center gap-4">
                    {formData.imagePreview ? (
                      <div className="relative w-full max-w-md">
                        <img
                          src={formData.imagePreview}
                          alt="Course preview"
                          className="w-full h-48 md:h-64 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }))}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <IconX size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 md:h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <IconPhoto size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">No image selected</p>
                        </div>
                      </div>
                    )}
                    
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                      <IconPhoto size={20} />
                      <span>{formData.imagePreview ? 'Change Image' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 text-center">Recommended: 1200x600px, JPG or PNG, max 5MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Lessons */}
            {step === 2 && (
              <div className="max-w-5xl mx-auto space-y-5">
                <div className="flex items-center justify-between bg-white rounded-sm p-3 border border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {formData.lessons.length} Lesson{formData.lessons.length !== 1 ? 's' : ''} Added
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Build your curriculum with structured content
                    </p>
                  </div>
                  <button
                    onClick={addLesson}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-all duration-200"
                  >
                    <IconPlus size={14} />
                    Add Lesson
                  </button>
                </div>

                {isLoadingLessons ? (
                  <div className="text-center py-12 bg-white rounded-sm border border-gray-200">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading lessons...</p>
                  </div>
                ) : formData.lessons.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-sm border-2 border-dashed border-gray-200">
                    <IconVideo size={40} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-light text-gray-900 mb-2">No lessons yet</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                      Start building your course by adding your first lesson
                    </p>
                    <button
                      onClick={addLesson}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-sm transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <IconPlus size={18} />
                      Add First Lesson
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Reorder Controls */}
                            <div className="flex flex-col gap-1 pt-1">
                              <button
                                onClick={() => moveLessonUp(index)}
                                disabled={index === 0}
                                className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                                title="Move up"
                              >
                                <IconChevronUp size={16} />
                              </button>
                              <button
                                onClick={() => moveLessonDown(index)}
                                disabled={index === formData.lessons.length - 1}
                                className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                                title="Move down"
                              >
                                <IconChevronDown size={16} />
                              </button>
                            </div>

                            {/* Lesson Content */}
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-xs font-medium rounded-sm">
                                    {index + 1}
                                  </span>
                                  <span className="text-xs font-medium text-gray-500">Lesson {index + 1}</span>
                                </div>
                                <button
                                  onClick={() => removeLesson(lesson.id || '')}
                                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
                                  title="Remove lesson"
                                >
                                  <IconTrash size={16} />
                                </button>
                              </div>

                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(lesson.id || '', 'title', e.target.value)}
                                  className="w-full px-3 py-2.5 text-sm font-medium border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300 transition-all duration-200"
                                  placeholder="Lesson title"
                                />

                                <textarea
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(lesson.id || '', 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300 resize-none transition-all duration-200"
                                  placeholder="Describe what students will learn in this lesson..."
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-900">
                                      Duration (minutes)
                                    </label>
                                    <input
                                      type="number"
                                      value={lesson.duration}
                                      onChange={(e) => updateLesson(lesson.id || '', 'duration', parseInt(e.target.value) || 0)}
                                      min="1"
                                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300 transition-all duration-200"
                                      placeholder="30"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-900">
                                      Video Content
                                    </label>
                                    
                                    {/* Unified Video Box - Same layout for all states */}
                                    <div className="border-2 border-dashed border-gray-200 rounded-sm overflow-hidden bg-white">
                                      {/* Case 1: Existing video from database */}
                                      {(lesson.videoUrl || lesson.bunnyVideoId) && !lesson.videoFile ? (
                                        <div className="space-y-0">
                                          {/* Thumbnail Preview */}
                                          {lesson.thumbnailUrl && (
                                            <div className="relative aspect-video bg-gray-900 cursor-pointer group"
                                              onClick={() => {
                                                // Use videoUrl (secure URL from backend) or bunnyVideoId for iframe
                                                const videoUrlToPlay = lesson.videoUrl || lesson.bunnyVideoId;
                                                setPreviewVideo({ url: videoUrlToPlay!, title: lesson.title });
                                              }}
                                            >
                                              <img 
                                                src={lesson.thumbnailUrl} 
                                                alt={`${lesson.title} thumbnail`}
                                                className="w-full h-full object-cover"
                                              />
                                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                                  <IconPlayerPlay size={24} className="text-gray-900 ml-1" />
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Video Info Bar */}
                                          <div className="flex items-center gap-2 p-3 bg-blue-50 border-t-2 border-blue-200">
                                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-sm">
                                              <IconVideo size={16} className="text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium text-gray-900">Existing Video</p>
                                              <p className="text-xs text-gray-500">Click to preview</p>
                                            </div>
                                            <button
                                              onClick={() => {
                                                // Use videoUrl (secure URL from backend) or bunnyVideoId for iframe
                                                const videoUrlToPlay = lesson.videoUrl || lesson.bunnyVideoId;
                                                setPreviewVideo({ url: videoUrlToPlay!, title: lesson.title });
                                              }}
                                              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-sm transition-all duration-200"
                                              title="Preview video"
                                            >
                                              <IconPlayerPlay size={14} />
                                            </button>
                                            <label className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-sm transition-all duration-200 cursor-pointer"
                                              title="Replace video"
                                            >
                                              <IconUpload size={14} />
                                              <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleVideoSelect(lesson.id || '', e.target.files?.[0] || null)}
                                                className="hidden"
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      ) : lesson.videoFile ? (
                                        /* Case 2: New video file selected */
                                        <div className="space-y-0">
                                          {/* Video File Preview */}
                                          {lesson.videoPreview ? (
                                            <div className="relative aspect-video bg-gray-900 cursor-pointer group"
                                              onClick={() => setPreviewVideo({ url: lesson.videoPreview, title: lesson.title })}
                                            >
                                              <video 
                                                src={lesson.videoPreview}
                                                className="w-full h-full object-contain"
                                                preload="metadata"
                                              />
                                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                                  <IconPlayerPlay size={24} className="text-gray-900 ml-1" />
                                                </div>
                                              </div>
                                              {/* Ready badge overlay */}
                                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-sm">
                                                Ready to Upload
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                              <div className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                                                  <IconVideo size={32} className="text-green-600" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">Video Ready to Upload</p>
                                                <p className="text-xs text-gray-500 mt-1">Will be uploaded when you save</p>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Video File Info Bar */}
                                          <div className="flex items-center gap-2 p-3 bg-green-50 border-t-2 border-green-200">
                                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-sm">
                                              <IconCheck size={16} className="text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium text-gray-900 truncate">{lesson.videoFile.name}</p>
                                              <p className="text-xs text-gray-500">
                                                {(lesson.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                              </p>
                                            </div>
                                            {lesson.videoPreview && (
                                              <button
                                                onClick={() => setPreviewVideo({ url: lesson.videoPreview, title: lesson.title })}
                                                className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-sm transition-all duration-200"
                                                title="Preview video"
                                              >
                                                <IconPlayerPlay size={14} />
                                              </button>
                                            )}
                                            <button
                                              onClick={() => removeVideo(lesson.id || '')}
                                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
                                              title="Remove video"
                                            >
                                              <IconTrash size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* Case 3: No video - Upload area */
                                        <label className="block cursor-pointer group">
                                          {/* Upload Area */}
                                          <div className="aspect-video bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                            <div className="text-center">
                                              <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                                <IconUpload size={32} className="text-gray-400 group-hover:text-gray-500" />
                                              </div>
                                              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Click to Upload Video</p>
                                              <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, MKV, WEBM • Max 500MB</p>
                                            </div>
                                          </div>
                                          
                                          {/* Upload Info Bar */}
                                          <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 border-t-2 border-gray-200 group-hover:bg-gray-100 transition-colors">
                                            <IconVideo size={18} className="text-gray-400 group-hover:text-gray-500" />
                                            <span className="text-xs font-medium text-gray-600 group-hover:text-gray-700">
                                              No video uploaded yet
                                            </span>
                                          </div>
                                          
                                          <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => handleVideoSelect(lesson.id || '', e.target.files?.[0] || null)}
                                            className="hidden"
                                          />
                                        </label>
                                      )}
                                    </div>

                                    {/* Status Messages (outside the box) */}
                                    {lesson.uploadStatus === 'uploading' && (
                                      <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                          <span className="text-gray-600">Uploading...</span>
                                          <span className="text-gray-900 font-medium">{lesson.uploadProgress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-gray-900 transition-all duration-300"
                                            style={{ width: `${lesson.uploadProgress}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {lesson.uploadStatus === 'processing' && (
                                      <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                        <span>Processing video...</span>
                                      </div>
                                    )}

                                    {lesson.uploadStatus === 'completed' && (
                                      <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                                        <IconCheck size={14} />
                                        <span>Upload complete</span>
                                      </div>
                                    )}

                                    {lesson.uploadStatus === 'failed' && (
                                      <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                                        <IconAlertCircle size={14} />
                                        <span>Upload failed. Please try again.</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-lg">{previewVideo.title}</h3>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                >
                  <IconX size={24} />
                </button>
              </div>
            </div>
            
            {/* Video Player */}
            <div className="aspect-video bg-black">
              {(() => {
                // Check if it's a bunnyVideoId (UUID format) - use iframe
                const isBunnyId = previewVideo.url.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
                
                if (isBunnyId) {
                  // Use Bunny.net iframe embed player for video ID
                  const embedUrl = `https://iframe.mediadelivery.net/embed/524556/${previewVideo.url}?autoplay=true&preload=true`;
                  return (
                    <iframe
                      src={embedUrl}
                      loading="lazy"
                      style={{ border: 'none', width: '100%', height: '100%' }}
                      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                      allowFullScreen
                    />
                  );
                }
                
                // Use HTML5 video for secure HLS URLs or direct file URLs
                return (
                  <video
                    src={previewVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditCourseModal;

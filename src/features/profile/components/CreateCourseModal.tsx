import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  IconX,
  IconPlus,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconPhoto,
  IconVideo,
  IconChevronUp,
  IconChevronDown,
  IconFile,
  IconFileText,
  IconUpload
} from '@tabler/icons-react';
import { createCourse, createLesson } from '../../../shared/services/tutorDashboardService';
import { getSubjects, type Subject } from '../../../shared/services/subjectsService';
import videoUploadService, { type VideoUploadProgress } from '../../../shared/services/videoUploadService';
import { uploadCourseImage } from '../../../shared/services/imageUploadService';
import { uploadAndAddResource } from '../../../shared/services/resourceUploadService';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  orderIndex: number;
  videoFile: File | null;
  videoPreview: string;
  uploadStatus: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  uploadProgress: number;
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
  resourceFiles: File[];
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    subject: '',
    code: '',
    price: '0',
    imageFile: null,
    imagePreview: '',
    isActive: false,
    lessons: [],
    resourceFiles: []
  });
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  // Hardcoded fallback subjects
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
      console.error('Failed to load subjects from API, using fallback subjects:', error);
      // Use hardcoded fallback subjects when API fails
      setSubjects(fallbackSubjects);
    }
  }, [fallbackSubjects]);

  // Load subjects when modal opens
  useEffect(() => {
    if (isOpen && subjects.length === 0) {
      loadSubjects();
    }
  }, [isOpen, subjects.length, loadSubjects]);

  const subjectCodeDefaults = useMemo<Record<string, string>>(() => ({
    Mathematics: 'MATH101',
    Physics: 'PHYS101',
    Chemistry: 'CHEM101',
    Biology: 'BIOL101',
    'Computer Science': 'CS101',
    'English Literature': 'ENGL101',
    History: 'HIST101',
    Geography: 'GEOG101',
    Economics: 'ECON101',
    Psychology: 'PSYC101',
    'Abstract Algebra': 'MATH201',
    'Machine Learning': 'ML101',
  }), []);

  const deriveCourseCode = useCallback((subjectName: string) => {
    if (!subjectName) return '';
    const trimmed = subjectName.trim();
    const mapped = subjectCodeDefaults[trimmed];
    if (mapped) return mapped;

    const cleaned = trimmed.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    if (!cleaned) return '';

    const tokens = cleaned.split(/\s+/).slice(0, 2);
    const prefix = tokens
      .map((t) => t.slice(0, 3).toUpperCase())
      .join('')
      .padEnd(4, 'X')
      .slice(0, 4);
    return `${prefix}101`;
  }, [subjectCodeDefaults]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof CourseFormData, value: string | boolean) => {
    if (field === 'code') {
      setCodeManuallyEdited(true);
      setFormData(prev => ({ ...prev, code: value as string }));
    } else if (field === 'subject') {
      setFormData(prev => {
        const nextSubject = value as string;
        const autoCode = (!codeManuallyEdited || !prev.code) ? deriveCourseCode(nextSubject) : prev.code;
        return { ...prev, subject: nextSubject, code: autoCode };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageSelect = (file: File | null) => {
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
      if (errors.imageFile) {
        setErrors(prev => ({ ...prev, imageFile: '' }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }));
  };

  const handleResourceFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        // Allow PDF, DOC, DOCX, TXT, and other common document formats
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
      });

      setFormData(prev => ({
        ...prev,
        resourceFiles: [...prev.resourceFiles, ...newFiles]
      }));
    }
  };

  const removeResourceFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resourceFiles: prev.resourceFiles.filter((_, i) => i !== index)
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (formData.lessons.length === 0) {
      setSubmitError('Please add at least one lesson');
      return false;
    }

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
      // Clear any previous error messages
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
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      duration: 30,
      orderIndex: formData.lessons.length,
      videoFile: null,
      videoPreview: '',
      uploadStatus: 'pending',
      uploadProgress: 0
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

  const removeLesson = (lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(l => l.id !== lessonId).map((l, idx) => ({ ...l, orderIndex: idx }))
    }));
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
    if (!validateStep2()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      // Step 1: Upload course image if provided
      let imageUrl: string | undefined;
      if (formData.imageFile) {
        console.log('Uploading course image...');
        const imageUploadResult = await uploadCourseImage(formData.imageFile);
        imageUrl = imageUploadResult.url;
        console.log('Image uploaded successfully:', imageUrl);
      }

      // Step 2: Create the course
      const courseData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        code: formData.code || undefined,
        price: parseFloat(formData.price),
        image: imageUrl,
        isActive: formData.isActive
      };

      const createdCourse = await createCourse(courseData);

      // Step 2: Create lessons (collect video uploads for background processing)
      const videoUploads: Array<{ lessonId: string; videoFile: File; title: string }> = [];
      
      if (formData.lessons.length > 0) {
        for (const lesson of formData.lessons) {
          const lessonData = {
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            orderIndex: lesson.orderIndex
          };

          const createdLesson = await createLesson(createdCourse.id, lessonData);
          
          // Queue video upload for background processing
          if (lesson.videoFile) {
            videoUploads.push({
              lessonId: createdLesson.id,
              videoFile: lesson.videoFile,
              title: lesson.title
            });
          }
        }
      }

      // Show success and close immediately (don't wait for video uploads)
      setSubmitSuccess('Course created successfully! Videos and resources are uploading in the background.');
      
      // Close modal after brief delay
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

      // Step 3: Upload videos in the background (async, non-blocking)
      if (videoUploads.length > 0) {
        uploadVideosInBackground(videoUploads);
      }

      // Step 4: Upload resources in the background (async, non-blocking)
      if (formData.resourceFiles.length > 0) {
        uploadResourcesInBackground(createdCourse.id, formData.resourceFiles);
      }
      
    } catch (error) {
      console.error('Error creating course:', error);
      setSubmitError(
        error instanceof Error ? error.message : 
        'Failed to create course. Please check your information and try again.'
      );
      setIsSubmitting(false);
    }
  };

  // Background video upload function (doesn't block UI)
  const uploadVideosInBackground = async (uploads: Array<{ lessonId: string; videoFile: File; title: string }>) => {
    for (const { lessonId, videoFile, title } of uploads) {
      try {
        console.log(`📤 Background upload started for lesson: ${title}`);
        
        await videoUploadService.uploadVideoWithProgress(
          lessonId,
          videoFile,
          (progress: VideoUploadProgress) => {
            console.log(`📊 ${title}: ${progress.progress}% (${progress.status})`);
          }
        );
        
        console.log(`✅ Video uploaded successfully for lesson: ${title}`);
      } catch (uploadError) {
        console.error(`❌ Background upload failed for lesson ${title}:`, uploadError);
        // Continue with other uploads even if one fails
      }
    }
    
    console.log(`🎉 All background video uploads completed`);
  };

  // Background resource upload function (doesn't block UI)
  const uploadResourcesInBackground = async (courseId: string, files: File[]) => {
    for (const file of files) {
      try {
        console.log(`📤 Background upload started for resource: ${file.name}`);
        
        await uploadAndAddResource(courseId, file);
        
        console.log(`✅ Resource uploaded successfully: ${file.name}`);
      } catch (uploadError) {
        console.error(`❌ Background upload failed for resource ${file.name}:`, uploadError);
        // Continue with other uploads even if one fails
      }
    }
    
    console.log(`🎉 All background resource uploads completed`);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      code: '',
      price: '0',
      imageFile: null,
      imagePreview: '',
      isActive: false,
      lessons: [],
      resourceFiles: []
    });
    setErrors({});
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left: Back/Close */}
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

              {/* Center: Progress */}
              <div className="flex items-center gap-2">
                {/* Progress Steps */}
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

              {/* Right: Next/Action */}
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
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <IconCheck size={16} />
                        Create
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {(submitError || submitSuccess) && (
          <div className="px-3 md:px-4 py-3 bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto">
              {/* Error Message */}
              {submitError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Success Message */}
              {submitSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{submitSuccess}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="px-3 md:px-4 py-4">
            {step === 1 && (
              <div className="max-w-5xl mx-auto space-y-5">
                {/* Course Image */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900">
                    Course Cover
                  </label>
                  {formData.imagePreview ? (
                    <div className="relative group">
                      <img
                        src={formData.imagePreview}
                        alt="Course preview"
                        className="w-full h-32 md:h-40 object-cover rounded-sm border border-gray-200 shadow-sm"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-gray-600 rounded-sm hover:bg-white hover:text-gray-900 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                        title="Remove image"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 md:h-40 border-2 border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200 group">
                      <div className="text-center">
                        <IconPhoto size={28} className="mx-auto text-gray-300 group-hover:text-gray-400 transition-colors mb-3" />
                        <span className="text-sm font-medium text-gray-600 block mb-1">Upload course cover</span>
                        <span className="text-xs text-gray-400">PNG, JPG or WEBP (max 5MB)</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm border rounded-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.title
                        ? 'border-red-200 focus:ring-red-500/20 focus:border-red-400'
                        : 'border-gray-200 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300'
                    }`}
                    placeholder="e.g., Introduction to Calculus"
                  />
                  {errors.title && (
                    <p className="flex items-center gap-2 text-xs text-red-600">
                      <IconAlertCircle size={14} />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Subject and Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className={`w-full px-3 py-2.5 text-sm border rounded-sm focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${
                        errors.subject
                          ? 'border-red-200 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-gray-200 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <option value="">Select subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.name}>{subject.name}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="flex items-center gap-2 text-xs text-red-600">
                        <IconAlertCircle size={14} />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300 transition-all duration-200"
                      placeholder="e.g., MATH101"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2.5 text-sm border rounded-sm focus:outline-none focus:ring-2 resize-none transition-all duration-200 ${
                      errors.description
                        ? 'border-red-200 focus:ring-red-500/20 focus:border-red-400'
                        : 'border-gray-200 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300'
                    }`}
                    placeholder="Describe what students will learn in this course..."
                  />
                  {errors.description && (
                    <p className="flex items-center gap-2 text-xs text-red-600">
                      <IconAlertCircle size={14} />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Price and Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2.5 text-sm border rounded-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.price
                          ? 'border-red-200 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-gray-200 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="flex items-center gap-2 text-xs text-red-600">
                        <IconAlertCircle size={14} />
                        {errors.price}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">Set to 0 for free courses</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Course Resources
                    </label>
                    
                    {/* Resource Files Upload */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-700">
                          Upload Resource Files (PDF, Documents)
                        </label>
                        <label className="flex items-center justify-center gap-2 h-12 border-2 border-dashed border-gray-200 rounded-sm cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200 group">
                          <IconUpload size={16} className="text-gray-400 group-hover:text-gray-500" />
                          <span className="text-xs font-medium text-gray-600 group-hover:text-gray-700">
                            Upload Files
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                            multiple
                            onChange={(e) => handleResourceFileSelect(e.target.files)}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500">Max 10MB per file. Supported: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX</p>
                      </div>

                      {/* Uploaded Files List */}
                      {formData.resourceFiles.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-700">
                            Uploaded Files ({formData.resourceFiles.length})
                          </label>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {formData.resourceFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-sm">
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-sm">
                                  {file.type === 'application/pdf' ? (
                                    <IconFileText size={12} className="text-blue-600" />
                                  ) : (
                                    <IconFile size={12} className="text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeResourceFile(index)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
                                  title="Remove file"
                                >
                                  <IconTrash size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Publish Status */}
                <div className="bg-gray-50 rounded-sm p-4 border border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900/20 focus:ring-2"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        Publish immediately
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Students will be able to enroll in this course right away. You can change this later.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}            {step === 2 && (
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

                {formData.lessons.length === 0 ? (
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
                                  onClick={() => removeLesson(lesson.id)}
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
                                  onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                                  className="w-full px-3 py-2.5 text-sm font-medium border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300 transition-all duration-200"
                                  placeholder="Lesson title"
                                />

                                <textarea
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
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
                                      onChange={(e) => updateLesson(lesson.id, 'duration', parseInt(e.target.value) || 0)}
                                      min="1"
                                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 hover:border-gray-300 transition-all duration-200"
                                      placeholder="30"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="block text-xs font-medium text-gray-900">
                                      Video Content
                                    </label>
                                    
                                    {/* Unified Video Box - Same layout as EditCourseModal */}
                                    <div className="border-2 border-dashed border-gray-200 rounded-sm overflow-hidden bg-white">
                                      {lesson.videoFile ? (
                                        /* Video file selected */
                                        <div className="space-y-0">
                                          {/* Video File Preview */}
                                          {lesson.videoPreview ? (
                                            <div className="relative aspect-video bg-gray-900">
                                              <video 
                                                src={lesson.videoPreview}
                                                className="w-full h-full object-contain"
                                                preload="metadata"
                                              />
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
                                            <button
                                              onClick={() => removeVideo(lesson.id)}
                                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all duration-200"
                                              title="Remove video"
                                            >
                                              <IconTrash size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* No video - Upload area */
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
                                            onChange={(e) => handleVideoSelect(lesson.id, e.target.files?.[0] || null)}
                                            className="hidden"
                                          />
                                        </label>
                                      )}
                                    </div>
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

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-3 md:px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Step {step} of 2</span>
                {step === 1 && (
                  <>
                    <span>•</span>
                    <span>Fill in course details to continue</span>
                  </>
                )}
                {step === 2 && (
                  <>
                    <span>•</span>
                    <span>{formData.lessons.length} lesson{formData.lessons.length !== 1 ? 's' : ''} added</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;

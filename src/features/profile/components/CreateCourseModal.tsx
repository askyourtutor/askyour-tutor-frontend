import { useState } from 'react';
import {
  IconX,
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconUpload,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  orderIndex: number;
  videoFile?: File | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  uploadStatus?: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  uploadProgress?: number;
}

interface CourseFormData {
  title: string;
  description: string;
  subject: string;
  code: string;
  universityId: string;
  price: string;
  image: string;
  isActive: boolean;
  lessons: Lesson[];
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    subject: '',
    code: '',
    universityId: '',
    price: '0',
    image: '',
    isActive: false,
    lessons: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Engineering',
    'Economics',
    'Statistics',
    'English',
    'History'
  ];

  if (!isOpen) return null;

  const handleInputChange = (field: keyof CourseFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: '',
      description: '',
      content: '',
      duration: 30,
      orderIndex: formData.lessons.length,
      videoFile: null,
      uploadStatus: 'pending'
    };
    setFormData(prev => ({ ...prev, lessons: [...prev.lessons, newLesson] }));
  };

  const updateLesson = (lessonId: string, field: keyof Lesson, value: string | number | File) => {
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
      updateLesson(lessonId, 'videoFile', file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create course with lessons
      // 1. Create course
      // 2. For each lesson with video, upload to Bunny.net
      // 3. Create lessons with video IDs
      console.log('Submitting course:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      code: '',
      universityId: '',
      price: '0',
      image: '',
      isActive: false,
      lessons: []
    });
    setErrors({});
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create New Course</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {step} of 2: {step === 1 ? 'Course Details' : 'Add Lessons'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
            disabled={isSubmitting}
          >
            <IconX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 1 ? (
            /* Step 1: Course Details */
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:ring-1 ${
                    errors.title
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Introduction to Calculus"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <IconAlertCircle size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:ring-1 ${
                    errors.subject
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <IconAlertCircle size={12} />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="MATH101"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:ring-1 resize-none ${
                    errors.description
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Describe what students will learn in this course..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <IconAlertCircle size={12} />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:ring-1 ${
                    errors.price
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <IconAlertCircle size={12} />
                    {errors.price}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Set to 0 for free courses</p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/course-image.jpg"
                />
              </div>

              {/* Publish Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Publish course immediately
                </label>
              </div>
            </div>
          ) : (
            /* Step 2: Lessons */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Course Lessons</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formData.lessons.length} lesson{formData.lessons.length !== 1 ? 's' : ''} added
                  </p>
                </div>
                <button
                  onClick={addLesson}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors"
                >
                  <IconPlus size={14} />
                  Add Lesson
                </button>
              </div>

              {formData.lessons.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-sm">
                  <p className="text-sm text-gray-500 mb-3">No lessons added yet</p>
                  <button
                    onClick={addLesson}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors"
                  >
                    <IconPlus size={16} />
                    Add Your First Lesson
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-gray-200 rounded-sm p-3">
                      <div className="flex items-start gap-2 mb-3">
                        <div className="flex flex-col gap-1 mt-2">
                          <button
                            onClick={() => moveLessonUp(index)}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <IconGripVertical size={14} />
                          </button>
                          <button
                            onClick={() => moveLessonDown(index)}
                            disabled={index === formData.lessons.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <IconGripVertical size={14} />
                          </button>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              Lesson {index + 1}
                            </span>
                            <button
                              onClick={() => removeLesson(lesson.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Remove lesson"
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Lesson title"
                          />

                          <textarea
                            value={lesson.description}
                            onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder="Lesson description"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                value={lesson.duration}
                                onChange={(e) => updateLesson(lesson.id, 'duration', parseInt(e.target.value) || 0)}
                                min="1"
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Video (optional)
                              </label>
                              <label className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 hover:bg-blue-50 rounded-sm cursor-pointer transition-colors">
                                <IconUpload size={14} />
                                {lesson.videoFile ? 'Change' : 'Upload'}
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoSelect(lesson.id, e.target.files?.[0] || null)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {lesson.videoFile && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-sm">
                              <IconCheck size={12} className="text-green-600" />
                              <span className="truncate">{lesson.videoFile.name}</span>
                              <span className="text-gray-400">
                                ({(lesson.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div>
            {step === 2 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors"
              >
                Next: Add Lessons
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Course...' : 'Create Course'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourseModal;

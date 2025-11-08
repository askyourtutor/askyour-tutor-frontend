import React, { useState, useEffect } from 'react';
import { 
  IconX, 
  IconAlertCircle, 
  IconBook, 
  IconEdit, 
  IconCalendar, 
  IconClock, 
  IconMessageCircle,
  IconCheck,
  IconLoader,
  IconUser
} from '@tabler/icons-react';
import { createSession, getTutorAvailability, type CreateSessionRequest } from '../services/session.service';
import { toast } from '../../../shared/utils/toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorId: string;
  tutorName: string;
  courseId?: string;
  courseTitle?: string;
  defaultSubject?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  tutorId,
  tutorName,
  courseId,
  courseTitle,
  defaultSubject,
}) => {
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [subject, setSubject] = useState(defaultSubject || '');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Fetch tutor availability when date changes
  useEffect(() => {
    if (scheduledDate) {
      getTutorAvailability(tutorId, scheduledDate)
        .then(() => {
          // TODO: Show booked slots to user
        })
        .catch(() => {
          // Ignore errors
        });
    }
  }, [tutorId, scheduledDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !scheduledDate || !scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Combine date and time
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    
    // Check if in the past
    if (scheduledAt <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    setStep('loading');

    try {
      const sessionData: CreateSessionRequest = {
        tutorId,
        courseId,
        subject,
        topic: topic || undefined,
        duration,
        scheduledAt: scheduledAt.toISOString(),
        specialRequirements: specialRequirements || undefined,
      };

      await createSession(sessionData);
      setStep('success');
      toast.success('Session booking request sent successfully!');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        // Reset form
        setStep('form');
        setSubject(defaultSubject || '');
        setTopic('');
        setDuration(60);
        setScheduledDate('');
        setScheduledTime('');
        setSpecialRequirements('');
      }, 2000);
    } catch (error) {
      setStep('form');
      toast.error(error instanceof Error ? error.message : 'Failed to book session');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] rounded-sm shadow-2xl overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Book a Session
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Schedule your learning session</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm p-2 transition-colors"
              aria-label="Close"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Tutor Info */}
          <div className="bg-gray-50 rounded-sm p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
                <IconUser size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{tutorName}</p>
                {courseTitle && (
                  <p className="text-sm text-gray-600">{courseTitle}</p>
                )}
              </div>
            </div>
          </div>

          {step === 'loading' && (
            <div className="text-center py-12">
              <IconLoader size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Sending your request...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-sm flex items-center justify-center mx-auto mb-4">
                <IconCheck size={28} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600">Your tutor will review and confirm your session.</p>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Subject and Topic Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IconBook size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Mathematics, Physics"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <IconEdit size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Calculus, Quadratic Equations"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Date, Time, and Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IconCalendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={getMinDate()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IconClock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
              </div>

              {/* Duration Buttons (Alternative for larger screens) */}
              <div className="hidden lg:block">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Duration Options
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[30, 60, 90, 120].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setDuration(min)}
                      className={`py-3 px-2 text-sm font-medium rounded-sm border transition-all ${
                        duration === min
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <IconMessageCircle size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="Any specific topics, materials, or requirements?"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                <div className="flex gap-3">
                  <IconAlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Pending Approval</h4>
                    <p className="text-sm text-blue-700 mt-1">Your tutor will review and confirm this session request.</p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'form' && (
          <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                Send Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

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
  IconLoader
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Responsive container - full screen on mobile, centered on desktop */}
      <div className="h-full w-full md:flex md:items-center md:justify-center md:p-4">
        <div 
          className="relative bg-white w-full h-full md:h-auto md:max-w-2xl md:max-h-[95vh] md:rounded-sm shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <IconCalendar size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Book Session
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm p-1.5 transition-colors"
              aria-label="Close"
            >
              <IconX size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Tutor Info - Compact */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-3">
                <p className="text-xs text-gray-600 mb-0.5">Session with</p>
                <p className="text-sm font-bold text-gray-900">{tutorName}</p>
                {courseTitle && (
                  <p className="text-xs text-blue-600 mt-1 truncate">{courseTitle}</p>
                )}
              </div>

              {step === 'loading' && (
                <div className="text-center py-12">
                  <IconLoader size={40} className="animate-spin text-blue-500 mx-auto" />
                  <p className="mt-3 text-sm text-gray-600">Sending request...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-green-100 rounded-sm flex items-center justify-center mx-auto mb-3">
                    <IconCheck size={28} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Request Sent!</h3>
                  <p className="text-sm text-gray-600">Tutor will review and confirm.</p>
                </div>
              )}

              {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Subject */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <IconBook size={16} className="text-gray-500" />
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Mathematics, Physics"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <IconEdit size={16} className="text-gray-500" />
                      Topic <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Calculus, Quadratic Equations"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Date and Time - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                        <IconCalendar size={16} className="text-gray-500" />
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={getMinDate()}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                        <IconClock size={16} className="text-gray-500" />
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Duration - Responsive Buttons */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <IconClock size={16} className="text-gray-500" />
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[30, 60, 90, 120].map((min) => (
                        <button
                          key={min}
                          type="button"
                          onClick={() => setDuration(min)}
                          className={`py-2 px-3 text-sm font-medium rounded-sm border-2 transition-all ${
                            duration === min
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {min}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <IconMessageCircle size={16} className="text-gray-500" />
                      Notes <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      placeholder="Any specific topics or materials?"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Info Alert - Compact */}
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-2.5 flex gap-2">
                    <IconAlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-semibold">Pending Approval</p>
                      <p className="mt-0.5">Tutor will review your request.</p>
                    </div>
                  </div>

                  {/* Summary - Compact */}
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Summary</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tutor:</span>
                        <span className="font-medium text-gray-900">{tutorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subject:</span>
                        <span className="font-medium text-gray-900">{subject || '-'}</span>
                      </div>
                      {scheduledDate && scheduledTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">When:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{duration} min</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-gray-300">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-green-600">FREE</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Responsive */}
                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:flex-1 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Request Session
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

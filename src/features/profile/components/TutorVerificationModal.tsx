import { 
  IconX, 
  IconFileText,
  IconCalendar,
  IconAlertTriangle
} from '@tabler/icons-react';
import { useState } from 'react';

interface TutorProfile {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  professionalTitle?: string;
  university?: string;
  department?: string;
  degree?: string;
  specialization?: string;
  qualifications?: string;
  credentialsDocument?: string;
  teachingExperience?: number;
  subjects?: string;
  courseCodes?: string;
  hourlyRate?: number;
  availability?: string;
  bio?: string;
  languages?: string;
  sessionTypes?: string;
  timezone?: string;
  profilePicture?: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  verificationNotes?: string;
  verifiedAt?: string;
}

interface Tutor {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  tutorProfile: TutorProfile;
}

interface TutorVerificationModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (tutorId: string, notes?: string) => Promise<void>;
  onReject: (tutorId: string, notes: string) => Promise<void>;
}

function TutorVerificationModal({ 
  tutor, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: TutorVerificationModalProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  if (!isOpen || !tutor) return null;

  const profile = tutor.tutorProfile;

  // Parse JSON fields safely
  const parseJsonField = (field: string | undefined): string[] => {
    if (!field) return [];
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const subjects = parseJsonField(profile.subjects);
  const qualifications = parseJsonField(profile.qualifications);
  const languages = parseJsonField(profile.languages);
  const sessionTypes = parseJsonField(profile.sessionTypes);
  const courseCodes = parseJsonField(profile.courseCodes);

  const handleApprove = async () => {
    await onApprove(tutor.id, 'Approved after verification review');
    onClose();
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (rejectReason.trim()) {
      await onReject(tutor.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] flex flex-col rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-4">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <span className="text-lg font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-600">{profile.professionalTitle || 'Tutor Application'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <IconX size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-5">
            
            {/* Status Banner */}
            <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
              profile.verificationStatus === 'PENDING' ? 'bg-yellow-50 border-yellow-200' :
              profile.verificationStatus === 'APPROVED' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  profile.verificationStatus === 'PENDING' ? 'bg-yellow-100' :
                  profile.verificationStatus === 'APPROVED' ? 'bg-green-100' :
                  'bg-red-100'
                }`}>
                  <IconAlertTriangle size={20} className={
                    profile.verificationStatus === 'PENDING' ? 'text-yellow-600' :
                    profile.verificationStatus === 'APPROVED' ? 'text-green-600' :
                    'text-red-600'
                  } />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Status: {profile.verificationStatus}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Applied on {new Date(tutor.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              {profile.verifiedAt && (
                <div className="text-right">
                  <p className="text-xs text-gray-600">Last updated</p>
                  <p className="text-xs font-medium text-gray-900">
                    {new Date(profile.verifiedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Contact Information Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <IconFileText size={16} className="text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Contact Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-500 pt-1">Email</div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-900 break-words">{tutor.email}</p>
                        {profile.email && profile.email !== tutor.email && (
                          <p className="text-xs text-gray-600 mt-1 break-words">Alternate: {profile.email}</p>
                        )}
                      </div>
                    </div>

                    {profile.phone && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Phone</div>
                        <div className="col-span-2 text-sm text-gray-900">{profile.phone}</div>
                      </div>
                    )}

                    {profile.timezone && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Timezone</div>
                        <div className="col-span-2 text-sm text-gray-900">{profile.timezone}</div>
                      </div>
                    )}

                    {languages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Languages</div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1.5">
                            {languages.map((lang, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm border border-gray-200">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Background Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <IconFileText size={16} className="text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Academic Background</h4>
                  </div>
                  <div className="space-y-3">
                    {profile.university && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">University</div>
                        <div className="col-span-2 text-sm text-gray-900">{profile.university}</div>
                      </div>
                    )}

                    {profile.department && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Department</div>
                        <div className="col-span-2 text-sm text-gray-900">{profile.department}</div>
                      </div>
                    )}

                    {profile.degree && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Degree</div>
                        <div className="col-span-2 text-sm text-gray-900">{profile.degree}</div>
                      </div>
                    )}

                    {profile.specialization && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Specialization</div>
                        <div className="col-span-2 text-sm text-gray-900">{profile.specialization}</div>
                      </div>
                    )}

                    {qualifications.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Qualifications</div>
                        <div className="col-span-2">
                          <ul className="space-y-1.5">
                            {qualifications.map((qual, idx) => (
                              <li key={idx} className="text-sm text-gray-900 flex items-start">
                                <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                                <span className="break-words">{qual}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Biography Card */}
                {profile.bio && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IconFileText size={16} className="text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">Biography</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Teaching Information Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <IconCalendar size={16} className="text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Teaching Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-500 pt-1">Experience</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-900">
                        {profile.teachingExperience || 0} years
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-500 pt-1">Hourly Rate</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-900">
                        ${profile.hourlyRate || 0}/hr
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-xs font-medium text-gray-500 pt-1">Status</div>
                      <div className="col-span-2 text-sm text-gray-900">{tutor.status}</div>
                    </div>

                    {subjects.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Subjects</div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1.5">
                            {subjects.map((subject, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-gray-900 text-white text-xs rounded-sm">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {courseCodes.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Course Codes</div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1.5">
                            {courseCodes.map((code, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm border border-gray-200 font-mono">
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {sessionTypes.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Session Types</div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1.5">
                            {sessionTypes.map((type, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm border border-gray-200">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.availability && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-xs font-medium text-gray-500 pt-1">Availability</div>
                        <div className="col-span-2 text-sm text-gray-700">
                          {(() => {
                            try {
                              const availability = JSON.parse(profile.availability);
                              const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                              const dayLabels: Record<string, string> = {
                                monday: 'Monday',
                                tuesday: 'Tuesday',
                                wednesday: 'Wednesday',
                                thursday: 'Thursday',
                                friday: 'Friday',
                                saturday: 'Saturday',
                                sunday: 'Sunday'
                              };
                              
                              return (
                                <div className="space-y-1.5">
                                  {days.map(day => {
                                    const slots = availability[day];
                                    if (!slots || slots.length === 0) return null;
                                    return (
                                      <div key={day} className="flex items-start gap-2">
                                        <span className="font-medium text-gray-900 min-w-[80px]">{dayLabels[day]}:</span>
                                        <span className="text-gray-700">{slots.join(', ')}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            } catch {
                              return <span className="text-gray-500 italic">Invalid format</span>;
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Credentials Document Card */}
                {profile.credentialsDocument && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IconFileText size={16} className="text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">Credentials Document</h4>
                    </div>
                    <a 
                      href={profile.credentialsDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all group shadow-sm"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <IconFileText size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          View Credentials Document
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">Click to open PDF in new tab</p>
                      </div>
                      <IconX size={16} className="text-gray-400 rotate-45 group-hover:rotate-90 transition-transform" />
                    </a>
                  </div>
                )}

                {/* Verification Notes Card */}
                {profile.verificationNotes && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IconAlertTriangle size={16} className="text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">Admin Notes</h4>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-gray-800 break-words leading-relaxed">{profile.verificationNotes}</p>
                    </div>
                  </div>
                )}

                {/* Verification History Card */}
                {profile.verifiedAt && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IconCalendar size={16} className="text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900">Verification History</h4>
                    </div>
                    <div className="flex items-start gap-3">
                      <IconCalendar size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 font-medium">
                          {profile.verificationStatus === 'APPROVED' ? 'Approved' : 'Rejected'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(profile.verifiedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        {profile.verificationStatus === 'PENDING' && (
          <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">Review complete? Take action on this application.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleRejectClick}
                  className="px-6 py-2.5 bg-white border-2 border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-50 hover:border-red-300 transition-all shadow-sm hover:shadow-md"
                >
                  ✕ Reject Application
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
                >
                  ✓ Approve Tutor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shadow-sm">
                  <IconAlertTriangle size={22} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Reject Application</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Provide a clear reason for rejection</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <IconX size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a clear and professional reason for rejecting this application..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-600 mt-3 flex items-start gap-2">
                <IconAlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <span>This reason will be sent to the tutor via email. Please be professional and constructive.</span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorVerificationModal;

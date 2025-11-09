import { useState, useEffect } from 'react';
import { 
  IconCalendar, 
  IconSearch, 
  IconClock, 
  IconUser, 
  IconVideo, 
  IconLoader, 
  IconBook,
  IconChevronDown,
  IconChevronRight,
  IconCurrencyDollar,
  IconMapPin,
  IconNote,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { getSessions, type Session } from '../../sessions/services/session.service';
import { joinVideoSession } from '../../sessions/services/videoSession.service';

// Helper to get user display name
const getUserDisplayName = (user: { firstName?: string; lastName?: string; email?: string } | undefined): string => {
  if (!user) return 'Unknown User';
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.email || 'Unknown User';
};

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function StudentSessionsTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (sessionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedRows(newExpanded);
  };

  // Helper to extract price from notes
  const getSessionPrice = (session: Session): number => {
    if (session.notes) {
      const amountMatch = session.notes.match(/Amount:\s*\$([0-9.]+)/);
      if (amountMatch && amountMatch[1]) {
        return parseFloat(amountMatch[1]);
      }
    }
    // Fallback: calculate from tutor hourly rate if available
    if (session.tutor?.tutorProfile?.hourlyRate && session.duration) {
      return (session.tutor.tutorProfile.hourlyRate * session.duration) / 60;
    }
    return 0;
  };

  const isPaidSession = (session: Session): boolean => {
    return session.notes?.includes('Paid via Stripe') || false;
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getSessions();
      // Handle both array and object responses
      const data = Array.isArray(response) ? response : response.sessions || [];
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleJoinSession = async (sessionId: string) => {
    try {
      setJoiningId(sessionId);
      const videoRoom = await joinVideoSession(sessionId);
      // Open the video room in a new window
      window.open(videoRoom.roomUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join video room. The tutor may not have started the session yet.');
    } finally {
      setJoiningId(null);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      getUserDisplayName(session.tutor?.tutorProfile || undefined).toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader className="animate-spin text-gray-600" size={32} />
      </div>
    );
  }

  const totalSessions = sessions.length;
  const pendingSessions = sessions.filter(s => s.status === 'PENDING').length;
  const confirmedSessions = sessions.filter(s => s.status === 'CONFIRMED').length;
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Booked Sessions</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">View and manage your learning sessions</p>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">TOTAL</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{totalSessions}</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-sm">
              <IconCalendar size={14} className="sm:w-4 sm:h-4 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">PENDING</p>
              <p className="text-lg sm:text-xl font-bold text-yellow-600 mt-0.5">{pendingSessions}</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-sm">
              <IconClock size={14} className="sm:w-4 sm:h-4 text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">CONFIRMED</p>
              <p className="text-lg sm:text-xl font-bold text-green-600 mt-0.5">{confirmedSessions}</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-sm">
              <IconVideo size={14} className="sm:w-4 sm:h-4 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">COMPLETED</p>
              <p className="text-lg sm:text-xl font-bold text-blue-600 mt-0.5">{completedSessions}</p>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-sm">
              <IconBook size={14} className="sm:w-4 sm:h-4 text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">My Sessions</h2>
            <p className="text-xs text-gray-500 mt-0.5">{filteredSessions.length} of {sessions.length} sessions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-sm border border-gray-200 p-8 text-center">
          <IconCalendar size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Sessions Yet</h3>
          <p className="text-sm text-gray-600">Book a session with a tutor to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide w-8"></th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Subject</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Tutor</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Date & Time</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Duration</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-3 py-2 text-left text-[9px] font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => {
                  const isExpanded = expandedRows.has(session.id);
                  const sessionPrice = getSessionPrice(session);
                  const isPaid = isPaidSession(session);

                  return (
                    <>
                      {/* Main Row */}
                      <tr 
                        key={session.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(session.id)}
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(session.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {isExpanded ? (
                              <IconChevronDown size={16} />
                            ) : (
                              <IconChevronRight size={16} />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center text-white flex-shrink-0">
                              <span className="text-[10px] font-semibold">
                                {session.subject?.split(' ').map(word => word[0]).join('').slice(0, 2) || 'SE'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {session.subject || 'General Session'}
                              </div>
                              {isPaid && (
                                <span className="inline-flex items-center gap-1 text-[9px] text-green-600">
                                  <IconCheck size={10} />
                                  Paid
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-xs text-gray-900">
                            {getUserDisplayName(session.tutor?.tutorProfile || undefined)}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-xs text-gray-900">
                            {formatDate(session.scheduledAt)}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-xs text-gray-900">
                            <IconClock size={12} className="text-gray-400" />
                            {session.duration} min
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded ${
                            session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            session.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {session.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {session.status === 'CONFIRMED' && session.meetingLink && (
                              <button
                                onClick={() => handleJoinSession(session.id)}
                                disabled={joiningId === session.id}
                                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-[10px] font-semibold rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {joiningId === session.id ? (
                                  <IconLoader size={12} className="animate-spin" />
                                ) : (
                                  <IconVideo size={12} />
                                )}
                                Join
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr key={`${session.id}-details`} className="bg-gray-50">
                          <td colSpan={7} className="px-3 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {/* Left Column */}
                              <div className="space-y-3">
                                {/* Session Details */}
                                <div className="bg-white rounded border border-gray-200 p-3">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <IconBook size={14} className="text-blue-600" />
                                    Session Details
                                  </h4>
                                  <div className="space-y-2">
                                    {session.topic && (
                                      <div>
                                        <span className="text-gray-500">Topic:</span>
                                        <span className="ml-2 text-gray-900 font-medium">{session.topic}</span>
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-gray-500">Type:</span>
                                      <span className="ml-2 text-gray-900 font-medium">
                                        {session.sessionType === 'ONE_ON_ONE' ? 'One-on-One' : 
                                         session.sessionType === 'ENROLLMENT' ? 'Course Enrollment' : 
                                         session.sessionType}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Scheduled:</span>
                                      <span className="ml-2 text-gray-900 font-medium">{formatDate(session.scheduledAt)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Duration:</span>
                                      <span className="ml-2 text-gray-900 font-medium">{session.duration} minutes</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Details */}
                                {isPaid && sessionPrice > 0 && (
                                  <div className="bg-white rounded border border-green-200 p-3">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                      <IconCurrencyDollar size={14} className="text-green-600" />
                                      Payment Details
                                    </h4>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-gray-500">Amount Paid:</span>
                                        <span className="ml-2 text-green-600 font-bold text-sm">
                                          ${sessionPrice.toFixed(2)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Payment Status:</span>
                                        <span className="ml-2">
                                          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                            <IconCheck size={12} />
                                            Paid via Stripe
                                          </span>
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Payment Method:</span>
                                        <span className="ml-2 text-gray-900 font-medium">Card</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right Column */}
                              <div className="space-y-3">
                                {/* Tutor Details */}
                                <div className="bg-white rounded border border-gray-200 p-3">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <IconUser size={14} className="text-purple-600" />
                                    Tutor Information
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-gray-500">Name:</span>
                                      <span className="ml-2 text-gray-900 font-medium">
                                        {getUserDisplayName(session.tutor?.tutorProfile || undefined)}
                                      </span>
                                    </div>
                                    {session.tutor?.email && (
                                      <div>
                                        <span className="text-gray-500">Email:</span>
                                        <span className="ml-2 text-blue-600">{session.tutor.email}</span>
                                      </div>
                                    )}
                                    {session.tutor?.tutorProfile?.hourlyRate && (
                                      <div>
                                        <span className="text-gray-500">Hourly Rate:</span>
                                        <span className="ml-2 text-gray-900 font-medium">
                                          ${session.tutor.tutorProfile.hourlyRate}/hr
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Meeting Link */}
                                {session.meetingLink && (
                                  <div className="bg-white rounded border border-gray-200 p-3">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                      <IconMapPin size={14} className="text-red-600" />
                                      Meeting Link
                                    </h4>
                                    <div className="text-xs text-gray-600 break-all bg-gray-50 p-2 rounded">
                                      {session.meetingLink}
                                    </div>
                                    {session.status === 'CONFIRMED' && (
                                      <button
                                        onClick={() => handleJoinSession(session.id)}
                                        disabled={joiningId === session.id}
                                        className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                      >
                                        {joiningId === session.id ? (
                                          <>
                                            <IconLoader size={14} className="animate-spin" />
                                            Joining...
                                          </>
                                        ) : (
                                          <>
                                            <IconVideo size={14} />
                                            Join Video Session
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Special Requirements / Notes */}
                                {(session.specialRequirements || session.notes) && (
                                  <div className="bg-white rounded border border-gray-200 p-3">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                      <IconNote size={14} className="text-orange-600" />
                                      Additional Information
                                    </h4>
                                    <div className="space-y-2">
                                      {session.specialRequirements && (
                                        <div>
                                          <span className="text-gray-500">Special Requirements:</span>
                                          <p className="mt-1 text-gray-900 text-xs">{session.specialRequirements}</p>
                                        </div>
                                      )}
                                      {session.cancellationReason && (
                                        <div>
                                          <span className="text-red-500 flex items-center gap-1">
                                            <IconX size={12} />
                                            Cancellation Reason:
                                          </span>
                                          <p className="mt-1 text-gray-900 text-xs">{session.cancellationReason}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentSessionsTab;

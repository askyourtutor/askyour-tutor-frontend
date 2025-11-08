import { IconCalendar, IconSearch, IconClock, IconCheck, IconChartBar, IconLoader, IconX, IconVideo } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getSessions, updateSessionStatus, type Session } from '../../sessions/services/session.service';
import { createVideoRoom } from '../../sessions/services/videoSession.service';

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

function AdminSessionsTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleStatusUpdate = async (sessionId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      setUpdatingId(sessionId);
      setErrorMessage(null); // Clear any previous errors
      await updateSessionStatus(sessionId, status);
      await fetchSessions();
    } catch (error) {
      console.error('Failed to update session:', error);
      // Show error message inline
      const errorMsg = error instanceof Error ? error.message : 'Failed to update session status';
      setErrorMessage(errorMsg);
      // Auto-clear error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStartSession = async (sessionId: string) => {
    try {
      setUpdatingId(sessionId);
      setErrorMessage(null); // Clear any previous errors
      const videoRoom = await createVideoRoom(sessionId);
      // Open the video room in a new window
      window.open(videoRoom.roomUrl, '_blank', 'noopener,noreferrer');
      await fetchSessions(); // Refresh to show the meeting link
    } catch (error) {
      console.error('Failed to start session:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create video room. Please try again.';
      setErrorMessage(errorMsg);
      // Auto-clear error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      getUserDisplayName(session.student?.studentProfile || undefined).toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Teaching Sessions</h2>
        <p className="text-sm text-gray-600 mt-1">Manage sessions for courses you teach</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm flex items-start gap-2">
          <IconX size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="flex-shrink-0 text-red-500 hover:text-red-700"
          >
            <IconX size={18} />
          </button>
        </div>
      )}

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL SESSIONS</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{totalSessions}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconCalendar size={16} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">PENDING</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{pendingSessions}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconClock size={16} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">CONFIRMED</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{confirmedSessions}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconCheck size={16} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">COMPLETED</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{completedSessions}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconChartBar size={16} className="text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Session Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filteredSessions.length} of {sessions.length} sessions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED')}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Session Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tutor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-semibold">
                          {session.subject?.split(' ').map(word => word[0]).join('').slice(0, 2) || 'SE'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {session.subject || 'General Session'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {session.topic || 'No topic specified'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-700">
                          {session.student?.studentProfile 
                            ? `${session.student.studentProfile.firstName?.[0] || ''}${session.student.studentProfile.lastName?.[0] || ''}`
                            : session.student?.email?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName(session.student?.studentProfile || undefined)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{session.student?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-700">
                          {session.tutor?.tutorProfile 
                            ? `${session.tutor.tutorProfile.firstName?.[0] || ''}${session.tutor.tutorProfile.lastName?.[0] || ''}`
                            : session.tutor?.email?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {getUserDisplayName(session.tutor?.tutorProfile || undefined)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{session.tutor?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(session.scheduledAt)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{session.duration} min</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${
                      session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      session.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      session.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {session.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(session.id, 'CONFIRMED')}
                            disabled={updatingId === session.id}
                            className="px-3 py-1 bg-gray-900 text-white text-xs rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            {updatingId === session.id ? (
                              <IconLoader size={12} className="animate-spin" />
                            ) : (
                              <IconCheck size={12} />
                            )}
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(session.id, 'CANCELLED')}
                            disabled={updatingId === session.id}
                            className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-sm hover:bg-red-200 border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <IconX size={12} />
                            Reject
                          </button>
                        </>
                      )}
                      {session.status === 'CONFIRMED' && (
                        <>
                          {session.meetingLink ? (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <IconVideo size={12} />
                              Join Class
                            </a>
                          ) : (
                            <button 
                              onClick={() => handleStartSession(session.id)}
                              disabled={updatingId === session.id}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {updatingId === session.id ? (
                                <IconLoader size={12} className="animate-spin" />
                              ) : (
                                <IconVideo size={12} />
                              )}
                              Start Class
                            </button>
                          )}
                          {/* Only allow completing past sessions */}
                          {new Date(session.scheduledAt) <= new Date() ? (
                            <button 
                              onClick={() => handleStatusUpdate(session.id, 'COMPLETED')}
                              disabled={updatingId === session.id}
                              className="px-3 py-1 bg-gray-900 text-white text-xs rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {updatingId === session.id ? (
                                <IconLoader size={12} className="animate-spin" />
                              ) : (
                                <IconCheck size={12} />
                              )}
                              Complete
                            </button>
                          ) : (
                            <button 
                              disabled
                              title="Cannot mark future sessions as completed"
                              className="px-3 py-1 bg-gray-200 text-gray-400 text-xs rounded-sm cursor-not-allowed flex items-center gap-1"
                            >
                              <IconCheck size={12} />
                              Complete
                            </button>
                          )}
                        </>
                      )}
                      {(session.status === 'COMPLETED' || session.status === 'CANCELLED') && (
                        <span className="text-xs text-gray-400">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSessions.length === 0 && (
          <div className="text-center py-8">
            <IconCalendar size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSessionsTab;

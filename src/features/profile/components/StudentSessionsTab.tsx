import { useState, useEffect } from 'react';
import { IconCalendar, IconSearch, IconClock, IconUser, IconVideo, IconLoader, IconBook } from '@tabler/icons-react';
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
        <div className="space-y-2 sm:space-y-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-sm border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
                      <span className="text-xs font-semibold">
                        {session.subject?.split(' ').map(word => word[0]).join('').slice(0, 2) || 'SE'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {session.subject || 'General Session'}
                      </h3>
                      {session.topic && (
                        <p className="text-xs text-gray-600 truncate">{session.topic}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <IconUser size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {getUserDisplayName(session.tutor?.tutorProfile || undefined)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <IconCalendar size={12} />
                      <span>{formatDate(session.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconClock size={12} />
                      <span>{session.duration} min</span>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-sm ${
                      session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      session.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2">
                  {session.status === 'CONFIRMED' && session.meetingLink && (
                    <button
                      onClick={() => handleJoinSession(session.id)}
                      disabled={joiningId === session.id}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {joiningId === session.id ? (
                        <IconLoader size={14} className="animate-spin" />
                      ) : (
                        <IconVideo size={14} />
                      )}
                      <span>Join Class</span>
                    </button>
                  )}
                  {session.status === 'PENDING' && (
                    <div className="px-3 py-2 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-sm border border-yellow-200 whitespace-nowrap">
                      Waiting for tutor
                    </div>
                  )}
                  {session.status === 'COMPLETED' && (
                    <div className="px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-sm border border-blue-200 whitespace-nowrap">
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentSessionsTab;

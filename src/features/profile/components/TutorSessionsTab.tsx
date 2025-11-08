import { 
  IconCalendarEvent, 
  IconSearch, 
  IconClock,
  IconCheck,
  IconX,
  IconVideo,
  IconUser
} from '@tabler/icons-react';
import { useState } from 'react';
import type { SessionDetails } from '../../../shared/services/tutorDashboardService';

interface TutorSessionsTabProps {
  sessions: SessionDetails[];
  onConfirmSession: (sessionId: string) => void;
  onCancelSession: (sessionId: string, reason: string) => void;
  onStartSession: (sessionId: string) => void;
  onViewSession: (session: SessionDetails) => void;
}

function TutorSessionsTab({ 
  sessions, 
  onConfirmSession,
  onCancelSession,
  onStartSession,
  onViewSession
}: TutorSessionsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = sessions.filter(s => s.status === 'PENDING').length;
  const confirmedCount = sessions.filter(s => s.status === 'CONFIRMED').length;
  const completedCount = sessions.filter(s => s.status === 'COMPLETED').length;
  const cancelledCount = sessions.filter(s => s.status === 'CANCELLED').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Session Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">PENDING</p>
              <p className="text-2xl font-bold text-yellow-600 mt-0.5">{pendingCount}</p>
            </div>
            <IconClock size={32} className="text-yellow-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">CONFIRMED</p>
              <p className="text-2xl font-bold text-green-600 mt-0.5">{confirmedCount}</p>
            </div>
            <IconCheck size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">COMPLETED</p>
              <p className="text-2xl font-bold text-blue-600 mt-0.5">{completedCount}</p>
            </div>
            <IconCalendarEvent size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">CANCELLED</p>
              <p className="text-2xl font-bold text-red-600 mt-0.5">{cancelledCount}</p>
            </div>
            <IconX size={32} className="text-red-200" />
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
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Course/Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconUser size={16} className="text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.student.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.course?.title || session.subject}
                        </p>
                        {session.topic && (
                          <p className="text-xs text-gray-500">{session.topic}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <IconCalendarEvent size={14} />
                        <span>{formatDate(session.scheduledAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <IconClock size={14} />
                        <span>{session.duration} min</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {session.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => onConfirmSession(session.id)}
                              className="p-1.5 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                              title="Confirm"
                            >
                              <IconCheck size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for cancellation:');
                                if (reason) onCancelSession(session.id, reason);
                              }}
                              className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                              title="Cancel"
                            >
                              <IconX size={16} />
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
                                className="p-1.5 text-white bg-green-600 hover:bg-green-700 rounded transition-colors flex items-center gap-1"
                                title="Join Meeting"
                              >
                                <IconVideo size={16} />
                                <span className="text-xs">Join</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => onStartSession(session.id)}
                                className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-1"
                                title="Start Session"
                              >
                                <IconVideo size={16} />
                                <span className="text-xs">Start</span>
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => onViewSession(session)}
                          className="p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                          title="View Details"
                        >
                          <IconCalendarEvent size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <IconCalendarEvent size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No sessions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TutorSessionsTab;

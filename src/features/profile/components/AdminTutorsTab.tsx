import { IconUsers, IconSearch, IconLoader } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import type { AdminTutor } from '../../../shared/services/adminService';

interface AdminTutorsTabProps {
  tutors: AdminTutor[];
  pendingCount: number;
  onViewTutor: (tutor: AdminTutor) => void;
  onApproveTutor: (tutorId: string) => void;
  onRejectTutor: (tutorId: string) => void;
  onBulkApprove: () => void;
}

function AdminTutorsTab({ 
  tutors, 
  pendingCount,
  onViewTutor, 
  onApproveTutor, 
  onRejectTutor,
  onBulkApprove
}: AdminTutorsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = searchTerm === '' || 
      `${tutor.tutorProfile.firstName} ${tutor.tutorProfile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || tutor.tutorProfile.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Tutor Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">{tutors.length} total tutors • {pendingCount} pending</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <button 
                onClick={onBulkApprove}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-sm hover:bg-gray-800 transition-colors"
              >
                Approve All ({pendingCount})
              </button>
            )}
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors..."
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tutors Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tutor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">University</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tutors.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-semibold">
                          {tutor.tutorProfile.firstName[0]}{tutor.tutorProfile.lastName[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {tutor.tutorProfile.firstName} {tutor.tutorProfile.lastName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{tutor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tutor.tutorProfile.university || 'Not specified'}</div>
                    {tutor.tutorProfile.professionalTitle && (
                      <div className="text-xs text-gray-500 truncate">{tutor.tutorProfile.professionalTitle}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tutor.tutorProfile.teachingExperience || 0} years
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${tutor.tutorProfile.hourlyRate || 0}/hr
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${
                      tutor.tutorProfile.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      tutor.tutorProfile.verificationStatus === 'PENDING' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {tutor.tutorProfile.verificationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {tutor.tutorProfile.verificationStatus !== 'APPROVED' && (
                        <button 
                          onClick={() => onApproveTutor(tutor.id)}
                          className="px-3 py-1 bg-gray-900 text-white text-xs rounded-sm hover:bg-gray-800 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {tutor.tutorProfile.verificationStatus !== 'REJECTED' && (
                        <button 
                          onClick={() => onRejectTutor(tutor.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-sm hover:bg-red-200 border border-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      <button 
                        onClick={() => onViewTutor(tutor)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm hover:bg-gray-200 border border-gray-200 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {tutors.length === 0 && (
          <div className="text-center py-8">
            <IconUsers size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No tutors found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTutorsTab;

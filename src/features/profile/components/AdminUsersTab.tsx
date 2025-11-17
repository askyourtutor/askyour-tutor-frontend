import { IconUsers, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import type { AdminUser } from '../../../shared/services/adminService';
import ConfirmationModal from './ConfirmationModal';

// Helper to get user profile (either student or tutor)
const getUserProfile = (user: AdminUser | null) => {
  if (!user) return null;
  return user.studentProfile || user.tutorProfile;
};

// Helper to get user display name
const getUserDisplayName = (user: AdminUser | null) => {
  if (!user) return 'Unknown User';
  const profile = getUserProfile(user);
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return user.email;
};

interface AdminUsersTabProps {
  users: AdminUser[];
  onUpdateStatus: (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') => void;
  onDeleteUser: (userId: string) => void;
}

function AdminUsersTab({ users, onUpdateStatus, onDeleteUser }: AdminUsersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'STUDENT' | 'TUTOR' | 'ADMIN'>('ALL');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [pendingStatus, setPendingStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'INACTIVE'>('ACTIVE');

  const handleConfirmDelete = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmStatusChange = () => {
    if (selectedUser) {
      onUpdateStatus(selectedUser.id, pendingStatus);
      setShowStatusModal(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!user) return false; // Filter out null/undefined users
    const profile = getUserProfile(user);
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${profile?.firstName} ${profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Header with Search and Filter */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-gray-900">User Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filteredUsers.length} of {users.length} users</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'ALL' | 'STUDENT' | 'TUTOR' | 'ADMIN')}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="TUTOR">Tutors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const profile = getUserProfile(user);
                return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-700">
                          {profile?.firstName?.[0] || user.email[0].toUpperCase()}
                          {profile?.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {profile?.firstName && profile?.lastName 
                            ? `${profile.firstName} ${profile.lastName}` 
                            : 'No name set'
                          }
                        </div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${
                      user.role === 'ADMIN' ? 'bg-gray-900 text-white' :
                      user.role === 'TUTOR' ? 'bg-gray-200 text-gray-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' :
                      user.status === 'SUSPENDED' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setPendingStatus(user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
                          setShowStatusModal(true);
                        }}
                        className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                          user.status === 'ACTIVE' 
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-sm hover:bg-red-200 border border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <IconUsers size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${getUserDisplayName(selectedUser!)}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
      />

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusModal}
        title={`${pendingStatus === 'SUSPENDED' ? 'Suspend' : 'Activate'} User`}
        message={`Are you sure you want to ${pendingStatus === 'SUSPENDED' ? 'suspend' : 'activate'} ${getUserDisplayName(selectedUser!)}?`}
        confirmLabel={pendingStatus === 'SUSPENDED' ? 'Suspend' : 'Activate'}
        cancelLabel="Cancel"
        type="warning"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setShowStatusModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default AdminUsersTab;

import { useState } from 'react';
import { IconUser, IconMail, IconLock, IconBell, IconShield } from '@tabler/icons-react';
import { useAuth } from '../../../shared/contexts/AuthContext';

function StudentProfileSettings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    bio: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    newMessages: true,
    paymentReceipts: true,
    promotions: false
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/students/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify(profileData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/students/notifications', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify(notifications)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Notification preferences updated!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to update notifications. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setSaveMessage('Password must be at least 8 characters long!');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/students/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`rounded-sm p-4 ${
          saveMessage.includes('success') || saveMessage.includes('updated')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconUser size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <IconMail size={18} className="text-gray-400" />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconLock size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconBell size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-600">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Course Updates</p>
              <p className="text-xs text-gray-600">New lessons and course announcements</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.courseUpdates}
              onChange={(e) => setNotifications({ ...notifications, courseUpdates: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">New Messages</p>
              <p className="text-xs text-gray-600">Messages from tutors and support</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.newMessages}
              onChange={(e) => setNotifications({ ...notifications, newMessages: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Payment Receipts</p>
              <p className="text-xs text-gray-600">Transaction confirmations and receipts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.paymentReceipts}
              onChange={(e) => setNotifications({ ...notifications, paymentReceipts: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Promotions</p>
              <p className="text-xs text-gray-600">Special offers and discounts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.promotions}
              onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            onClick={handleNotificationUpdate}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconShield size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Active Sessions</p>
              <p className="text-xs text-gray-600">Manage your active login sessions</p>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm">
              View Sessions
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Delete Account
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Permanently delete your account and all associated data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSettings;

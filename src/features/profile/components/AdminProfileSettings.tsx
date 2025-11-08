import { useEffect, useState } from 'react';
import {
  IconUser,
  IconCertificate,
  IconBookmark,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCheck,
  IconCamera
} from '@tabler/icons-react';
import { UsersAPI, apiFetch } from '../../../shared/services/api';

interface AdminProfileSettingsProps {
  onProfileUpdate?: () => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  university: string;
  degree: string;
  bio: string;
  teachingExperience: number;
  hourlyRate: number;
  subjects: string[];
  languages: string[];
  profilePicture: string | null;
}

const AdminProfileSettings = ({ onProfileUpdate }: AdminProfileSettingsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    professionalTitle: '',
    university: '',
    degree: '',
    bio: '',
    teachingExperience: 0,
    hourlyRate: 0,
    subjects: [],
    languages: [],
    profilePicture: null
  });

  const [newSubject, setNewSubject] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load existing profile from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const res = await UsersAPI.getProfile();
        if (cancelled) return;
        
        const u = res.user;
        if (u?.profile) {
          setHasProfile(true);
          const p = u.profile as {
            firstName?: string;
            lastName?: string;
            professionalTitle?: string;
            university?: string;
            degree?: string;
            bio?: string;
            teachingExperience?: number;
            hourlyRate?: number;
            subjects?: string;
            languages?: string;
            profilePicture?: string;
          };
          
          // Parse JSON fields
          const subjects = p.subjects ? (typeof p.subjects === 'string' ? JSON.parse(p.subjects) : p.subjects) : [];
          const languages = p.languages ? (typeof p.languages === 'string' ? JSON.parse(p.languages) : p.languages) : [];

          setFormData({
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            professionalTitle: p.professionalTitle || '',
            university: p.university || '',
            degree: p.degree || '',
            bio: p.bio || '',
            teachingExperience: p.teachingExperience || 0,
            hourlyRate: p.hourlyRate || 0,
            subjects,
            languages,
            profilePicture: p.profilePicture || null
          });

          // Set image preview if exists
          if (p.profilePicture) {
            setImagePreview(p.profilePicture);
          }
        } else {
          setHasProfile(false);
        }
      } catch (err) {
        console.error('Error loading admin profile:', err);
        setError('Failed to load profile data');
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setError(null);

    try {
      let uploadedImageUrl = formData.profilePicture;

      // Upload profile image first if a new one was selected
      if (imageFile) {
        setIsUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append('profileImage', imageFile); // Must match backend field name

        const uploadResponse = await apiFetch<{ imageUrl: string }>('/uploads/profile-image', {
          method: 'POST',
          body: imageFormData
        });

        // Store the uploaded image URL
        uploadedImageUrl = uploadResponse.imageUrl;
        setFormData(prev => ({ ...prev, profilePicture: uploadedImageUrl }));
        setImagePreview(uploadedImageUrl); // Update preview with actual URL
        setImageFile(null); // Clear the file after upload
        setIsUploadingImage(false);
      }

      // Save tutor profile for admin using the profile API
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        professionalTitle: formData.professionalTitle,
        institution: formData.university, // Note: backend uses 'institution' field
        degree: formData.degree,
        bio: formData.bio,
        teachingExperience: formData.teachingExperience,
        hourlyRate: formData.hourlyRate,
        subjects: formData.subjects,
        languages: formData.languages,
        sessionTypes: ['Online']
      };

      await apiFetch('/users/profile/tutor', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      // Reload profile data to get the updated profilePicture from database
      const profileRes = await apiFetch('/users/profile/tutor') as {
        user?: {
          profile?: {
            firstName?: string;
            lastName?: string;
            professionalTitle?: string;
            university?: string;
            degree?: string;
            bio?: string;
            teachingExperience?: number;
            hourlyRate?: number;
            subjects?: string;
            languages?: string;
            profilePicture?: string;
          }
        }
      };
      const updatedProfile = profileRes.user?.profile;
      
      if (updatedProfile) {
        // Update form data with the latest profile data including profilePicture
        const subjects = updatedProfile.subjects ? 
          (typeof updatedProfile.subjects === 'string' ? JSON.parse(updatedProfile.subjects) : updatedProfile.subjects) : [];
        const languages = updatedProfile.languages ? 
          (typeof updatedProfile.languages === 'string' ? JSON.parse(updatedProfile.languages) : updatedProfile.languages) : [];

        setFormData({
          firstName: updatedProfile.firstName || '',
          lastName: updatedProfile.lastName || '',
          professionalTitle: updatedProfile.professionalTitle || '',
          university: updatedProfile.university || '',
          degree: updatedProfile.degree || '',
          bio: updatedProfile.bio || '',
          teachingExperience: updatedProfile.teachingExperience || 0,
          hourlyRate: updatedProfile.hourlyRate || 0,
          subjects,
          languages,
          profilePicture: updatedProfile.profilePicture || null
        });

        // Update image preview with the saved image from database
        if (updatedProfile.profilePicture) {
          setImagePreview(updatedProfile.profilePicture);
        }
      }

      setSubmitSuccess(true);
      setHasProfile(true);
      onProfileUpdate?.();
      
      // Keep success message visible for 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving admin profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({ ...prev, subjects: [...prev.subjects, newSubject.trim()] }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s !== subject) }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({ ...prev, languages: [...prev.languages, newLanguage.trim()] }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== language) }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Admin Profile Setup</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure your instructor profile to create and manage courses effectively
            </p>
          </div>
          {hasProfile && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
              <IconCheck size={16} className="text-green-600" strokeWidth={3} />
              <span className="text-sm font-medium text-green-700">Profile Active</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Success Message - Enhanced with Animation */}
        {submitSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <IconCheck size={24} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-green-900 mb-1">✓ Profile Updated Successfully!</h4>
              <p className="text-sm text-green-700">
                Your admin profile has been saved. You can now create and manage courses with your complete profile information.
              </p>
            </div>
          </div>
        )}

        {/* Error Message - Enhanced */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-lg p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <IconAlertCircle size={24} className="text-red-600 flex-shrink-0" strokeWidth={2.5} />
            <div className="flex-1">
              <h4 className="text-base font-semibold text-red-900 mb-1">Error Saving Profile</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Info Message if no profile - Enhanced */}
        {!hasProfile && !submitSuccess && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-5 flex items-start gap-4 shadow-sm">
            <IconAlertCircle size={24} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
            <div className="flex-1">
              <h4 className="text-base font-semibold text-blue-900 mb-1">Profile Setup Required</h4>
              <p className="text-sm text-blue-700 mb-2">
                Complete your instructor profile to start creating courses. This information will help students know more about you and your expertise.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-800 bg-blue-100 px-3 py-1.5 rounded-md w-fit">
                <IconCheck size={16} strokeWidth={3} />
                <span className="font-medium">Admin profiles are automatically verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <IconUser size={20} className="text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {/* Current/Preview Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                  {imagePreview || formData.profilePicture ? (
                    <img
                      src={imagePreview || formData.profilePicture || ''}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconUser size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer transition-colors">
                  <IconCamera size={18} />
                  <span className="text-sm font-medium text-gray-700">
                    {imagePreview || formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="professionalTitle"
              value={formData.professionalTitle}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., Senior Mathematics Professor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Tell students about yourself, your teaching philosophy, and experience..."
            />
          </div>
        </div>

        {/* Qualifications */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <IconCertificate size={20} className="text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">Qualifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Harvard University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Ph.D. in Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teaching Experience (years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleNumberChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleNumberChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <IconBookmark size={20} className="text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">Expertise</h3>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subjects You Teach
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Mathematics, Physics, Chemistry"
              />
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="hover:text-red-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., English, Spanish, French"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <span
                  key={language}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(language)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button - Enhanced */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : submitSuccess ? (
              <>
                <IconCheck size={20} strokeWidth={3} />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <IconDeviceFloppy size={20} />
                <span>Save Profile</span>
              </>
            )}
          </button>
          {hasProfile && !isSubmitting && (
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProfileSettings;

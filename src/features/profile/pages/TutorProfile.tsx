import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import {
  IconUser,
  IconCertificate,
  IconBookmark,
  IconCamera,
  IconCheck,
  IconDeviceFloppy
} from '@tabler/icons-react';

import { useTutorProfileForm } from '../hooks/useTutorProfileForm';
import { TagInputList } from '../components/TagInputList';
import { SessionTypeSelector } from '../components/SessionTypeSelector';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileSectionCard } from '../components/ProfileSectionCard';
import { FormInputField } from '../components/FormInputField';
import { FormTextareaField } from '../components/FormTextareaField';
import { FormSelectField } from '../components/FormSelectField';
import { FileUploadCard } from '../components/FileUploadCard';
import { ImageCropper } from '../components/ImageCropper';
import { PhoneInputField } from '../components/PhoneInputField';
import { saveProfile, uploadProfileImage } from '../services/profileService';
import { degreeOptions, timezoneOptions } from '../constants/formOptions';
import type { TutorProfileFormValues } from '../schemas/profileSchemas';
import { UsersAPI } from '../../../shared/services/api';

const TutorProfilePage = () => {
  const { methods, profileCompletion, addListItem, removeListItem, toggleSessionType } = useTutorProfileForm();
  const { handleSubmit, watch, formState: { errors }, setFocus } = methods;

  const [profileImage, setProfileImage] = useState<string | null>(null); // For preview
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // For upload
  const [imageError, setImageError] = useState<string | null>(null);
  const [credentialsFile, setCredentialsFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState<'PENDING' | 'VERIFIED' | null>(null);
  const [serverCompletion, setServerCompletion] = useState<number | null>(null);
  const [loadedFullName, setLoadedFullName] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const displayCompletion = serverCompletion ?? profileCompletion;

  const watchedSubjects = watch('subjects') || [];
  const watchedCourseCodes = watch('courseCodes') || [];
  const watchedLanguages = watch('languages') || [];
  const watchedSessionTypes = watch('sessionTypes') || [];

  // Load existing profile from API and prefill form
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await UsersAPI.getProfile();
        if (cancelled) return;
        
        const u = res.user;
        if (u?.role === 'TUTOR' && u.profile) {
          const p = u.profile as {
            firstName?: string; lastName?: string;
            phone?: string | null;
            professionalTitle?: string | null;
            university?: string | null;
            department?: string | null;
            degree?: string | null;
            specialization?: string | null;
            qualifications?: string; // JSON string
            teachingExperience?: number;
            subjects?: string; // JSON string
            courseCodes?: string; // JSON string
            hourlyRate?: number;
            availability?: string; // JSON object string
            bio?: string | null;
            languages?: string; // JSON string
            sessionTypes?: string; // JSON string
            timezone?: string | null;
            profilePicture?: string | null;
            verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
            verificationNotes?: string | null;
            verifiedAt?: string | null;
            linkedin?: string | null;
            facebook?: string | null;
            email_contact?: string | null;
          };
          const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ');
          setLoadedFullName(fullName);
          
          // Clean phone number - remove all non-digit characters except leading +
          const cleanPhone = (phone?: string | null): string => {
            if (!phone) return '';
            return phone.replace(/[^\d+]/g, '').replace(/\+(.+)\+/g, '+$1');
          };
          
          // Parse JSON arrays safely
          const parseArr = (s?: string): string[] => {
            try { return s ? JSON.parse(s) : []; } catch { return []; }
          };
          
          // Parse availability object
          const parseAvailability = (s?: string) => {
            try {
              if (!s) return {
                monday: [], tuesday: [], wednesday: [], thursday: [],
                friday: [], saturday: [], sunday: []
              };
              const parsed = JSON.parse(s);
              return {
                monday: parsed.monday || [],
                tuesday: parsed.tuesday || [],
                wednesday: parsed.wednesday || [],
                thursday: parsed.thursday || [],
                friday: parsed.friday || [],
                saturday: parsed.saturday || [],
                sunday: parsed.sunday || []
              };
            } catch {
              return {
                monday: [], tuesday: [], wednesday: [], thursday: [],
                friday: [], saturday: [], sunday: []
              };
            }
          };
          
          const qualsArr = parseArr(p.qualifications);
          const subjectsArr = parseArr(p.subjects);
          const codesArr = parseArr(p.courseCodes);
          const langsArr = parseArr(p.languages);
          const sessArrRaw = parseArr(p.sessionTypes);
          const availabilityData = parseAvailability(p.availability);
          
          // Convert session types to lowercase to match schema
          const sessArr = sessArrRaw.map((s: string) => s.toLowerCase());

          const resetData = {
            fullName: fullName || '',
            email: u.email || '',
            phone: cleanPhone(p.phone),
            professionalTitle: p.professionalTitle || '',
            institution: p.university || '',
            department: p.department || '',
            degree: p.degree || '',
            specialization: p.specialization || '',
            qualifications: qualsArr.join('\n'),
            subjects: subjectsArr,
            courseCodes: codesArr,
            availability: availabilityData,
            sessionTypes: sessArr as TutorProfileFormValues['sessionTypes'],
            languages: langsArr,
            teachingExperience: p.teachingExperience || 0,
            hourlyRate: p.hourlyRate || 0,
            bio: p.bio || '',
            timezone: p.timezone || '',
            linkedin: p.linkedin || '',
            facebook: p.facebook || '',
            email_contact: p.email_contact || '',
          };

          // Reset form with explicit options to ensure inputs re-render
          methods.reset(resetData, {
            keepErrors: false,
            keepDirty: false,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false,
            keepDefaultValues: false
          });
          
          // Convert file path to full URL
          if (p.profilePicture) {
            const imageUrl = p.profilePicture.startsWith('http') 
              ? p.profilePicture 
              : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${p.profilePicture}`;
            setProfileImage(imageUrl);
          }
          
          // Set verification status from tutor profile
          if (p.verificationStatus === 'APPROVED') {
            setVerifyStatus('VERIFIED');
          } else if (p.verificationStatus === 'PENDING' || p.verificationStatus === 'REJECTED') {
            setVerifyStatus('PENDING');
          } else {
            // Only use fallback if no tutor profile verification status
            if (u.profileVerify === 'PENDING' || u.profileVerify === 'VERIFIED') {
              setVerifyStatus(u.profileVerify);
            }
          }
        }
        if (typeof u.profileCompletion === 'number') setServerCompletion(u.profileCompletion);
      } catch {
        // Ignore load errors; form stays empty
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [methods]);

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }

    // Generate preview and open cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImageSrc(e.target?.result as string);
      setShowImageCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle cropped image
  const handleCropComplete = (croppedImage: File) => {
    setProfileImageFile(croppedImage);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(croppedImage);
    
    setShowImageCropper(false);
    setTempImageSrc(null);
  };

  // Handle credentials file upload
  const handleCredentialsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      // keep minimal inline feedback for now
      // we avoid alert() and simply skip invalid files
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      return;
    }
    setCredentialsFile(file);
  };

  // list helpers wired to hook
  const addSubject = (value: string) => addListItem('subjects', value);
  const removeSubject = (v: string) => removeListItem('subjects', v);
  const addCourseCode = (value: string) => addListItem('courseCodes', value, (s) => s.toUpperCase());
  const removeCourseCode = (v: string) => removeListItem('courseCodes', v);
  const addLanguage = (value: string) => addListItem('languages', value);
  const removeLanguage = (v: string) => removeListItem('languages', v);

  // session type toggle comes from useTutorProfileForm (toggleSessionType)

  // Form submission
  const onSubmit = async (data: TutorProfileFormValues) => {
    console.log('🚀 Form submission started');
    console.log('📝 Form data:', data);
    console.log('🖼️ Profile image file:', profileImageFile);
    
    setIsSubmitting(true);
    try {
      // Step 1: Save profile data (without image)
      console.log('💾 Saving profile data...');
      const saveResult = await saveProfile(data);
      console.log('✅ Profile saved:', saveResult);

      // Step 2: Upload profile image if changed
      if (profileImageFile) {
        console.log('📤 Uploading profile image...');
        const uploadResult = await uploadProfileImage(profileImageFile);
        console.log('📸 Image upload result:', uploadResult);
        
        if (!uploadResult.success) {
          console.error('❌ Image upload failed:', uploadResult.error);
          alert(`Profile saved, but image upload failed: ${uploadResult.error}`);
        } else {
          console.log('✅ Image uploaded successfully');
        }
      }

      console.log('🎉 Form submission completed successfully');
      setSubmitSuccess(true);
      setIsEditMode(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Form submission error:', error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Form submission finished');
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey) {
      setTimeout(() => setFocus(firstKey as keyof TutorProfileFormValues, { shouldSelect: true }), 0);
      requestAnimationFrame(() => {
        const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
        if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="mb-3 text-slate-600">Loading your profile...</div>
        )}
        {/* Header / Hero using shared component */}
        <ProfileHero
          profileImage={profileImage}
          fullName={watch('fullName') || loadedFullName}
          professionalTitle={watch('professionalTitle')}
          profileCompletion={displayCompletion}
          subjects={watchedSubjects}
          showImageUpload={false}
          isVerified={verifyStatus === 'VERIFIED'}
        />

        {/* Edit Profile Button - Top Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mx-2 sm:mx-4 lg:mx-0">
          <div className="w-full lg:w-auto text-center lg:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {isEditMode ? 'Ready to Submit?' : 'Profile Settings'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {isEditMode 
                ? 'Review your information carefully before submitting your profile.' 
                : 'View and manage your profile information.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
            {!isEditMode ? (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm sm:text-base flex items-center justify-center space-x-2"
              >
                <IconDeviceFloppy size={16} className="sm:w-5 sm:h-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    methods.reset();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="tutor-profile-form"
                  onClick={() => {
                    console.log('🔘 Save Changes button clicked!');
                    console.log('📋 Form state:', {
                      isSubmitting,
                      isValid: methods.formState.isValid,
                      errors: methods.formState.errors,
                      hasImageFile: !!profileImageFile,
                      isEditMode
                    });
                  }}
                  disabled={isSubmitting || (!methods.formState.isValid && !profileImageFile)}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all text-sm sm:text-base ${
                    (isSubmitting || (!methods.formState.isValid && !profileImageFile))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy size={16} className="sm:w-5 sm:h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 rounded-lg sm:rounded-xl mx-1 sm:mx-0">
            <IconCheck size={20} className="sm:w-6 sm:h-6 text-green-600 self-center sm:self-auto" />
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-medium text-green-800">Profile Updated Successfully!</h3>
              <p className="text-xs sm:text-sm text-green-600">Your tutor profile has been saved and is being reviewed.</p>
            </div>
          </div>
        )}

        {/* Status Banner */}
        {verifyStatus && (
          <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 ${verifyStatus === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm sm:text-base">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mr-2 ${verifyStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {verifyStatus === 'VERIFIED' ? 'Verified' : 'Pending Verification'}
                </span>
                <span className="text-slate-700">
                  {verifyStatus === 'VERIFIED' ? 'Your profile is verified and fully active.' : 'Complete all required fields to verify your profile and unlock all features.'}
                </span>
              </div>
              {typeof displayCompletion === 'number' && (
                <div className="text-xs sm:text-sm text-slate-600">Remaining: {Math.max(0, 100 - displayCompletion)}%</div>
              )}
            </div>
          </div>
        )}

        {/* Main Form */}
        <FormProvider {...methods}>
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-500 p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Please Fix These Required Fields:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-red-700">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field} className="font-medium">
                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: {(error as any)?.message || 'This field is required'}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-red-600 font-medium">
                    → Scroll down to find fields with red borders and fill them in.
                  </p>
                </div>
              </div>
            </div>
          )}
          <form id="tutor-profile-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="relative space-y-4 sm:space-y-6 lg:space-y-8">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
                <span className="font-medium">Submitting...</span>
              </div>
            </div>
          )}
          <fieldset disabled={!isEditMode || isSubmitting} className="contents">
          
          {/* Personal Information Section */}
          <ProfileSectionCard title="Personal Information" icon={<IconUser size={20} className="sm:w-6 sm:h-6" />}>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Profile Picture Upload */}
              <div className="xl:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-4">
                  Profile Picture *
                </label>
                <div className="flex flex-col items-center xl:items-start">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-3 sm:mb-4">
                    <div className="w-full h-full rounded-lg border-2 sm:border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconCamera size={24} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors">
                      <IconCamera size={12} className="sm:w-4 sm:h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {imageError ? (
                    <p className="text-xs sm:text-sm text-red-600 text-center xl:text-left max-w-xs px-2">{imageError}</p>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 text-center xl:text-left max-w-xs">
                      Upload a professional photo<br />
                      Max 5MB (JPG, PNG)
                    </p>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <FormInputField 
                  name="fullName" 
                  label="Full Name" 
                  placeholder="Enter your full name" 
                  required 
                />
                
                <FormInputField 
                  name="email" 
                  label="Email Address" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  required 
                />
                
                <PhoneInputField 
                  name="phone" 
                  label="Phone Number" 
                  required 
                />
                
                
                <FormInputField 
                  name="professionalTitle" 
                  label="Professional Title" 
                  placeholder="e.g., Mathematics Professor, English Tutor" 
                  required 
                />
                
                <FormInputField 
                  name="institution" 
                  label="University/Institution" 
                  placeholder="e.g., Harvard University, MIT" 
                  required 
                />
                
                <FormInputField 
                  name="department" 
                  label="Department" 
                  placeholder="e.g., Physics, Chemistry, Mathematics" 
                  required 
                />
                
                <FormSelectField 
                  name="degree" 
                  label="Highest Degree" 
                  options={degreeOptions} 
                  placeholder="Select your highest degree" 
                  required 
                />
                
                <div className="sm:col-span-2">
                  <FormInputField 
                    name="specialization" 
                    label="Specialization Field" 
                    placeholder="e.g., Quantum Physics, Organic Chemistry" 
                    required 
                  />
                </div>
              </div>
            </div>
          </ProfileSectionCard>

          {/* Professional Information Section */}
          <ProfileSectionCard title="Professional Details" icon={<IconCertificate size={20} className="sm:w-6 sm:h-6" />}>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <FormTextareaField 
                  name="qualifications" 
                  label="Qualifications" 
                  rows={4} 
                  placeholder="Describe your educational background, degrees, certifications..." 
                  required 
                />

                {/* Experience & Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormInputField 
                    name="teachingExperience" 
                    label="Teaching Experience" 
                    type="number" 
                    min={0} 
                    max={50} 
                    placeholder="0" 
                    helpText="years" 
                    required 
                  />

                  <FormInputField 
                    name="hourlyRate" 
                    label="Hourly Rate" 
                    type="number" 
                    min={5} 
                    max={500} 
                    placeholder="25" 
                    helpText="$/hour" 
                    required 
                  />
                </div>
              </div>

              <div className="order-first xl:order-last">
                <FileUploadCard
                  label="Credentials Upload *"
                  description="Upload your credentials, certificates, or degrees"
                  accept=".pdf"
                  file={credentialsFile}
                  onFileSelect={handleCredentialsUpload}
                  onRemove={() => setCredentialsFile(null)}
                  helperText="PDF files only, max 10MB"
                />
              </div>
            </div>
          </ProfileSectionCard>

          {/* Subjects & Bio Section */}
          <ProfileSectionCard title="Teaching Specialization" icon={<IconBookmark size={20} className="sm:w-6 sm:h-6" />}>

            <div className="space-y-6 sm:space-y-8">
              {/* Subjects and Course Codes */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div>
                  <TagInputList
                    label="Subject Specializations"
                    items={watchedSubjects}
                    placeholder="Enter a subject (e.g., Algebra, Chemistry)"
                    onAdd={(v) => addSubject(v)}
                    onRemove={(v) => removeSubject(v)}
                    emptyMessage="No subjects added yet. Add at least one subject to continue."
                    error={errors.subjects?.message as string | undefined}
                  />
                </div>

                {/* Course Codes */}
                <div>
                  <TagInputList
                    label="Course Codes"
                    items={watchedCourseCodes}
                    placeholder="Enter course code (e.g., CHEM101, PHYS201)"
                    onAdd={(v) => addCourseCode(v)}
                    onRemove={(v) => removeCourseCode(v)}
                    emptyMessage="No course codes added yet. Add at least one course code."
                    chipClassName="bg-green-50 border-green-200"
                    error={errors.courseCodes?.message as string | undefined}
                  />
                </div>
              </div>

              {/* Languages & Session Types Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Languages */}
                <div>
                  <LanguageSelector
                    selected={watchedLanguages}
                    onToggle={(language) => {
                      if (watchedLanguages.includes(language)) {
                        removeLanguage(language);
                      } else {
                        addLanguage(language);
                      }
                    }}
                    error={errors.languages?.message as string | undefined}
                  />
                </div>

                {/* Session Types */}
                <div>
                  <SessionTypeSelector
                    selected={watchedSessionTypes}
                    onToggle={(v) => toggleSessionType(v)}
                    error={errors.sessionTypes?.message as string | undefined}
                  />
                </div>
              </div>

              {/* Bio/Description */}
              <div>
                <FormTextareaField 
                  name="bio" 
                  label="Bio/Description" 
                  rows={6} 
                  placeholder="Tell students about yourself, your teaching style, achievements, and what makes you unique as a tutor..." 
                  showCharCount 
                  maxLength={2000} 
                  required 
                />
              </div>
            </div>
          </ProfileSectionCard>

          {/* Additional Information Section */}
          <ProfileSectionCard title="Additional Information" icon={<IconUser size={20} className="sm:w-6 sm:h-6" />}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <FormSelectField 
                  name="timezone" 
                  label="Timezone" 
                  options={timezoneOptions} 
                  placeholder="Select your timezone" 
                  required 
                />
                
                <FormInputField
                  name="linkedin"
                  label="LinkedIn Profile (Optional)"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <FormInputField
                  name="facebook"
                  label="Facebook Profile (Optional)"
                  placeholder="https://www.facebook.com/yourprofile"
                />
                
                <FormInputField
                  name="email_contact"
                  label="Contact Email (Optional)"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </ProfileSectionCard>
          </fieldset>
          </form>
        </FormProvider>

        {/* Image Cropper Modal */}
        {showImageCropper && tempImageSrc && (
          <ImageCropper
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
            onCancel={() => {
              setShowImageCropper(false);
              setTempImageSrc(null);
            }}
            aspectRatio={1}
            cropShape="round"
          />
        )}
      </div>
    </div>
  );
};

export default TutorProfilePage;
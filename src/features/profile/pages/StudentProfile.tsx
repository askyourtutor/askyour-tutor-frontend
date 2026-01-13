import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import {
  IconUser,
  IconBook,
  IconBrain,
  IconCamera,
  IconCheck,
  IconDeviceFloppy
} from '@tabler/icons-react';

import { useStudentProfileForm } from '../hooks/useStudentProfileForm';
import { TagInputList } from '../components/TagInputList';
import { LanguageSelector } from '../components/LanguageSelector';
import { LearningStyleSelector } from '../components/LearningStyleSelector';
import { SessionTypeSelector } from '../components/SessionTypeSelector';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileSectionCard } from '../components/ProfileSectionCard';
import { FormInputField } from '../components/FormInputField';
import { FormTextareaField } from '../components/FormTextareaField';
import { FormSelectField } from '../components/FormSelectField';
import { ImageCropper } from '../components/ImageCropper';
import { PhoneInputField } from '../components/PhoneInputField';
import { saveProfile, uploadProfileImage } from '../services/profileService';
import { UsersAPI } from '../../../shared/services/api';
import { yearOfStudyOptions, type StudentProfileFormValues } from '../schemas/profileSchemas';

const StudentProfile = () => {
  const { methods, profileCompletion, addListItem, removeListItem, toggleLearningStyle, toggleSessionPreference } = useStudentProfileForm();
  const { handleSubmit, watch, formState: { errors }, setFocus } = methods;

  const [profileImage, setProfileImage] = useState<string | null>(null); // For preview
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // For upload
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState<'PENDING' | 'VERIFIED' | null>(null);
  const [serverCompletion, setServerCompletion] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const displayCompletion = serverCompletion ?? profileCompletion;

  const watchedSubjects = watch('subjectsOfInterest') || [];
  const watchedLanguages = watch('languages') || [];
  const watchedLearningStyles = watch('learningStyle') || [];
  const watchedSessionPreferences = watch('sessionPreferences') || [];

  // Load existing profile from API and prefill form
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await UsersAPI.getProfile();
        
        if (cancelled) return;
        const u = res.user;
        if (u?.role === 'STUDENT' && u.profile) {
          const p = u.profile as { firstName?: string; lastName?: string; phone?: string | null; university?: string | null; program?: string | null; yearOfStudy?: number | null; academicGoals?: string | null; profilePicture?: string | null; subjectsOfInterest?: string | null; learningStyle?: string | null; sessionPreferences?: string | null; languages?: string | null };
          
          const fullName = [p.firstName || '', p.lastName || ''].filter(Boolean).join(' ');
          const parseArr = (s?: string | null): string[] => { 
            try { 
              const parsed = s ? JSON.parse(s) : []; 
              // Handle case where field was double-stringified or is a string instead of array
              return Array.isArray(parsed) ? parsed : [parsed].filter(v => v && typeof v === 'string');
            } catch { 
              return []; 
            } 
          };
          
          // Normalize learning style and session preferences to lowercase
          const normalizeLearningStyle = (arr: string[]): string[] => {
            return arr.map(style => style.toLowerCase().replace(/\s+/g, '-'));
          };
          
          const normalizeSessionPrefs = (arr: string[]): string[] => {
            return arr.map(pref => pref.toLowerCase().replace(/\s+/g, '-'));
          };
          
          const mapYearFromNumber = (n?: number | null): string | undefined => {
            if (n == null) return undefined;
            switch (n) {
              case 1: return 'freshman';
              case 2: return 'sophomore';
              case 3: return 'junior';
              case 4: return 'senior';
              case 5: return 'graduate';
              case 6: return 'postgraduate';
              case 7: return 'other';
              default: return 'other';
            }
          };
          
          const resetData = {
            ...methods.getValues(),
            fullName: fullName || methods.getValues('fullName'),
            email: u.email || methods.getValues('email'),
            phone: p.phone ?? methods.getValues('phone'),
            institution: p.university ?? '',
            program: p.program ?? '',
            yearOfStudy: mapYearFromNumber(p.yearOfStudy),
            academicGoals: p.academicGoals ?? '',
            subjectsOfInterest: parseArr(p.subjectsOfInterest),
            learningStyle: normalizeLearningStyle(parseArr(p.learningStyle)) as StudentProfileFormValues['learningStyle'],
            sessionPreferences: normalizeSessionPrefs(parseArr(p.sessionPreferences)) as StudentProfileFormValues['sessionPreferences'],
            languages: parseArr(p.languages),
          };
          
          methods.reset(resetData, { keepDefaultValues: true });
          
          // Trigger validation after reset to update isValid state
          setTimeout(async () => {
            await methods.trigger();
          }, 100);
          
          // Convert file path to full URL
          if (p.profilePicture) {
            const imageUrl = p.profilePicture.startsWith('http') 
              ? p.profilePicture 
              : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${p.profilePicture}`;
            setProfileImage(imageUrl);
          }
        }
        if (typeof u.profileCompletion === 'number') setServerCompletion(u.profileCompletion);
        if (u.profileVerify === 'PENDING' || u.profileVerify === 'VERIFIED') setVerifyStatus(u.profileVerify);
      } catch {
        // ignore load errors; form stays empty
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

  const addSubject = (value: string) => addListItem('subjectsOfInterest', value);
  const removeSubject = (v: string) => removeListItem('subjectsOfInterest', v);
  const addLanguage = (value: string) => addListItem('languages', value);
  const removeLanguage = (v: string) => removeListItem('languages', v);

  const onSubmit = async (data: StudentProfileFormValues) => {
    console.log('🚀 Student form submission started');
    console.log('📝 Form data:', data);
    console.log('🖼️ Profile image file:', profileImageFile);
    
    setIsSubmitting(true);
    try {
      // Step 1: Save profile data (without image)
      console.log('💾 Saving student profile data...');
      const result = await saveProfile(data);
      console.log('✅ Profile save result:', result);
      
      if (!result.success) {
        console.error('❌ Profile save failed:', result.error);
        alert(`Failed to save profile: ${result.error}`);
        return;
      }

      // Step 2: Upload profile image if changed
      if (profileImageFile) {
        console.log('📤 Uploading student profile image...');
        const uploadResult = await uploadProfileImage(profileImageFile);
        console.log('📸 Image upload result:', uploadResult);
        
        if (!uploadResult.success) {
          console.error('❌ Image upload failed:', uploadResult.error);
          alert(`Profile saved, but image upload failed: ${uploadResult.error}`);
        } else {
          console.log('✅ Image uploaded successfully');
        }
      }
      
      console.log('🎉 Student form submission completed successfully');
      setSubmitSuccess(true);
      setIsEditMode(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('❌ Student form submission error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Error saving profile: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Student form submission finished');
    }
  };
  const onInvalid = (formErrors: typeof errors) => {
    // Find first invalid field key
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey) {
      // Focus the field via RHF API
      // setTimeout to ensure any conditional UI renders before focusing
      setTimeout(() => setFocus(firstKey as keyof StudentProfileFormValues, { shouldSelect: true }), 0);
      // Also attempt to scroll the element into view smoothly
      requestAnimationFrame(() => {
        const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-2 xs:py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        {isLoading && (
          <div className="mb-3 text-slate-600">Loading your profile...</div>
        )}
        <ProfileHero
          profileImage={profileImage}
          fullName={watch('fullName')}
          professionalTitle={`${watch('program')} Student`}
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
                  form="student-profile-form"
                  onClick={() => {
                    console.log('🔘 Student Save Changes button clicked!');
                    console.log('📋 Form state:', {
                      isSubmitting,
                      isValid: methods.formState.isValid,
                      errors: methods.formState.errors,
                      hasImageFile: !!profileImageFile,
                      isEditMode
                    });
                  }}
                  disabled={isSubmitting || Object.keys(methods.formState.errors).length > 0}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all text-sm sm:text-base ${
                    (isSubmitting || Object.keys(methods.formState.errors).length > 0)
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

        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8 flex flex-col xs:flex-row xs:items-center xs:space-x-2 sm:space-x-3 space-y-2 xs:space-y-0">
            <IconCheck className="text-green-600 flex-shrink-0 mx-auto xs:mx-0" size={20} />
            <p className="text-green-600 text-center xs:text-left text-sm sm:text-base">Your student profile has been saved successfully!</p>
          </div>
        )}

        {verifyStatus && (
          <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6 ${verifyStatus === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
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
                <div className="text-xs sm:text-sm text-slate-600">Completion: {displayCompletion}% (Remaining: {Math.max(0, 100 - displayCompletion)}%)</div>
              )}
            </div>
          </div>
        )}

        <FormProvider {...methods}>
          {/* Error summary banner */}
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
                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: {
                          (typeof error === 'object' && error && 'message' in error
                            ? (error as { message?: string }).message
                            : undefined) || 'This field is required'
                        }
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

          <form id="student-profile-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="relative space-y-4 sm:space-y-6 md:space-y-8">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
                <span className="font-medium">Saving...</span>
              </div>
            </div>
          )}
          <fieldset disabled={!isEditMode || isSubmitting} className="contents">
          
          <ProfileSectionCard title="Personal Information" icon={<IconUser size={24} />}>
            { (errors.fullName || errors.email || errors.phone) && (
              <div className="mb-2 text-xs sm:text-sm text-red-600">Please complete all required personal details.</div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Profile Picture Upload */}
              <div className="xl:col-span-1 flex justify-center xl:justify-start">
                <div className="w-full max-w-xs xl:max-w-none">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4 text-center xl:text-left">
                    Profile Picture *
                  </label>
                  <div className="flex flex-col items-center xl:items-start">
                    <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mb-3 sm:mb-4">
                      <div className="w-full h-full rounded-lg border-3 sm:border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconCamera size={32} className="xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors shadow-md">
                        <IconCamera size={12} className="sm:w-4 sm:h-4" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    {imageError ? (
                      <p className="text-xs sm:text-sm text-red-600 text-center xl:text-left max-w-xs px-2">{imageError}</p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 text-center xl:text-left max-w-xs px-2 xl:px-0">
                        Upload a professional photo<br />
                        Max 5MB (JPG, PNG)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <FormInputField name="fullName" label="Full Name" placeholder="Enter your full name" required />
                <FormInputField name="email" label="Email Address" type="email" placeholder="your.email@example.com" required disabled />
                <PhoneInputField name="phone" label="Phone Number" required />
              </div>
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard title="Academic Information" icon={<IconBook size={24} />}>
            { (errors.institution || errors.program || errors.yearOfStudy || errors.academicGoals) && (
              <div className="mb-2 text-xs sm:text-sm text-red-600">Please complete your academic info and goals.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              <FormInputField name="institution" label="Institution" placeholder="e.g., Harvard University, MIT" required />
              <FormInputField name="program" label="Program/Major" placeholder="e.g., Computer Science, Biology" required />
              <FormSelectField name="yearOfStudy" label="Year of Study" options={yearOfStudyOptions} placeholder="Select your year of study" required />
            </div>
            <div className="mt-4 sm:mt-6">
              <FormTextareaField name="academicGoals" label="Academic Goals" rows={4} placeholder="Describe your academic goals, what you want to achieve, and how tutor can help you..." showCharCount maxLength={1000} required />
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard title="Learning Preferences" icon={<IconBrain size={24} />}>
            { (errors.subjectsOfInterest || errors.languages || errors.learningStyle || errors.sessionPreferences) && (
              <div className="mb-2 text-xs sm:text-sm text-red-600">Add at least one subject, language, learning style and session type.</div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <TagInputList
                label="Subjects of Interest"
                items={watchedSubjects}
                placeholder="Enter a subject (e.g., Mathematics, Physics)"
                onAdd={(v) => addSubject(v)}
                onRemove={(v) => removeSubject(v)}
                emptyMessage="No subjects added yet. Add subjects you want to learn."
                error={errors.subjectsOfInterest?.message as string | undefined}
              />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
              <LearningStyleSelector
                selected={watchedLearningStyles}
                onToggle={(v) => toggleLearningStyle(v)}
                error={errors.learningStyle?.message as string | undefined}
              />
              <SessionTypeSelector
                selected={watchedSessionPreferences}
                onToggle={(v) => toggleSessionPreference(v)}
                error={errors.sessionPreferences?.message as string | undefined}
              />
            </div>
          </ProfileSectionCard>

          {/* Removed Emergency Contact and extra fields per plan */}
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
          />
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
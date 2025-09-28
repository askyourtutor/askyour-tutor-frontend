import { useState } from 'react';
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
import { LearningStyleSelector } from '../components/LearningStyleSelector';
import { SessionTypeSelector } from '../components/SessionTypeSelector';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileSectionCard } from '../components/ProfileSectionCard';
import { FormInputField } from '../components/FormInputField';
import { FormTextareaField } from '../components/FormTextareaField';
import { FormSelectField } from '../components/FormSelectField';
import { saveProfile } from '../services/profileService';
import { timezoneOptions } from '../constants/formOptions';
import { yearOfStudyOptions, relationshipOptions, type StudentProfileFormValues } from '../schemas/profileSchemas';

const StudentProfile = () => {
  const { methods, profileCompletion, addListItem, removeListItem, toggleLearningStyle, toggleSessionPreference } = useStudentProfileForm();
  const { handleSubmit, watch, formState: { errors } } = methods;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const watchedSubjects = watch('subjectsOfInterest') || [];
  const watchedLanguages = watch('languages') || [];
  const watchedLearningStyles = watch('learningStyle') || [];
  const watchedSessionPreferences = watch('sessionPreferences') || [];

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addSubject = (value: string) => addListItem('subjectsOfInterest', value);
  const removeSubject = (v: string) => removeListItem('subjectsOfInterest', v);
  const addLanguage = (value: string) => addListItem('languages', value);
  const removeLanguage = (v: string) => removeListItem('languages', v);

  const onSubmit = async (data: StudentProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await saveProfile(data, { profileImage });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-2 xs:py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        <ProfileHero
          profileImage={profileImage}
          fullName={watch('fullName')}
          professionalTitle={`${watch('program')} Student`}
          profileCompletion={profileCompletion}
          subjects={watchedSubjects}
          showImageUpload={false}
        />

        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8 flex flex-col xs:flex-row xs:items-center xs:space-x-2 sm:space-x-3 space-y-2 xs:space-y-0">
            <IconCheck className="text-green-600 flex-shrink-0 mx-auto xs:mx-0" size={20} />
            <p className="text-green-600 text-center xs:text-left text-sm sm:text-base">Your student profile has been saved successfully!</p>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8">
          
          <ProfileSectionCard title="Personal Information" icon={<IconUser size={24} />}>
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
                <FormInputField name="email" label="Email Address" type="email" placeholder="your.email@example.com" required />
                <FormInputField name="phone" label="Phone Number" type="tel" placeholder="+1234567890" required />
                <FormInputField name="whatsappNumber" label="WhatsApp Number (Optional)" type="tel" placeholder="+1234567890" helpText="For quick communication with tutors" />
                <FormInputField name="linkedinProfile" label="LinkedIn Profile (Optional)" type="url" placeholder="https://linkedin.com/in/yourprofile" />
                <FormSelectField name="timezone" label="Timezone" options={timezoneOptions} placeholder="Select your timezone" required />
              </div>
            </div>
          </ProfileSectionCard>

          <ProfileSectionCard title="Academic Information" icon={<IconBook size={24} />}>
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
              <TagInputList
                label="Languages"
                items={watchedLanguages}
                placeholder="Enter a language (e.g., English, Spanish)"
                onAdd={(v) => addLanguage(v)}
                onRemove={(v) => removeLanguage(v)}
                emptyMessage="No languages added yet. Add languages you speak."
                chipClassName="bg-purple-50 border-purple-200"
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

          <ProfileSectionCard title="Emergency Contact" icon={<IconUser size={24} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              <FormInputField name="emergencyContact.name" label="Contact Name" placeholder="Emergency contact full name" required />
              <FormInputField name="emergencyContact.phone" label="Contact Phone" type="tel" placeholder="+1234567890" required />
              <FormSelectField name="emergencyContact.relationship" label="Relationship" options={relationshipOptions} placeholder="Select relationship" required />
            </div>
            <div className="mt-4 sm:mt-6">
              <FormTextareaField name="specialNeeds" label="Special Needs or Accommodations (Optional)" rows={3} placeholder="Describe any special learning needs, disabilities, or accommodations required..." showCharCount maxLength={500} />
            </div>
          </ProfileSectionCard>

          <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ready to Submit?</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Review your information carefully before submitting your profile.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white transition-colors ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden xs:inline">Submitting...</span>
                    <span className="xs:hidden">Saving...</span>
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="mr-2" size={16} className="sm:w-5 sm:h-5" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default StudentProfile;
import { useState } from 'react';
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
import { ProfileHero } from '../components/ProfileHero';
import { ProfileSectionCard } from '../components/ProfileSectionCard';
import { FormInputField } from '../components/FormInputField';
import { FormTextareaField } from '../components/FormTextareaField';
import { FormSelectField } from '../components/FormSelectField';
import { FileUploadCard } from '../components/FileUploadCard';
import { saveProfile } from '../services/profileService';
import { degreeOptions, timezoneOptions } from '../constants/formOptions';
import type { TutorProfileFormValues } from '../schemas/profileSchemas';

const TutorProfilePage = () => {
  const { methods, profileCompletion, addListItem, removeListItem, toggleSessionType } = useTutorProfileForm();
  const { handleSubmit, watch, formState: { errors } } = methods;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [credentialsFile, setCredentialsFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const watchedSubjects = watch('subjects') || [];
  const watchedCourseCodes = watch('courseCodes') || [];
  const watchedLanguages = watch('languages') || [];
  const watchedSessionTypes = watch('sessionTypes') || [];

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
    setIsSubmitting(true);
    try {
      await saveProfile(data, { profileImage, credentialsFile });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      // TODO: show error to user via notification system
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        {/* Header / Hero using shared component */}
        <ProfileHero
          profileImage={profileImage}
          fullName={watch('fullName')}
          professionalTitle={watch('professionalTitle')}
          profileCompletion={profileCompletion}
          subjects={watchedSubjects}
          showImageUpload={false}
        />

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

        {/* Main Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
          
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
                
                <FormInputField 
                  name="phone" 
                  label="Phone Number" 
                  type="tel" 
                  placeholder="+1234567890" 
                  required 
                />
                
                <FormInputField 
                  name="whatsappNumber" 
                  label="WhatsApp Number (Optional)" 
                  type="tel" 
                  placeholder="+1234567890" 
                  helpText="For quick student communication" 
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                    name="researchExperience" 
                    label="Research Experience" 
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
                  <TagInputList
                    label="Languages"
                    items={watchedLanguages}
                    placeholder="Enter a language (e.g., English, Spanish)"
                    onAdd={(v) => addLanguage(v)}
                    onRemove={(v) => removeLanguage(v)}
                    emptyMessage="No languages added yet. Add at least one language."
                    chipClassName="bg-purple-50 border-purple-200"
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
                  name="linkedinProfile" 
                  label="LinkedIn Profile (Optional)" 
                  type="url" 
                  placeholder="https://linkedin.com/in/yourprofile" 
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <FormInputField 
                  name="researchGateProfile" 
                  label="ResearchGate Profile (Optional)" 
                  type="url" 
                  placeholder="https://researchgate.net/profile/yourprofile" 
                />

                <FormInputField 
                  name="googleScholarProfile" 
                  label="Google Scholar Profile (Optional)" 
                  type="url" 
                  placeholder="https://scholar.google.com/citations?user=yourprofile" 
                />
              </div>
            </div>
          </ProfileSectionCard>

          {/* Submit Section */}
          <div className="bg-white shadow-lg p-4 sm:p-6 lg:p-8 mx-1 sm:mx-0" style={{ borderRadius: '10px' }}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="w-full lg:w-auto text-center lg:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ready to Submit?</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Review your information carefully before submitting your profile.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all text-sm sm:text-base ${
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy size={16} className="sm:w-5 sm:h-5" />
                      <span>Submit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default TutorProfilePage;
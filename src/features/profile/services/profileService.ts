// Profile service wired to backend APIs with validation & mapping
import { apiFetch, getAccessToken } from '../../../shared/services/api';
import type { TutorProfileFormValues, StudentProfileFormValues } from '../schemas/profileSchemas';

type ProfileFormValues = TutorProfileFormValues | StudentProfileFormValues;

export interface SaveProfileResponse {
  success: boolean;
  profile?: unknown;
  error?: string;
}

export interface UploadProfileImageResponse {
  success: boolean;
  imagePath?: string;
  imageUrl?: string;
  error?: string;
}

/**
 * Upload profile image to the server
 * @param imageFile - The image file to upload
 * @returns Response with image path and URL
 */
export async function uploadProfileImage(imageFile: File): Promise<UploadProfileImageResponse> {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const token = getAccessToken();
    if (!token) {
      throw new Error('Not authenticated. Please log in again.');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload profile image');
    }

    const data = await response.json();
    return { success: true, imagePath: data.imagePath, imageUrl: data.imageUrl };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to upload profile image';
    return { success: false, error: msg };
  }
}

const isTutorProfile = (p: ProfileFormValues): p is TutorProfileFormValues => 'professionalTitle' in p;

const validateRequiredFields = (p: ProfileFormValues) => {
  const req = (fields: string[]) => fields.forEach((f) => {
    const v = (p as Record<string, unknown>)[f];
    if (typeof v === 'string' && !v.trim()) throw new Error(`${f} is required`);
  });
  if (isTutorProfile(p)) req(['fullName', 'email', 'phone', 'professionalTitle']);
  else req(['fullName', 'email', 'phone', 'institution', 'program']);
};

const splitName = (full?: string) => {
  const s = (full ?? '').trim();
  if (!s) return { firstName: '', lastName: '' };
  const parts = s.split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') || '' };
};

type TutorPayload = {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  professionalTitle: string | null;
  institution: string | null;
  department: string | null;
  degree: string | null;
  specialization: string | null;
  qualifications: string[];
  teachingExperience: number;
  subjects: string[];
  courseCodes: string[];
  hourlyRate: number;
  availability: Record<string, unknown> | null;
  bio: string | null;
  languages: string[];
  sessionTypes: string[];
  timezone: string | null;
  // profileImage removed - uploaded separately via uploadProfileImage()
  credentialsFile: string | null; // URL (upload not implemented yet)
};

type StudentPayload = {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  institution: string | null;
  program: string | null;
  yearOfStudy: number | null;
  academicGoals: string | null;
  // profileImage removed - uploaded separately via uploadProfileImage()
  subjectsOfInterest: string[];
  learningStyle: string[];
  sessionPreferences: string[];
  languages: string[];
};

export async function saveProfile(profileData: ProfileFormValues): Promise<SaveProfileResponse> {
  try {
    if (!profileData) throw new Error('No profile data provided');
    validateRequiredFields(profileData);

    // Note: profileImage is uploaded separately via uploadProfileImage()

    if (isTutorProfile(profileData)) {
      const tutor = profileData as TutorProfileFormValues;
      const { firstName, lastName } = splitName(tutor.fullName as unknown as string);
      // Normalize arrays
      const subjectsArr: string[] = Array.isArray(tutor.subjects) ? tutor.subjects : [];
      const courseCodesArr: string[] = Array.isArray(tutor.courseCodes) ? tutor.courseCodes : [];
      const languagesArr: string[] = Array.isArray(tutor.languages) ? tutor.languages : [];
      const sessionTypesArr: string[] = Array.isArray(tutor.sessionTypes) ? tutor.sessionTypes : [];
      const qualificationsArr: string[] = tutor.qualifications
        ? String(tutor.qualifications).split(/\r?\n|,/).map(s => s.trim()).filter(Boolean)
        : [];

      const payload: TutorPayload = {
        firstName,
        lastName,
        email: tutor.email ?? null,
        phone: tutor.phone ?? null,
        professionalTitle: tutor.professionalTitle ?? null,
        institution: tutor.institution ?? null,
        department: tutor.department ?? null,
        degree: tutor.degree ?? null,
        specialization: tutor.specialization ?? null,
        qualifications: qualificationsArr,
        teachingExperience: Number(tutor.teachingExperience ?? 0),
        subjects: subjectsArr,
        courseCodes: courseCodesArr,
        hourlyRate: Number(tutor.hourlyRate ?? 0),
        availability: (() => {
          const av: unknown = (tutor as unknown as { availability?: unknown }).availability;
          return av && typeof av === 'object' ? (av as Record<string, unknown>) : null;
        })(),
        bio: tutor.bio ?? null,
        languages: languagesArr,
        sessionTypes: sessionTypesArr,
        timezone: tutor.timezone ?? null,
        // profileImage uploaded separately via uploadProfileImage()
        credentialsFile: null,
      };

      const res = await apiFetch<{ success: boolean; profile: unknown }>(
        '/users/profile/tutor',
        { method: 'PUT', body: JSON.stringify(payload) }
      );
      return { success: true, profile: (res as { success: boolean; profile: unknown }).profile };
    }

    // Student
    const student = profileData as StudentProfileFormValues;
    const { firstName, lastName } = splitName(student.fullName as string);
    const mapYearToNumber = (v?: string | null): number | null => {
      const val = (v ?? '').toLowerCase();
      switch (val) {
        case 'freshman': return 1;
        case 'sophomore': return 2;
        case 'junior': return 3;
        case 'senior': return 4;
        case 'graduate': return 5;
        case 'postgraduate': return 6;
        case 'other': return 7;
        default: return null;
      }
    };
    const payload: StudentPayload = {
      firstName,
      lastName,
      email: student.email ?? null,
      phone: student.phone ?? null,
      institution: student.institution ?? null,
      program: student.program ?? null,
      yearOfStudy: mapYearToNumber(student.yearOfStudy),
      academicGoals: student.academicGoals ?? null,
      // profileImage uploaded separately via uploadProfileImage()
      subjectsOfInterest: Array.isArray(student.subjectsOfInterest) ? student.subjectsOfInterest : [],
      learningStyle: Array.isArray(student.learningStyle) ? student.learningStyle : [],
      sessionPreferences: Array.isArray(student.sessionPreferences) ? student.sessionPreferences : [],
      languages: Array.isArray(student.languages) ? student.languages : [],
    };

    const res = await apiFetch<{ success: boolean; profile: unknown }>(
      '/users/profile/student',
      { method: 'PUT', body: JSON.stringify(payload) }
    );
    
    return { success: true, profile: (res as { success: boolean; profile: unknown }).profile };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to save profile';
    return { success: false, error: msg };
  }
}

export default saveProfile;

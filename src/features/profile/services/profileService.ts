// Enhanced profile service with security validations and error handling

import type { TutorProfileFormValues, StudentProfileFormValues } from '../schemas/profileSchemas';

type ProfileFormValues = TutorProfileFormValues | StudentProfileFormValues;

interface ProfileFiles {
  profileImage?: string | null;
  credentialsFile?: File | null;
}

interface SaveProfileResponse {
  success: boolean;
  data?: {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    uploaded: boolean;
    hasImage: boolean;
  };
  error?: string;
}

// Security validation for files
const validateProfileImage = (imageData: string): boolean => {
  // Check if it's a valid base64 image
  const base64Pattern = /^data:image\/(jpeg|jpg|png|gif);base64,/;
  return base64Pattern.test(imageData);
};

const validateCredentialsFile = (file: File): boolean => {
  // Validate file type and size
  if (file.type !== 'application/pdf') return false;
  if (file.size > 10 * 1024 * 1024) return false; // 10MB limit
  if (!/^[a-zA-Z0-9._-]+\.(pdf)$/i.test(file.name)) return false;
  return true;
};

// Rate limiting simulation
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1000; // 1 second between requests

const isTutorProfile = (profileData: ProfileFormValues): profileData is TutorProfileFormValues =>
  'professionalTitle' in profileData;

const validateRequiredFields = (profileData: ProfileFormValues) => {
  if (isTutorProfile(profileData)) {
    const requiredFields: (keyof TutorProfileFormValues)[] = ['fullName', 'email', 'phone', 'professionalTitle'];
    for (const field of requiredFields) {
      const value = profileData[field];
      if (typeof value === 'string') {
        if (!value.trim()) {
          throw new Error(`${field} is required`);
        }
      }
    }
  } else {
    const requiredFields: (keyof StudentProfileFormValues)[] = ['fullName', 'email', 'phone', 'institution', 'program'];
    for (const field of requiredFields) {
      const value = profileData[field];
      if (typeof value === 'string') {
        if (!value.trim()) {
          throw new Error(`${field} is required`);
        }
      }
    }
  }
};

export async function saveProfile(
  profileData: ProfileFormValues, 
  files?: ProfileFiles
): Promise<SaveProfileResponse> {
  try {
    // Rate limiting
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_MS) {
      throw new Error('Please wait before submitting again');
    }
    lastRequestTime = now;

    // Basic validation
    if (!profileData) {
      throw new Error('No profile data provided');
    }

    // Validate required fields specific to profile type
    validateRequiredFields(profileData);

    // Validate files if provided
    if (files?.profileImage && !validateProfileImage(files.profileImage)) {
      throw new Error('Invalid profile image format');
    }

    if (files?.credentialsFile && !validateCredentialsFile(files.credentialsFile)) {
      throw new Error('Invalid credentials file');
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random errors for testing (remove in production)
    if (Math.random() < 0.1) {
      throw new Error('Network error occurred');
    }

    // Success response
    return {
      success: true,
      data: {
        id: `profile_${Date.now()}`,
        status: 'pending',
        uploaded: !!files?.credentialsFile,
        hasImage: !!files?.profileImage
      }
    };
  } catch (error) {
    console.error('Profile save error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export default saveProfile;

import { z } from 'zod';

// Security utilities for input sanitization
const sanitizeString = (str: string) => str.trim().replace(/\s+/g, ' ');
const removeHtmlTags = (str: string) => str.replace(/<[^>]*>/g, '');
const validateNoScriptTags = (str: string) => !/<script[^>]*>.*?<\/script>/gi.test(str);

// Enhanced validation patterns
const namePattern = /^[a-zA-Z\s\-']+$/;
const phonePattern = /^[+]?[1-9]\d{1,14}$/; // E.164 format
const courseCodePattern = /^[A-Z]{2,4}\d{3,4}[A-Z]?$/i;
const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

// Year of study options for students
export const yearOfStudyOptions = [
  { value: 'freshman', label: 'Freshman (1st Year)' },
  { value: 'sophomore', label: 'Sophomore (2nd Year)' },
  { value: 'junior', label: 'Junior (3rd Year)' },
  { value: 'senior', label: 'Senior (4th Year)' },
  { value: 'graduate', label: 'Graduate Student' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'other', label: 'Other' }
];

// Relationship options for emergency contact
export const relationshipOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'relative', label: 'Relative' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' }
];

export const sessionTypeOptions = [
  { value: 'individual', label: 'Individual Sessions (1-on-1)', desc: 'One-on-one tutoring sessions' },
  { value: 'group', label: 'Group Sessions', desc: 'Small group sessions (max 5 students)' },
  { value: 'mini-session', label: 'Mini Sessions', desc: 'Quick help sessions (15-30 mins)' },
  { value: 'recurring', label: 'Recurring Sessions', desc: 'Regular weekly/monthly sessions' }
] as const;

// Session preferences for students (same options but different context)
export const sessionPreferenceOptions = sessionTypeOptions;

export type SessionTypeValue = typeof sessionTypeOptions[number]['value'];

export const availabilitySchema = z.object({
  monday: z.array(z.string()),
  tuesday: z.array(z.string()),
  wednesday: z.array(z.string()),
  thursday: z.array(z.string()),
  friday: z.array(z.string()),
  saturday: z.array(z.string()),
  sunday: z.array(z.string())
});

export const tutorProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected')
    .refine((val: string) => namePattern.test(val), 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address too long')
    .transform(sanitizeString)
    .refine((val: string) => !val.includes('..'), 'Invalid email format'),
    
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .transform(sanitizeString)
    .refine((val: string) => phonePattern.test(val), 'Invalid phone number format'),
    
  professionalTitle: z.string()
    .min(2, 'Professional title is required')
    .max(100, 'Professional title cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  institution: z.string()
    .min(2, 'Institution is required')
    .max(100, 'Institution name cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  department: z.string()
    .min(2, 'Department is required')
    .max(100, 'Department name cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  degree: z.string()
    .min(2, 'Highest degree is required')
    .max(100, 'Degree name cannot exceed 100 characters')
    .transform(sanitizeString),
    
  specialization: z.string()
    .min(2, 'Specialization field is required')
    .max(100, 'Specialization cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  qualifications: z.string()
    .min(10, 'Please provide detailed qualifications')
    .max(1000, 'Qualifications cannot exceed 1000 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  teachingExperience: z.number()
    .int('Teaching experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(50, 'Teaching experience cannot exceed 50 years'),
    
  researchExperience: z.number()
    .int('Research experience must be a whole number')
    .min(0, 'Research experience cannot be negative')
    .max(50, 'Research experience cannot exceed 50 years'),
    
  hourlyRate: z.number()
    .min(5, 'Minimum rate is $5/hour')
    .max(500, 'Maximum rate is $500/hour')
    .refine((val: number) => val % 0.01 === 0 || val % 1 === 0, 'Rate must be a valid currency amount'),
    
  bio: z.string()
    .min(50, 'Bio must be at least 50 characters')
    .max(2000, 'Bio cannot exceed 2000 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  subjects: z.array(
    z.string()
      .min(1, 'Subject name cannot be empty')
      .max(50, 'Subject name too long')
      .transform(sanitizeString)
      .transform(removeHtmlTags)
      .refine(validateNoScriptTags, 'Invalid characters in subject')
  ).min(1, 'At least one subject is required')
   .max(20, 'Maximum 20 subjects allowed'),
   
  courseCodes: z.array(
    z.string()
      .transform((val: string) => val.trim().toUpperCase())
      .refine((val: string) => courseCodePattern.test(val), 'Invalid course code format (e.g., CS101, MATH201)')
  ).min(1, 'At least one course code is required')
   .max(15, 'Maximum 15 course codes allowed'),
   
  availability: availabilitySchema,
  
  sessionTypes: z.array(z.enum(['individual', 'group', 'mini-session', 'recurring']))
    .min(1, 'Select at least one session type')
    .max(4, 'Cannot select more than 4 session types'),
    
  languages: z.array(
    z.string()
      .min(2, 'Language name too short')
      .max(30, 'Language name too long')
      .transform(sanitizeString)
      .transform(removeHtmlTags)
      .refine(validateNoScriptTags, 'Invalid characters in language')
  ).min(1, 'At least one language is required')
   .max(10, 'Maximum 10 languages allowed'),
   
  timezone: z.string()
    .min(1, 'Timezone is required')
    .refine((val: string) => /^UTC[+-]\d{1,2}(:30)?$/.test(val), 'Invalid timezone format'),
    
  whatsappNumber: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || phonePattern.test(val), 'Invalid WhatsApp number format')
    .optional(),
    
  linkedinProfile: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || (urlPattern.test(val) && val.includes('linkedin.com')), 'Invalid LinkedIn URL')
    .optional().or(z.literal('')),
    
  researchGateProfile: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || (urlPattern.test(val) && val.includes('researchgate.net')), 'Invalid ResearchGate URL')
    .optional().or(z.literal('')),
    
  googleScholarProfile: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || (urlPattern.test(val) && val.includes('scholar.google.com')), 'Invalid Google Scholar URL')
    .optional().or(z.literal('')),
    
  introVideoUrl: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || (urlPattern.test(val) && (val.includes('youtube.com') || val.includes('youtu.be') || val.includes('vimeo.com'))), 'Only YouTube and Vimeo URLs are allowed')
    .optional().or(z.literal('')),
    
  achievements: z.string()
    .max(1000, 'Achievements cannot exceed 1000 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected')
    .optional(),
    
  publications: z.string()
    .max(1000, 'Publications cannot exceed 1000 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected')
    .optional()
});

// Student Profile Schema - simplified version for students
export const studentProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected')
    .refine((val: string) => namePattern.test(val), 'Name can only contain letters, spaces, hyphens, and apostrophes'),
    
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address too long')
    .transform(sanitizeString)
    .refine((val: string) => !val.includes('..'), 'Invalid email format'),
    
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .transform(sanitizeString)
    .refine((val: string) => phonePattern.test(val), 'Invalid phone number format'),
    
  institution: z.string()
    .min(2, 'Institution is required')
    .max(100, 'Institution name cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  program: z.string()
    .min(2, 'Program/Major is required')
    .max(100, 'Program name cannot exceed 100 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  yearOfStudy: z.string()
    .min(1, 'Year of study is required')
    .max(50, 'Year of study cannot exceed 50 characters'),
    
  academicGoals: z.string()
    .min(20, 'Please describe your academic goals')
    .max(1000, 'Academic goals cannot exceed 1000 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected'),
    
  subjectsOfInterest: z.array(
    z.string()
      .min(1, 'Subject name cannot be empty')
      .max(50, 'Subject name too long')
      .transform(sanitizeString)
      .transform(removeHtmlTags)
      .refine(validateNoScriptTags, 'Invalid characters in subject')
  ).min(1, 'At least one subject is required')
   .max(15, 'Maximum 15 subjects allowed'),
   
  learningStyle: z.array(z.enum(['visual', 'auditory', 'kinesthetic', 'reading-writing']))
    .min(1, 'Select at least one learning style')
    .max(4, 'Cannot select more than 4 learning styles'),
    
  sessionPreferences: z.array(z.enum(['individual', 'group', 'mini-session', 'recurring']))
    .min(1, 'Select at least one session preference')
    .max(4, 'Cannot select more than 4 session preferences'),
    
  languages: z.array(
    z.string()
      .min(2, 'Language name too short')
      .max(30, 'Language name too long')
      .transform(sanitizeString)
      .transform(removeHtmlTags)
      .refine(validateNoScriptTags, 'Invalid characters in language')
  ).min(1, 'At least one language is required')
   .max(10, 'Maximum 10 languages allowed'),
   
  timezone: z.string()
    .min(1, 'Timezone is required')
    .refine((val: string) => /^UTC[+-]\d{1,2}(:30)?$/.test(val), 'Invalid timezone format'),
    
  availability: availabilitySchema,
  
  whatsappNumber: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || phonePattern.test(val), 'Invalid WhatsApp number format')
    .optional(),
    
  linkedinProfile: z.string()
    .transform(sanitizeString)
    .refine((val: string) => val === '' || (urlPattern.test(val) && val.includes('linkedin.com')), 'Invalid LinkedIn URL')
    .optional().or(z.literal('')),
    
  emergencyContact: z.object({
    name: z.string()
      .min(2, 'Emergency contact name is required')
      .max(100, 'Name cannot exceed 100 characters')
      .transform(sanitizeString)
      .transform(removeHtmlTags)
      .refine(validateNoScriptTags, 'Invalid characters detected'),
    phone: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .transform(sanitizeString)
      .refine((val: string) => phonePattern.test(val), 'Invalid phone number format'),
    relationship: z.string()
      .min(2, 'Relationship is required')
      .max(50, 'Relationship cannot exceed 50 characters')
      .transform(sanitizeString)
  }),
  
  specialNeeds: z.string()
    .max(500, 'Special needs cannot exceed 500 characters')
    .transform(sanitizeString)
    .transform(removeHtmlTags)
    .refine(validateNoScriptTags, 'Invalid characters detected')
    .optional()
});

export type TutorProfileFormValues = z.infer<typeof tutorProfileSchema>;
export type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

export const tutorProfileDefaultValues: TutorProfileFormValues = {
  fullName: '',
  email: '',
  phone: '',
  professionalTitle: '',
  institution: '',
  department: '',
  degree: '',
  specialization: '',
  qualifications: '',
  teachingExperience: 0,
  researchExperience: 0,
  hourlyRate: 25,
  bio: '',
  subjects: [],
  courseCodes: [],
  availability: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  sessionTypes: [],
  languages: [],
  timezone: '',
  whatsappNumber: '',
  linkedinProfile: '',
  researchGateProfile: '',
  googleScholarProfile: '',
  introVideoUrl: '',
  achievements: '',
  publications: ''
};

export const studentProfileDefaultValues: StudentProfileFormValues = {
  fullName: '',
  email: '',
  phone: '',
  institution: '',
  program: '',
  yearOfStudy: '',
  academicGoals: '',
  subjectsOfInterest: [],
  learningStyle: [],
  sessionPreferences: [],
  languages: [],
  timezone: '',
  availability: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  whatsappNumber: '',
  linkedinProfile: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  specialNeeds: ''
};

// Learning style options for students
export const learningStyleOptions = [
  { value: 'visual', label: 'Visual Learning', desc: 'Learn best through images, diagrams, and visual aids' },
  { value: 'auditory', label: 'Auditory Learning', desc: 'Learn best through listening and verbal instruction' },
  { value: 'kinesthetic', label: 'Kinesthetic Learning', desc: 'Learn best through hands-on activities and movement' },
  { value: 'reading-writing', label: 'Reading/Writing', desc: 'Learn best through reading and writing activities' }
] as const;

export type LearningStyleValue = typeof learningStyleOptions[number]['value'];

// Team member interface and mock data
export type Department = 'IT' | 'Business' | 'Science' | 'Law' | 'Arts';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio?: string;
  social: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  expertise?: string[];
  experience?: number;
  verified?: boolean;
  department?: Department;
}

// Mock team data
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Lily Michelle',
    position: 'Founder & CEO',
    image: '/assets/img/team/team_2_1.jpg',
    bio: 'Visionary leader with 10+ years in education technology. Passionate about making quality education accessible to everyone.',
    social: {
      twitter: 'https://twitter.com/lilymichelle',
      facebook: 'https://facebook.com/lilymichelle',
      instagram: 'https://instagram.com/lilymichelle'
    },
    expertise: ['Leadership', 'Education Technology', 'Business Strategy'],
    experience: 10,
    verified: true,
    department: 'Business'
  },
  {
    id: 'team-2',
    name: 'Daniel Thomas',
    position: 'Junior Instructor',
    image: '/assets/img/team/team_2_2.jpg',
    bio: 'Enthusiastic educator specializing in STEM subjects. Dedicated to helping students achieve their academic goals.',
    social: {
      twitter: 'https://twitter.com/danielthomas',
      facebook: 'https://facebook.com/danielthomas',
      instagram: 'https://instagram.com/danielthomas'
    },
    expertise: ['Mathematics', 'Physics', 'Chemistry'],
    experience: 3,
    verified: true,
    department: 'Science'
  },
  {
    id: 'team-3',
    name: 'Jennifer Patricia',
    position: 'Senior Instructor',
    image: '/assets/img/team/team_2_3.jpg',
    bio: 'Experienced educator with expertise in advanced mathematics and engineering. Committed to student success.',
    social: {
      twitter: 'https://twitter.com/jenniferpatricia',
      facebook: 'https://facebook.com/jenniferpatricia',
      instagram: 'https://instagram.com/jenniferpatricia'
    },
    expertise: ['Advanced Mathematics', 'Engineering', 'Problem Solving'],
    experience: 8,
    verified: true,
    department: 'Science'
  },
  {
    id: 'team-4',
    name: 'Hirmar Ubuntu',
    position: 'Instructor',
    image: '/assets/img/team/team_2_4.jpg',
    bio: 'Passionate about biology and life sciences. Helps students understand complex biological concepts with ease.',
    social: {
      twitter: 'https://twitter.com/hirmarubuntu',
      facebook: 'https://facebook.com/hirmarubuntu',
      instagram: 'https://instagram.com/hirmarubuntu'
    },
    expertise: ['Biology', 'Life Sciences', 'Research Methods'],
    experience: 5,
    verified: true,
    department: 'Science'
  }
];

// Helper functions
export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return mockTeamMembers.find(member => member.id === id);
};

export const getTeamMembersByPosition = (position: string): TeamMember[] => {
  return mockTeamMembers.filter(member => 
    member.position.toLowerCase().includes(position.toLowerCase())
  );
};

export const getFeaturedTeamMembers = (limit: number = 4): TeamMember[] => {
  return mockTeamMembers
    .filter(member => member.verified)
    .slice(0, limit);
};

export const getInstructors = (): TeamMember[] => {
  return mockTeamMembers.filter(member => 
    member.position.toLowerCase().includes('instructor')
  );
};

export const getTeamMembersByDepartment = (department: Department): TeamMember[] => {
  return mockTeamMembers.filter(member => member.department === department);
};

export const getInstructorsByDepartment = (department: Department): TeamMember[] => {
  return getTeamMembersByDepartment(department).filter(member =>
    member.position.toLowerCase().includes('instructor')
  );
};

export const getAllDepartments = (): Department[] => {
  const departments = new Set<Department>();
  mockTeamMembers.forEach(member => {
    if (member.department) {
      departments.add(member.department);
    }
  });
  return Array.from(departments) as Department[];
};

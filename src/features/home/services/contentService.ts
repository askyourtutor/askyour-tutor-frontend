// Content Service - Handles static content and about us data
export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  images: {
    main: string;
    secondary: string;
  };
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: {
    text: string;
    color: string;
  }[];
  buttons: {
    primary: {
      text: string;
      link: string;
    };
    secondary: {
      text: string;
      link: string;
    };
  };
  backgroundImage: string;
  tutorImage: string;
}

// Mock content data
const mockAboutContent: AboutContent = {
  id: 'about-main',
  title: 'Dive into our Online Courses and Ignite Your Learning!',
  subtitle: 'Get to Know About Us',
  description: 'Transform your learning experience with our comprehensive online platform. We provide expert-led courses, interactive learning materials, and personalized support to help you achieve your educational goals. Join thousands of students who have already started their learning journey with us.',
  features: [
    'Access to 100K+ high-quality online courses',
    'Learn from industry experts and certified instructors', 
    'Gain job-ready skills with hands-on projects',
    'Get recognized certificates upon course completion',
    'Join a community of passionate learners worldwide'
  ],
  images: {
    main: '/assets/img/about/about_2_1.jpg',
    secondary: '/assets/img/about/about_2_2.jpg'
  },
  stats: [
    { label: 'Active Students', value: '16,500+' },
    { label: 'Expert Instructors', value: '450+' },
    { label: 'Course Categories', value: '25+' },
    { label: 'Success Rate', value: '95%' }
  ]
};

const mockHeroContent: HeroContent = {
  id: 'hero-main',
  title: 'Online Education',
  subtitle: 'Feels Like Real Classroom',
  description: 'Transform your learning experience with our interactive online platform. Get access to expert instructors, hands-on projects, and industry-recognized certifications that will advance your career.',
  features: [
    { text: 'Get Certified', color: 'var(--color-primary)' },
    { text: 'Gain Job-ready Skills', color: '#ef4444' },
    { text: 'Great Life', color: '#6b7280' }
  ],
  buttons: {
    primary: {
      text: 'Get Started',
      link: '/courses'
    },
    secondary: {
      text: 'Our Courses',
      link: '/courses'
    }
  },
  backgroundImage: '/assets/img/hero/hero_bg_2_1.jpg',
  tutorImage: '/assets/img/hero/tutor-2.png'
};

export class ContentService {

  // Get about us content
  async getAboutContent(): Promise<AboutContent> {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/about`);
      // return await response.json();
      
      return mockAboutContent;
    } catch (error) {
      console.error('Error fetching about content:', error);
      throw new Error('Failed to fetch about content');
    }
  }

  // Get hero section content
  async getHeroContent(): Promise<HeroContent> {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/hero`);
      // return await response.json();
      
      return mockHeroContent;
    } catch (error) {
      console.error('Error fetching hero content:', error);
      throw new Error('Failed to fetch hero content');
    }
  }

  // Get page content by slug
  async getPageContent(slug: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/pages/${slug}`);
      // return await response.json();
      
      // Mock implementation for common pages
      const pages: Record<string, {
        title: string;
        content?: string;
        lastUpdated?: string;
        email?: string;
        phone?: string;
        address?: string;
      }> = {
        'privacy': {
          title: 'Privacy Policy',
          content: 'Your privacy is important to us...',
          lastUpdated: '2024-01-15'
        },
        'terms': {
          title: 'Terms of Service',
          content: 'By using our service, you agree to...',
          lastUpdated: '2024-01-15'
        },
        'contact': {
          title: 'Contact Us',
          email: 'support@askyourtutor.com',
          phone: '+1 (555) 123-4567',
          address: '123 Education St, Learning City, LC 12345'
        }
      };
      
      return pages[slug] || null;
    } catch (error) {
      console.error('Error fetching page content:', error);
      throw new Error('Failed to fetch page content');
    }
  }

  // Get FAQ content
  async getFAQs() {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/faqs`);
      // return await response.json();
      
      return [
        {
          id: 'faq-1',
          question: 'How do I enroll in a course?',
          answer: 'Simply browse our course catalog, select the course you want, and click the "Enroll Now" button. You can pay securely online and start learning immediately.'
        },
        {
          id: 'faq-2',
          question: 'Are the certificates recognized?',
          answer: 'Yes, our certificates are industry-recognized and can be shared on LinkedIn, added to your resume, or used for professional development.'
        },
        {
          id: 'faq-3',
          question: 'Can I access courses on mobile?',
          answer: 'Absolutely! Our platform is fully responsive and works perfectly on all devices including smartphones and tablets.'
        },
        {
          id: 'faq-4',
          question: 'What if I need help during the course?',
          answer: 'We provide 24/7 support through our help center, live chat, and community forums. Our instructors are also available to answer questions.'
        }
      ];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw new Error('Failed to fetch FAQs');
    }
  }
}

export const contentService = new ContentService();

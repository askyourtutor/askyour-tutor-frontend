import { IconArrowRight, IconUsers, IconVideo } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { statsService, contentService } from '../../services';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const [heroStats, setHeroStats] = useState({
    activeStudents: 16500,
    onlineCourses: 7500
  });
  const [heroContent, setHeroContent] = useState({
    title: 'Online Education',
    subtitle: 'Feels Like Real Classroom',
    description: 'Transform your learning experience with our interactive online platform. Get access to expert instructors, hands-on projects, and industry-recognized certifications that will advance your career.',
    features: [
      { text: 'Get Certified', color: 'var(--color-primary)' },
      { text: 'Gain Job-ready Skills', color: '#ef4444' },
      { text: 'Great Life', color: '#6b7280' }
    ]
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const [stats, content] = await Promise.all([
          statsService.getHeroStats(),
          contentService.getHeroContent()
        ]);
        setHeroStats(stats);
        setHeroContent(content);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        // Keep default values on error
      }
    };

    fetchHeroData();
  }, []);
  return (
    <section 
      className={`th-hero-wrapper hero-2 relative overflow-hidden bg-blue-50 ${className}`}
      id="hero"
      aria-label="Hero section"
    >
      {/* Hero Background */}
      <div 
        className="th-hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/assets/img/hero/hero_bg_2_1.jpg")',
        }}
        role="img"
        aria-label="Hero background"
      />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-end lg:items-center py-4 lg:py-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {/* Content Section */}
          <div className="order-2 lg:order-1 lg:col-span-2 text-center lg:text-left">
            <div className="hero-content space-y-6 lg:space-y-8 max-w-lg lg:max-w-none mx-auto lg:mx-0">
              {/* Hero Titles - Clean & Bold */}
              <div className="hero-titles space-y-2 lg:space-y-4">
                <h1 
                  className="hero-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight whitespace-nowrap"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {heroContent.title}
                </h1>
                <h2 
                  className="hero-subtitle-large text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {heroContent.subtitle}
                </h2>
              </div>

              {/* Description Paragraph */}
              <div className="hero-description">
                <p className="text-lg lg:text-xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {heroContent.description}
                </p>
              </div>

              {/* Features Checklist with Checkmarks */}
              <div className="checklist">
                <ul className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6">
                  {heroContent.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-base lg:text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: feature.color }}
                      >
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" className="text-white">
                          <path d="M1 4.5L4 7.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>


              {/* Call to Action Buttons */}
              <div className="btn-group flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#courses" 
                  className="th-btn inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-sm font-semibold text-white uppercase tracking-wide transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: 'var(--color-primary)'
                  }}
                  aria-label="Get started with online courses"
                >
                  <span>Get Started</span>
                  <IconArrowRight size={16} aria-hidden="true" />
                </a>
                <a 
                  href="#courses" 
                  className="th-btn-outline inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-sm font-semibold text-white uppercase tracking-wide transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: '#374151'
                  }}
                  aria-label="View our courses"
                >
                  <span>Our Courses</span>
                  <IconArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Hero Image Section */}
          <div className="order-1 lg:order-2 lg:col-span-3 flex justify-center lg:justify-end items-end h-full">
            <div className="hero-img-container relative w-full max-w-5xl lg:max-w-7xl xl:max-w-none 2xl:max-w-none mb-0 lg:-mb-8">
              {/* Main Hero Image */}
              <div className="hero-image relative rounded-xl lg:rounded-b-none overflow-hidden w-full">
                {/* Tutor Image */}
                <img 
                  src="/assets/img/hero/tutor-2.png" 
                  alt="Online tutor teaching students" 
                  className="w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] xl:min-h-[800px] object-cover object-center scale-110"
                />
                
                {/* Statistics Counters */}
                <div className="hero-counters">
                  {/* Active Students Counter */}
                  <div 
                    className="hero-counter absolute left-2 bottom-2 lg:left-4 lg:bottom-4 bg-white rounded-full shadow-lg flex items-center gap-2 lg:gap-3 p-2 pr-3 lg:p-3 lg:pr-6"
                    style={{ boxShadow: '0px 4px 32px 0px rgba(170, 179, 198, 0.15)' }}
                  >
                    <div 
                      className="counter-icon w-8 h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <IconUsers size={16} className="lg:w-5 lg:h-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="counter-details">
                      <div 
                        className="counter-number text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold leading-none"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <span style={{ color: 'var(--color-text-primary)' }}>{heroStats.activeStudents.toLocaleString()}</span>+
                      </div>
                      <p 
                        className="counter-text text-xs lg:text-sm xl:text-base font-normal leading-tight"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        Active Students
                      </p>
                    </div>
                  </div>

                  {/* Online Courses Counter */}
                  <div 
                    className="hero-counter absolute right-2 top-2 lg:right-4 lg:top-4 xl:top-6 bg-white rounded-full shadow-lg flex items-center gap-2 lg:gap-3 p-2 pr-3 lg:p-3 lg:pr-6"
                    style={{ boxShadow: '0px 4px 32px 0px rgba(170, 179, 198, 0.15)' }}
                  >
                    <div 
                      className="counter-icon w-8 h-8 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                    >
                      <IconVideo size={16} className="lg:w-5 lg:h-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="counter-details">
                      <div 
                        className="counter-number text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold leading-none"
                        style={{ color: 'var(--color-secondary)' }}
                      >
                        <span style={{ color: 'var(--color-text-primary)' }}>{heroStats.onlineCourses.toLocaleString()}</span>+
                      </div>
                      <p 
                        className="counter-text text-xs lg:text-sm xl:text-base font-normal leading-tight"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        Online Video Courses
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="hero-decorations">
                {/* Background Circle */}
                <div 
                  className="absolute -top-8 lg:-top-12 left-8 lg:left-12 w-72 h-72 lg:w-96 lg:h-96 rounded-full border-8 lg:border-12 -z-10 opacity-20"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'var(--color-primary)'
                  }}
                  aria-hidden="true"
                />

                {/* Dotted Pattern */}
                <div className="absolute -bottom-6 -left-6 opacity-60" aria-hidden="true">
                  <div className="grid grid-cols-6 lg:grid-cols-8 gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Decorative Shapes */}
      <div className="hero-shapes" aria-hidden="true">
        {/* Large Background Shapes */}
        
        {/* Shape 1 - Top Left (Increased Size) */}
        <div className="absolute top-8 lg:top-12 -left-8 lg:-left-12 opacity-60">
          <img 
            src="/assets/img/hero/shape_2_1.png" 
            alt="" 
            className="w-20 h-20 lg:w-32 lg:h-32 xl:w-40 xl:h-40"
          />
        </div>

        {/* Shape 2 - Left Side (Much Larger) */}
        <div 
          className="absolute top-1/4 -left-20 lg:-left-32 hidden sm:block opacity-40"
          style={{ transform: 'rotateZ(180deg) rotateX(180deg)' }}
        >
          <img 
            src="/assets/img/hero/shape_1_2.png" 
            alt="" 
            className="w-96 lg:w-[500px] xl:w-[600px]"
          />
        </div>

        {/* Shape 3 - Top Center (Larger) */}
        <div 
          className="absolute -top-12 left-1/3 hidden sm:block opacity-50"
          style={{ transform: 'rotateZ(-50deg)' }}
        >
          <img 
            src="/assets/img/hero/shape_2_3.png" 
            alt="" 
            className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32"
          />
        </div>

        {/* Shape 4 - Bottom Left (Larger) */}
        <div className="absolute -bottom-16 left-1/4 hidden sm:block opacity-50">
          <img 
            src="/assets/img/hero/shape_2_4.png" 
            alt="" 
            className="w-20 h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
          />
        </div>

        {/* Shape 5 - Top Right (Larger) */}
        <div className="absolute top-4 -right-8 lg:-right-12 hidden xl:block opacity-60">
          <img 
            src="/assets/img/hero/shape_2_2.png" 
            alt="" 
            className="w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40"
          />
        </div>

        {/* Additional Background Elements */}
        
        {/* Large Circular Shape - Top Right Background */}
        <div className="absolute -top-20 -right-20 lg:-top-32 lg:-right-32 opacity-20">
          <img 
            src="/assets/img/hero/shape_2_1.png" 
            alt="" 
            className="w-48 h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80"
            style={{ transform: 'rotate(45deg)' }}
          />
        </div>

        {/* Medium Shape - Bottom Right */}
        <div className="absolute -bottom-8 -right-16 lg:-bottom-12 lg:-right-24 opacity-30">
          <img 
            src="/assets/img/hero/shape_2_3.png" 
            alt="" 
            className="w-20 h-20 lg:w-28 lg:h-28 xl:w-36 xl:h-36"
            style={{ transform: 'rotate(120deg)' }}
          />
        </div>

        {/* Large Wave Shape - Right Side */}
        <div 
          className="absolute top-1/2 -right-24 lg:-right-40 hidden lg:block opacity-25"
          style={{ transform: 'rotateZ(90deg)' }}
        >
          <img 
            src="/assets/img/hero/shape_1_2.png" 
            alt="" 
            className="w-80 lg:w-96 xl:w-[500px]"
          />
        </div>

        {/* Small Scattered Elements */}
        <div className="absolute top-1/3 left-1/5 opacity-40">
          <img 
            src="/assets/img/hero/shape_2_4.png" 
            alt="" 
            className="w-12 h-12 lg:w-16 lg:h-16"
            style={{ transform: 'rotate(30deg)' }}
          />
        </div>

        <div className="absolute bottom-1/3 right-1/4 opacity-35">
          <img 
            src="/assets/img/hero/shape_2_2.png" 
            alt="" 
            className="w-14 h-14 lg:w-18 lg:h-18"
            style={{ transform: 'rotate(-45deg)' }}
          />
        </div>

        {/* Very Large Background Circle - Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 -z-10">
          <img 
            src="/assets/img/hero/shape_2_1.png" 
            alt="" 
            className="w-96 h-96 lg:w-[600px] lg:h-[600px] xl:w-[800px] xl:h-[800px]"
            style={{ transform: 'rotate(15deg)' }}
          />
        </div>

        {/* Additional Medium Elements */}
        <div className="absolute top-20 left-2/3 opacity-30">
          <img 
            src="/assets/img/hero/shape_2_3.png" 
            alt="" 
            className="w-16 h-16 lg:w-20 lg:h-20"
            style={{ transform: 'rotate(75deg)' }}
          />
        </div>

        <div className="absolute bottom-20 left-1/6 opacity-25">
          <img 
            src="/assets/img/hero/shape_2_4.png" 
            alt="" 
            className="w-18 h-18 lg:w-24 lg:h-24"
            style={{ transform: 'rotate(-30deg)' }}
          />
        </div>
      </div>

      {/* Static Ripple Elements */}
      <div className="ripple-elements absolute bottom-0 left-0 opacity-30" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 lg:w-10 lg:h-10 left-6 lg:left-8 -bottom-2 border-2 lg:border-3 rounded-full"
            style={{ 
              borderColor: 'rgba(13, 94, 244, 0.3)',
              backgroundColor: 'transparent',
              transform: `translate3d(-50%, 50%, 0) scale(${1 + i * 0.2})`,
              opacity: 0.8 - i * 0.1
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

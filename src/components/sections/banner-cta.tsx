import { IconBook, IconArrowRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { contentService } from '../../services';

interface BannerCTAProps {
  className?: string;
}

const BannerCTA: React.FC<BannerCTAProps> = ({ className = '' }) => {
  const [ctaContent, setCtaContent] = useState({
    badge: 'Join In Your Favorite Courses Today',
    title: 'Courses Taught By Tutors Around The World',
    description: 'Build skills with courses, certificates, and degrees online from world-class universities and companies.',
    buttonText: 'Apply Now',
    buttonLink: '/courses'
  });

  useEffect(() => {
    const fetchCTAContent = async () => {
      try {
        // In a real app, you'd have a specific CTA content endpoint
        const content = await contentService.getPageContent('banner-cta');
        if (content && 'badge' in content) {
          setCtaContent(content as typeof ctaContent);
        }
      } catch (error) {
        console.error('Error fetching CTA content:', error);
        // Keep default values on error
      }
    };

    fetchCTAContent();
  }, []);
  return (
    <section 
      className={`relative overflow-hidden bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: 'url("/assets/img/banner/banner-bg.svg")'
      }}
    >


      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-end pt-12 sm:pt-16 lg:pt-20 pb-0">
            
            {/* Content Section */}
            <div className="text-center lg:text-left pb-8 lg:pb-12">
              <div className="space-y-4 sm:space-y-6">
                
                {/* Badge */}
                <div 
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide"
                  style={{ color: 'var(--color-primary-300)' }}
                >
                  <IconBook size={16} style={{ color: 'var(--color-primary-300)' }} />
                  <span>{ctaContent.badge}</span>
                </div>

                {/* Main Heading */}
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight"
                  style={{ color: '#ffffff' }}
                >
                  {ctaContent.title}
                </h2>

                {/* Description */}
                <p 
                  className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ color: '#ffffff' }}
                >
                  {ctaContent.description}
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <a 
                    href={ctaContent.buttonLink} 
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                  >
                    <span>{ctaContent.buttonText}</span>
                    <IconArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Image Section - Desktop Only */}
            <div className="hidden lg:block relative">
              <div className="absolute bottom-0 right-0 w-full flex justify-end">
                <div className="relative" style={{ transform: 'translateY(60px)' }}>
                  <img 
                    src="/assets/img/banner/girl-banner.png" 
                    alt="Online learning illustration"
                    className="w-full max-w-xl xl:max-w-3xl 2xl:max-w-4xl h-auto object-contain"
                  />
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCTA;
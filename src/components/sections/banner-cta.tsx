import { IconBook, IconArrowRight } from '@tabler/icons-react';

interface BannerCTAProps {
  className?: string;
}

const BannerCTA: React.FC<BannerCTAProps> = ({ className = '' }) => {
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
                  <span>Join In Your Favorite Courses Today</span>
                </div>

                {/* Main Heading */}
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight"
                  style={{ color: '#ffffff' }}
                >
                  Courses Taught By{' '}
                  <span style={{ color: 'var(--color-primary-300)' }}>Tutors</span>{' '}
                  Around The World
                </h2>

                {/* Description */}
                <p 
                  className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ color: '#ffffff' }}
                >
                  Build skills with courses, certificates, and degrees online from world-class universities and companies.
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <a 
                    href="/courses" 
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
                  >
                    <span>Apply Now</span>
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
import { Link } from 'react-router';
import { IconBook, IconArrowRight, IconCheck } from '@tabler/icons-react';

export default function VideoSection() {
  return (
    <section className="video-area overflow-hidden py-16 lg:py-24 bg-slate-50 relative">
      {/* Decorative Shape */}
      <div className="absolute -right-[35%] -top-[40%] hidden lg:block animate-bounce-slow">
        <img 
          src="/assets/img/normal/video-1_shape1.png" 
          alt="Decorative Shape"
          className="w-auto h-auto opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Video Section - Right on Desktop */}
          <div className="lg:col-span-7 lg:order-2">
            <div className="lg:ml-8 mb-8 lg:mb-0">
              {/* Video Wrap */}
              <div className="video-wrap relative mb-8 bg-white rounded-xl p-6 sm:p-8 lg:p-12 shadow-[0px_4px_50px_0px_rgba(179,193,211,0.30)]">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="/assets/img/normal/video2.jpg" 
                    alt="Video Class Interface"
                    className="w-full h-64 sm:h-80 lg:h-96 xl:h-[490px] object-cover rounded-lg"
                  />
                  
                  {/* Video Control Buttons Overlay */}
                  <div className="absolute left-1/2 bottom-12 sm:bottom-16 transform -translate-x-1/2 flex items-center gap-4 sm:gap-5">
                    <button className="w-12 h-12 sm:w-15 sm:h-15 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-gray-600 hover:text-gray-800">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                      </svg>
                    </button>
                    
                    <button className="w-12 h-12 sm:w-15 sm:h-15 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-gray-600 hover:text-gray-800">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
                      </svg>
                    </button>
                    
                    <button className="w-12 h-12 sm:w-15 sm:h-15 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                    </button>
                    
                    <button className="w-12 h-12 sm:w-15 sm:h-15 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-gray-600 hover:text-gray-800">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl lg:text-2xl font-bold text-center text-gray-800">
                Video Class Interface
              </h3>
            </div>
          </div>

          {/* Content Section - Left on Desktop */}
          <div className="lg:col-span-5 lg:order-1">
            <div className="space-y-8">
              {/* Title Area */}
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-medium mb-4">
                  <IconBook size={20} />
                  <span>Join Your Live Tutoring Session Today</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  STEM Learning Designed For Real Success
                </h2>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Connect with expert STEM tutors through our interactive platform. Get personalized help in mathematics, physics, chemistry, and engineering from PhD holders and experienced educators.
                </p>

                {/* Checklist */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconCheck size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Interactive Online Learning Platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconCheck size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">95% Student Success Rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconCheck size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Expert PhD & Professional Tutors</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  <Link 
                    to="/courses" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-sm transition-colors duration-200"
                  >
                    Explore Our Courses
                    <IconArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Student Count */}
              <div className="student-count">
                <h5 className="text-lg font-semibold text-gray-900 mb-3">
                  <span className="text-blue-600 text-xl font-bold">56k+</span> Enrolled Students
                </h5>
                <div className="flex items-center -space-x-2">
                  <img 
                    src="/assets/img/normal/student-group_2_1.png" 
                    alt="Student avatars"
                    className="w-auto h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

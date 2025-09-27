import React, { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconCheck, 
  IconArrowRight
} from '@tabler/icons-react';
import { contentService } from '../../services';

const AboutUs: React.FC = () => {
  const [aboutContent, setAboutContent] = useState({
    title: 'Dive into our Online Courses and Ignite Your Learning!',
    subtitle: 'Get to Know About Us',
    description: 'Transform your learning experience with our comprehensive online platform. We provide expert-led courses, interactive learning materials, and personalized support to help you achieve your educational goals.',
    features: [
      'Access to 100K+ high-quality online courses',
      'Learn from industry experts and certified instructors',
      'Gain job-ready skills with hands-on projects'
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const content = await contentService.getAboutContent();
        setAboutContent(content);
      } catch (error) {
        console.error('Error fetching about content:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden py-12 sm:py-16 lg:py-20 bg-gray-50 relative" id="about-sec">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section 
      className="overflow-hidden py-12 sm:py-16 lg:py-20 bg-gray-50 relative"
      id="about-sec"
    >
      {/* Background Shapes */}
      <div className="absolute right-0 bottom-1/4 z-0 hidden lg:block">
        <img 
          src="/assets/img/about/about_2_shape1.png" 
          alt="Shape 1" 
          className="w-auto h-auto"
        />
      </div>
      <div className="absolute right-20 bottom-1/4 z-0 hidden lg:block">
        <img 
          src="/assets/img/about/about_1_shape1.png" 
          alt="Shape 2" 
          className="w-auto h-auto"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Images */}
          <div className="relative mb-8 sm:mb-12 xl:mb-0 order-2 xl:order-1">
            <div className="relative max-w-lg mx-auto xl:mx-0">
              {/* Main Large Image */}
              <div className="relative">
                <div className="bg-gray-300 rounded-lg w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-600">
                  714X447
                </div>
              </div>
              
              {/* Secondary Smaller Image */}
              <div className="absolute right-0 bottom-0 transform -translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 lg:translate-x-10 lg:translate-y-10 z-10">
                <div className="relative">
                  <div className="bg-gray-400 rounded-lg w-36 h-24 sm:w-52 sm:h-32 lg:w-64 lg:h-40 flex items-center justify-center text-sm sm:text-2xl lg:text-3xl font-bold text-gray-700 shadow-lg">
                    <span className="text-center">340X265</span>
                  </div>
                  {/* White background effect */}
                  <div className="absolute -left-2 -top-2 sm:-left-3 sm:-top-3 lg:-left-4 lg:-top-4 bg-white rounded-lg w-full h-full -z-10"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side - Content */}
          <div className="xl:pl-8 order-1 xl:order-2 text-center xl:text-left">
            {/* Title Area */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm uppercase tracking-wide mb-4">
                <IconBook size={16} />
                {aboutContent.subtitle}
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {aboutContent.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto xl:mx-0">
              {aboutContent.description}
            </p>

            {/* Features List */}
            <div className="mb-8 sm:mb-10">
              <ul className="space-y-3 sm:space-y-4 max-w-2xl mx-auto xl:mx-0">
                {aboutContent.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-left">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center mt-0.5">
                      <IconCheck size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center xl:justify-start">
              <a 
                href="/about" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-sm font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg group text-sm sm:text-base"
              >
                ABOUT MORE
                <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutUs;

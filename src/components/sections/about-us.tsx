import React from 'react';
import { 
  IconBook, 
  IconCheck, 
  IconArrowRight
} from '@tabler/icons-react';

const AboutUs: React.FC = () => {
  return (
    <section 
      className="overflow-hidden py-20 bg-gray-50 relative"
      id="about-sec"
    >
      {/* Background Shapes */}
      <div className="absolute right-0 bottom-1/4 z-0 hidden md:block">
        <img 
          src="/assets/img/about/about_2_shape1.png" 
          alt="Shape 1" 
          className="w-auto h-auto"
        />
      </div>
      <div className="absolute right-20 bottom-1/4 z-0 hidden md:block">
        <img 
          src="/assets/img/about/about_1_shape1.png" 
          alt="Shape 2" 
          className="w-auto h-auto"
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Images */}
          <div className="relative mb-12 xl:mb-0">
            <div className="relative">
              {/* Main Large Image */}
              <div className="relative">
                <div className="bg-gray-300 rounded-lg w-full h-96 flex items-center justify-center text-7xl font-bold text-gray-600">
                  714X447
                </div>
              </div>
              
              {/* Secondary Smaller Image */}
              <div className="absolute right-0 bottom-0 transform translate-x-10 translate-y-10 z-10">
                <div className="relative">
                  <div className="bg-gray-400 rounded-lg w-64 h-40 flex items-center justify-center text-3xl font-bold text-gray-700 shadow-lg">
                    340X265
                  </div>
                  {/* White background effect */}
                  <div className="absolute -left-4 -top-4 bg-white rounded-lg w-full h-full -z-10"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side - Content */}
          <div className="xl:pl-8">
            {/* Title Area */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm uppercase tracking-wide mb-4">
                <IconBook size={16} />
                Get to Know About Us
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Dive into our Online Courses and Ignite Your Learning!
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Collaboratively simplify user friendly networks after principle centered coordinate 
              effective methods of empowerment distributed niche markets pursue market positioning 
              web-readiness after resource sucking applications.
            </p>

            {/* Features List */}
            <div className="mb-10">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center mt-0.5">
                    <IconCheck size={12} className="text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Dramatically re-engineer value added systems via mission
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center mt-0.5">
                    <IconCheck size={12} className="text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Access more than 100K online courses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center mt-0.5">
                    <IconCheck size={12} className="text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Learn the high-impact skills that top companies want
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div>
              <a 
                href="/about" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg group text-sm"
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

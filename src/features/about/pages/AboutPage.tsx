import { Link } from 'react-router';
import { IconUsers, IconBook, IconCertificate, IconTrendingUp, IconTarget, IconEye, IconHeart, IconClock, IconWorld, IconStar, IconArrowRight } from '@tabler/icons-react';

const AboutPage = () => {
  const stats = [
    { value: '16,500+', label: 'Active Students', icon: IconUsers },
    { value: '7,500+', label: 'Online Courses', icon: IconBook },
    { value: '500+', label: 'Expert Tutors', icon: IconCertificate },
    { value: '95%', label: 'Success Rate', icon: IconTrendingUp },
  ];

  const values = [
    {
      icon: IconTarget,
      title: 'Our Mission',
      description: 'To democratize education by providing accessible, high-quality learning experiences that empower students to achieve their goals and unlock their full potential.',
    },
    {
      icon: IconEye,
      title: 'Our Vision',
      description: 'To become the world\'s leading online education platform, fostering a global community of lifelong learners and connecting them with exceptional educators.',
    },
    {
      icon: IconHeart,
      title: 'Our Values',
      description: 'We believe in excellence, integrity, innovation, and inclusivity. Every decision we make is guided by our commitment to student success and educational impact.',
    }
  ];

  const timeline = [
    { year: '2020', title: 'Foundation', description: 'AskYourTutor was founded with a vision to revolutionize online education.', icon: IconClock },
    { year: '2021', title: 'Growth', description: 'Reached 5,000 students and partnered with 100+ expert tutors worldwide.', icon: IconTrendingUp },
    { year: '2022', title: 'Expansion', description: 'Launched 3,000+ courses across 50+ subjects and disciplines.', icon: IconWorld },
    { year: '2023', title: 'Innovation', description: 'Introduced AI-powered learning paths and interactive study tools.', icon: IconStar },
    { year: '2024', title: 'Excellence', description: 'Achieved 95% student success rate and 16,500+ active learners.', icon: IconCertificate },
  ];

  const features = [
    { title: 'Expert Instructors', description: 'Learn from industry professionals and certified educators', icon: IconCertificate },
    { title: 'Flexible Learning', description: 'Study at your own pace, anytime, anywhere', icon: IconClock },
    { title: 'Global Community', description: 'Connect with students and tutors worldwide', icon: IconWorld },
    { title: 'Quality Content', description: 'Access high-quality, up-to-date course materials', icon: IconStar },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black py-20 sm:py-28 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold !text-white leading-tight tracking-tight">
              About AskYourTutor
            </h1>
            <p className="text-xl sm:text-2xl !text-gray-400 max-w-2xl mx-auto font-light">
              We're on a mission to make quality education accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <Icon className="w-8 h-8 mx-auto text-black" strokeWidth={1.5} />
                  <div className="text-4xl sm:text-5xl font-bold text-black tracking-tight">{stat.value}</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 tracking-tight">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                From humble beginnings to a global education platform
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p className="border-l-2 border-black pl-6 py-2">
                  AskYourTutor was born from a simple belief: everyone deserves access to quality education, 
                  regardless of their location or circumstances. What started as a small platform connecting 
                  students with tutors has grown into a thriving community of learners and educators.
                </p>
                <p className="border-l-2 border-black pl-6 py-2">
                  Today, we serve thousands of students worldwide, offering courses across dozens of subjects. 
                  Our platform combines cutting-edge technology with the human touch of expert tutors, creating 
                  a learning experience that's both effective and engaging.
                </p>
              </div>
              <div className="space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p className="border-l-2 border-black pl-6 py-2">
                  We're more than just an education platform – we're a community dedicated to lifelong learning, 
                  personal growth, and academic excellence. Every day, we work to break down barriers to education 
                  and help students achieve their dreams.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="border border-gray-200 p-4 hover:border-black transition-colors">
                        <Icon className="w-6 h-6 mb-3 text-black" strokeWidth={1.5} />
                        <h4 className="font-semibold text-sm text-black mb-1 uppercase tracking-wider">{feature.title}</h4>
                        <p className="text-xs text-gray-600 font-light leading-relaxed">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 tracking-tight">What Drives Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Our core principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="bg-white p-8 border border-gray-200 hover:border-black transition-all duration-300 group">
                    <div className="w-12 h-12 border border-black flex items-center justify-center mb-6 group-hover:bg-black transition-colors">
                      <Icon className="w-6 h-6 text-black group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 uppercase tracking-wider">{value.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold !text-white mb-4 tracking-tight">Our Journey</h2>
              <p className="text-lg !text-gray-400 max-w-2xl mx-auto font-light">
                Milestones that shaped our story
              </p>
            </div>

            <div className="hidden lg:grid lg:grid-cols-5 gap-6">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative">
                    <div className="bg-white border border-gray-800 p-6 hover:bg-gray-50 transition-colors h-full">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-10 h-10 border border-black flex items-center justify-center">
                          <Icon className="w-5 h-5 text-black" strokeWidth={1.5} />
                        </div>
                        <div className="text-2xl font-bold text-black tracking-tight">{item.year}</div>
                        <h3 className="text-base font-bold text-black uppercase tracking-wider">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-light">{item.description}</p>
                      </div>
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <IconArrowRight className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lg:hidden space-y-6">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-white border border-gray-800 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-gray-800 p-6">
                      <div className="text-xl font-bold text-black mb-2 tracking-tight">{item.year}</div>
                      <h3 className="text-base font-bold text-black mb-3 uppercase tracking-wider">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed font-light">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black tracking-tight">
                Ready to Start Learning?
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
                Join thousands of students already learning with us. Start your journey today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/courses" 
                className="inline-flex items-center justify-center px-10 py-5 bg-black !text-white text-base font-medium hover:bg-gray-900 transition-colors gap-3 uppercase tracking-wider"
              >
                Browse Courses
                <IconArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <Link 
                to="/teachers" 
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-black text-black text-base font-medium hover:bg-black hover:!text-white transition-colors gap-3 uppercase tracking-wider"
              >
                Meet Our Tutors
                <IconArrowRight className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

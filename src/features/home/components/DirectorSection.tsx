import { IconBook, IconPhone, IconMapPin, IconBrandLinkedin, IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';

export default function DirectorSection() {
  return (
    <section className="director-section py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Decorative Shapes */}
      <div className="absolute right-0 top-1/4 hidden lg:block opacity-60">
        <img 
          src="/assets/img/team/team-shape_1_2.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>
      
      <div className="absolute left-[3%] bottom-[8%] hidden md:block opacity-50">
        <img 
          src="/assets/img/team/team-shape_1_3.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Area */}
        <div className="title-area text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm uppercase tracking-wide mb-3 sm:mb-4">
            <IconBook size={16} />
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            About Our Director
          </h2>
        </div>

        {/* Director Content Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Director Image */}
              <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-xs">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-md">
                    <img 
                      src="/assets/img/director/erwin-weerawardana.jpeg"
                      alt="Dr. Erwin Weerawardana"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Director Info */}
              <div className="md:col-span-3 p-6 sm:p-8">
                {/* Name and Title */}
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Erwin Anuruddhika Weerawardhana
                  </h3>
                  <p className="text-base sm:text-lg text-blue-600 font-semibold mb-2">
                    PhD, MS, MBA(Cand), BS
                  </p>
                  <p className="text-sm sm:text-base text-gray-700">
                    Adjunct Professor in Chemistry, Biochemistry and Medicinal Chemistry
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 sm:space-y-4 mb-6 pb-6 border-b border-gray-200">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <IconPhone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Phone</p>
                      <a href="tel:+13128263542" className="text-sm text-gray-900 hover:text-blue-600 transition-colors font-medium">
                        +1 (312) 826-3542
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <IconMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Address</p>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        6429 N Campbell Ave, Apt 1<br />
                        Chicago, IL 60645, USA
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-3 uppercase tracking-wide">Connect</p>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* LinkedIn */}
                    <a 
                      href="https://www.linkedin.com/in/erwin-weerawardana-4b798573/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-sm"
                      title="LinkedIn Profile"
                    >
                      <IconBrandLinkedin className="w-5 h-5" />
                    </a>

                    {/* Google Scholar */}
                    <a 
                      href="https://scholar.google.com/citations?hl=en&user=3xSmG6oAAAAJ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-sm"
                      title="Google Scholar Profile"
                    >
                      <IconBrandGoogle className="w-5 h-5" />
                    </a>

                    {/* Facebook */}
                    <a 
                      href="https://www.facebook.com/share/1ACLXeUVvN/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-sm"
                      title="Facebook Profile"
                    >
                      <IconBrandFacebook className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white px-6 sm:px-8 py-6 sm:py-8 border-t border-gray-200">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">About Dr. Weerawardana</h4>
              <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                  Dr. Erwin Anuruddhika Weerawardana brings extensive academic and professional expertise to his role as an Adjunct Professor. With advanced degrees including a PhD, MS, and pursuing an MBA, Dr. Weerawardana specializes in Chemistry, Biochemistry, and Medicinal Chemistry.
                </p>
                <p>
                  His multidisciplinary background and commitment to education make him an invaluable resource for students seeking to deepen their understanding of chemistry and related scientific disciplines. Dr. Weerawardana is actively involved in research and maintains strong connections with the academic and professional community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

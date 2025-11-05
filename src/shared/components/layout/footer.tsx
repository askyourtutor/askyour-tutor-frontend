import { 
  IconPhone, 
  IconMail, 
  IconMapPin, 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandYoutube, 
  IconBrandInstagram,
  IconSchool,
  IconArrowRight,
  IconClock,
  IconSend
} from '@tabler/icons-react';
import { Link } from 'react-router';

const Footer: React.FC = () => {
  return (
    <footer className="th-footer footer-layout-1 bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="footer-top py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Company Info - Column 1 */}
            <div className="footer-widget">
              {/* Logo */}
              <div className="footer-logo mb-4">
                <Link to="/" className="flex items-center space-x-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <IconSchool size={22} />
                  </div>
                  <span className="text-xl font-bold">ASKYOURTUTOR</span>
                </Link>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Empowering students worldwide with personalized online tutoring.
              </p>
              
              {/* Contact Info */}
              <div className="footer-contact space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-300">
                  <IconPhone size={16} className="text-blue-400 flex-shrink-0" />
                  <a href="tel:+11156456825" className="hover:text-blue-400 transition-colors">
                    +111 (564) 568 25
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <IconMail size={16} className="text-blue-400 flex-shrink-0" />
                  <a href="mailto:info@askyourtutor.com" className="hover:text-blue-400 transition-colors break-all">
                    info@askyourtutor.com
                  </a>
                </div>
                <div className="flex items-start space-x-2 text-gray-300">
                  <IconMapPin size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>123 Education Street, LC 12345</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <IconClock size={16} className="text-blue-400 flex-shrink-0" />
                  <span>Mon - Sat: 8AM - 10PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links - Column 2 */}
            <div className="footer-widget">
              <h4 className="footer-title text-lg font-semibold mb-4 relative">
                Quick Links
                <span 
                  className="absolute bottom-0 left-0 w-10 h-0.5 mt-1.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></span>
              </h4>
              <ul className="footer-menu space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">About Us</span>
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">All Courses</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tutors" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Our Tutors</span>
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Pricing Plans</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Courses - Column 3 */}
            <div className="footer-widget">
              <h4 className="footer-title text-lg font-semibold mb-4 relative">
                Popular Subjects
                <span 
                  className="absolute bottom-0 left-0 w-10 h-0.5 mt-1.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></span>
              </h4>
              <ul className="footer-menu space-y-2 text-sm">
                <li>
                  <Link to="/subjects/mathematics" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Mathematics</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/science" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Science</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/english" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">English Language</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/programming" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Programming</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/business" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Business Studies</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/test-prep" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={12} className="mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Test Preparation</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter - Column 4 */}
            <div className="footer-widget">
              <h4 className="footer-title text-lg font-semibold mb-4 relative">
                Stay Updated
                <span 
                  className="absolute bottom-0 left-0 w-10 h-0.5 mt-1.5"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></span>
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe for updates and study tips.
              </p>
              
              {/* Newsletter Form */}
              <form className="newsletter-form mb-4">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 pr-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-gray-750 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <IconSend size={14} />
                  </button>
                </div>
              </form>

              {/* Social Media Links */}
              <div className="footer-social">
                <h5 className="text-base font-medium mb-3">Follow Us</h5>
                <div className="flex items-center space-x-2">
                  <a 
                    href="https://www.facebook.com/" 
                    className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label="Facebook"
                  >
                    <IconBrandFacebook size={16} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.twitter.com/" 
                    className="w-9 h-9 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label="Twitter"
                  >
                    <IconBrandTwitter size={16} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/" 
                    className="w-9 h-9 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label="LinkedIn"
                  >
                    <IconBrandLinkedin size={16} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.youtube.com/" 
                    className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label="YouTube"
                  >
                    <IconBrandYoutube size={16} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.instagram.com/" 
                    className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors group"
                    aria-label="Instagram"
                  >
                    <IconBrandInstagram size={16} className="text-gray-400 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom py-4 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-sm">
            {/* Copyright */}
            <div className="copyright text-gray-400 text-center md:text-left">
              <p>© {new Date().getFullYear()} AskYourTutor. All rights reserved.</p>
            </div>

            {/* Footer Links */}
            <div className="footer-links">
              <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
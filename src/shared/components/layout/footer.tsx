
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
      <div className="footer-top py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info - Column 1 */}
            <div className="footer-widget">
              {/* Logo */}
              <div className="footer-logo mb-6">
                <Link to="/" className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <IconSchool size={28} />
                  </div>
                  <span className="text-2xl font-bold">ASKYOURTUTOR</span>
                </Link>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering students worldwide with personalized online tutoring. 
                Connect with expert tutors and unlock your academic potential through 
                our innovative learning platform.
              </p>
              
              {/* Contact Info */}
              <div className="footer-contact space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <IconPhone size={18} className="text-blue-400 flex-shrink-0" />
                  <a href="tel:+11156456825" className="hover:text-blue-400 transition-colors">
                    +111 (564) 568 25
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <IconMail size={18} className="text-blue-400 flex-shrink-0" />
                  <a href="mailto:info@askyourtutor.com" className="hover:text-blue-400 transition-colors">
                    info@askyourtutor.com
                  </a>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <IconMapPin size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>123 Education Street, Learning City, LC 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <IconClock size={18} className="text-blue-400 flex-shrink-0" />
                  <span>Mon - Sat: 8:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links - Column 2 */}
            <div className="footer-widget">
              <h4 className="footer-title text-xl font-semibold mb-6 relative">
                Quick Links
                <span 
                  className="absolute bottom-0 left-0 w-12 h-0.5 mt-2"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></span>
              </h4>
              <ul className="footer-menu space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">About Us</span>
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">All Courses</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tutors" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Our Tutors</span>
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Pricing Plans</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Courses - Column 3 */}
            <div className="footer-widget">
              <h4 className="footer-title text-xl font-semibold mb-6 relative">
                Popular Subjects
                <span 
                  className="absolute bottom-0 left-0 w-12 h-0.5 mt-2"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></span>
              </h4>
              <ul className="footer-menu space-y-3">
                <li>
                  <Link to="/subjects/mathematics" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Mathematics</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/science" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Science</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/english" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">English Language</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/programming" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Programming</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/business" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Business Studies</span>
                  </Link>
                </li>
                <li>
                  <Link to="/subjects/test-prep" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center group">
                    <IconArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:pl-1 transition-all">Test Preparation</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter - Column 4 */}
            <div className="footer-widget">
              <h4 className="footer-title text-xl font-semibold mb-6 relative">
                Stay Updated
                <span 
                  className="absolute bottom-0 left-0 w-12 h-0.5 mt-2"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></span>
              </h4>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter for the latest updates, study tips, and exclusive offers.
              </p>
              
              {/* Newsletter Form */}
              <form className="newsletter-form mb-6">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-gray-750 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <IconSend size={16} />
                  </button>
                </div>
              </form>

              {/* Social Media Links */}
              <div className="footer-social">
                <h5 className="text-lg font-medium mb-4">Follow Us</h5>
                <div className="flex items-center space-x-3">
                  <a 
                    href="https://www.facebook.com/" 
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <IconBrandFacebook size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.twitter.com/" 
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <IconBrandTwitter size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/" 
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <IconBrandLinkedin size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.youtube.com/" 
                    className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <IconBrandYoutube size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                  <a 
                    href="https://www.instagram.com/" 
                    className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <IconBrandInstagram size={18} className="text-gray-400 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="copyright text-gray-400 text-center md:text-left">
              <p>© {new Date().getFullYear()} AskYourTutor. All rights reserved. Built with education.</p>
            </div>

            {/* Footer Links */}
            <div className="footer-links">
              <ul className="flex items-center space-x-6 text-sm">
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
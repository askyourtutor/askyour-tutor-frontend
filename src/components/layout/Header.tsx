
import { 
  IconPhone, 
  IconMail, 
  IconClock, 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandYoutube, 
  IconBrandSkype,
  IconUser,
  IconChevronDown,
  IconSearch,
  IconShoppingCart,
  IconHeart,
  IconArrowRight,
  IconMenu2,
  IconSchool,
  IconGrid3x3,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <header className="th-header header-layout-default relative z-40">
      {/* Logo Background Half */}
      <div 
        className="logo-bg-half absolute h-7 w-64 xl:w-80 2xl:w-96 rounded-tr-[50px] top-4 left-0 z-10 xl:block hidden"
        style={{ backgroundColor: 'var(--color-primary)' }}
      ></div>
      
      {/* Header Top */}
      <div 
        className="header-top relative z-30 px-4 sm:px-6 xl:pl-[300px] xl:pr-[88px] py-2"
        style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: 'white'
        }}
      >
        {/* Background overlay for rounded corner effect */}
        <div 
          className="absolute left-0 top-0 h-full rounded-br-[50px] z-[-1] xl:block hidden"
          style={{ 
            backgroundColor: 'var(--color-text-primary)',
            width: 'calc(100% - 267px)'
          }}
        ></div>
        
        <div className="container-fluid px-0">
          <div className="flex justify-between items-center">
            {/* Left side - Contact info (hidden on mobile) */}
            <div className="hidden lg:block">
              <div className="header-links">
                <ul className="flex items-center space-x-6 text-sm">
                  <li className="flex items-center space-x-2 relative pr-5 mr-4">
                    <IconPhone size={16} />
                    <a href="tel:+11156456825" className="hover:opacity-80 transition-opacity">+111 (564) 568 25</a>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-white bg-opacity-20"></div>
                  </li>
                  <li className="hidden xl:flex items-center space-x-2 relative pr-5 mr-4">
                    <IconMail size={16} />
                    <a href="mailto:info@askyourtutor.com" className="hover:opacity-80 transition-opacity">info@askyourtutor.com</a>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-white bg-opacity-20"></div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <IconClock size={16} />
                    <span>Mon - Sat: 8:00 - 15:00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side - Social links and mobile toggle */}
            <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto">
              <div className="header-links header-right">
                <ul className="flex items-center space-x-4">
                  <li>
                    <div className="header-social flex items-center space-x-3">
                      <span className="social-title text-xs sm:text-sm font-normal">Follow Us:</span>
                      <div className="flex items-center space-x-3">
                        <a href="https://www.facebook.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandFacebook size={14} />
                        </a>
                        <a href="https://www.twitter.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandTwitter size={14} />
                        </a>
                        <a href="https://www.linkedin.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandLinkedin size={14} />
                        </a>
                        <a href="https://www.youtube.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandYoutube size={14} />
                        </a>
                        <a href="https://www.instagram.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandSkype size={14} />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="hidden lg:flex items-center space-x-3">
                    <IconUser size={16} />
                    <div className="flex items-center space-x-2">
                      <Link to="/login" className="hover:opacity-60 transition-opacity">Login</Link>
                      <span className="text-white/40">/</span>
                      <Link to="/register" className="hover:opacity-60 transition-opacity">Register</Link>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Mobile Menu Toggle - In Blue Header */}
              <button
                type="button"
                className="th-menu-toggle block lg:hidden p-2 text-white hover:opacity-80 transition-opacity ml-4"
                aria-label="Toggle mobile menu"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <IconX size={20} />
                ) : (
                  <IconMenu2 size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Wrapper */}
      <div className="sticky-wrapper">
        {/* Main Menu Area */}
        <div 
          className="menu-area bg-white relative z-20 px-4 sm:px-6 xl:pl-[30px] xl:pr-[88px]"
        >
          <div className="container-fluid px-0">
            <div className="flex items-center justify-between w-full">
              {/* Logo */}
              <div className="header-logo py-3 lg:py-5 -mt-4 lg:-mt-7 xl:mt-0">
                <Link to="/" className="flex items-center space-x-2 lg:space-x-3">
                  <div 
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <IconSchool size={24} className="lg:w-7 lg:h-7" />
                  </div>
                  <span 
                    className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 xl:text-white"
                  >
                    ASKYOURTUTOR
                  </span>
                </Link>
              </div>

              {/* Main Navigation (Desktop) */}
              <nav className="main-menu hidden lg:inline-block ml-15">
                <ul className="flex items-center">
                  <li className="menu-item-has-children relative group mx-3">
                    <Link to="/" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-8 uppercase text-base">
                      <span>Home</span>
                    </Link>
                  </li>
                  <li className="menu-item-has-children relative group mx-3">
                    <a href="#" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-8 uppercase text-base">
                      <span>Courses</span>
                    </a>
                  </li>
                  <li className="menu-item-has-children relative group mx-3">
                    <a href="#" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-8 uppercase text-base">
                      <span>Teachers</span>
                    </a>
                  </li>
                  <li className="menu-item-has-children relative group mx-3">
                    <a href="#" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-8 uppercase text-base">
                      <span>Pages</span>
                    </a>
                  </li>
                  <li className="menu-item-has-children relative group mx-3">
                    <a href="#" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-8 uppercase text-base">
                      <span>Blog</span>
                    </a>
                  </li>
                  <li className="mx-3">
                    <a href="#" className="font-medium text-white hover:opacity-80 transition-colors py-8 uppercase text-base">
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Right Section - Header Actions */}
              <div className="hidden lg:block">
                <div className="flex items-center">
                  <div className="header-button flex items-center space-x-4 h-full">
                    {/* Categories Menu with Search */}
                    <div className="category-menu-wrap mr-3 lg:mr-5 relative flex border border-gray-300 rounded-md">
                      <a 
                        className="menu-expand flex items-center space-x-2 px-3 lg:px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-r border-gray-300 min-w-[120px] lg:min-w-[160px]" 
                        href="#"
                      >
                        <IconGrid3x3 size={16} className="lg:w-[18px] lg:h-[18px]" />
                        <span className="font-normal text-sm lg:text-base hidden xl:inline">Categories</span>
                        <IconChevronDown size={14} className="lg:w-4 lg:h-4 ml-auto" />
                      </a>
                      
                      {/* Search Form */}
                      <form className="search-form flex items-center">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-32 lg:w-48 xl:w-64 px-3 lg:px-4 py-3 border-0 bg-transparent focus:outline-none text-gray-600 placeholder-gray-400 text-sm lg:text-base"
                        />
                        <button 
                          type="submit" 
                          className="px-3 lg:px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors bg-transparent border-0"
                        >
                          <IconSearch size={16} className="lg:w-[18px] lg:h-[18px]" />
                        </button>
                      </form>
                    </div>

                    {/* Wishlist */}
                    <a 
                      href="#" 
                      className="icon-btn relative w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                    >
                      <IconHeart size={16} className="lg:w-5 lg:h-5" />
                      <span 
                        className="badge absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        3
                      </span>
                    </a>

                    {/* Shopping Cart */}
                    <button 
                      type="button" 
                      className="icon-btn relative w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                    >
                      <IconShoppingCart size={16} className="lg:w-5 lg:h-5" />
                      <span 
                        className="badge absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        5
                      </span>
                    </button>

                    {/* Contact Us Button */}
                    <a 
                      href="#" 
                      className="th-btn ml-3 lg:ml-5 px-4 lg:px-7 py-3 lg:py-4 rounded-lg font-semibold text-white hover:opacity-90 transition-all flex items-center space-x-2 text-sm lg:text-base"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <span className="hidden xl:inline">Contact Us</span>
                      <span className="xl:hidden">Contact</span>
                      <IconArrowRight size={14} className="lg:w-4 lg:h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logo Background (hidden on mobile/tablet to avoid overlap) */}
          <div 
            className="logo-bg hidden xl:block absolute h-full w-80 2xl:w-96 bottom-0 left-0 z-[-1]"
            style={{ backgroundColor: 'var(--color-primary)' }}
          ></div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu lg:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}>
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form className="search-form flex border border-gray-300 rounded-lg overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Search For Course..." 
                  className="flex-1 px-4 py-3 border-0 bg-transparent focus:outline-none text-gray-600 placeholder-gray-400"
                />
                <button 
                  type="submit" 
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors bg-gray-50"
                >
                  <IconSearch size={18} />
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="mobile-nav mb-4">
              <ul className="space-y-2">
                <li>
                  <Link to="/" onClick={toggleMobileMenu} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                    Teachers
                  </a>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                    Pages
                  </a>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Actions */}
            <div className="mobile-actions flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {/* Mobile Wishlist */}
                <a 
                  href="#" 
                  className="icon-btn relative w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                >
                  <IconHeart size={18} />
                  <span 
                    className="badge absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    3
                  </span>
                </a>

                {/* Mobile Shopping Cart */}
                <button 
                  type="button" 
                  className="icon-btn relative w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                >
                  <IconShoppingCart size={18} />
                  <span 
                    className="badge absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    5
                  </span>
                </button>
              </div>

              {/* Mobile Login/Register */}
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <IconUser size={18} />
                  <span className="font-medium">Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


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
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';
import { savedCoursesService } from '../../services/savedCoursesService';
import { featureFlags } from '../../utils/featureFlags';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const { user, logout } = useAuth();
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close user dropdown on outside click or Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (userMenuRef.current && userBtnRef.current) {
        if (!userMenuRef.current.contains(target) && !userBtnRef.current.contains(target)) {
          setUserMenuOpen(false);
        }
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    const onScrollResize = () => {
      if (!userBtnRef.current) return;
      const rect = userBtnRef.current.getBoundingClientRect();
      const width = 224; // w-56
      const gap = 8;
      const left = Math.min(window.innerWidth - width - gap, Math.max(gap, rect.right - width));
      const top = rect.bottom + gap;
      setMenuPos({ top, left });
    };
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    onScrollResize();
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [userMenuOpen]);

  // Load saved courses count for current user
  useEffect(() => {
    let cancelled = false;
    if (!user) { 
      setSavedCount(0); 
      return; 
    }

    // Check if saved courses feature is enabled
    if (!featureFlags.isEnabled('savedCourses')) {
      setSavedCount(0);
      return;
    }
    
    (async () => {
      try {
        const count = await savedCoursesService.getSavedCoursesCount();
        if (!cancelled) setSavedCount(count);
      } catch (error) {
        if (!cancelled) {
          setSavedCount(0);
          // Only log unexpected errors (service handles 404s gracefully)
          if (!(error instanceof ApiError) || !error.isExpected) {
            console.warn('[Header] Failed to load saved courses count:', error instanceof Error ? error.message : 'Unknown error');
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleUserHoverEnter = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // compute menu position relative to viewport for fixed menu
    if (userBtnRef.current) {
      const rect = userBtnRef.current.getBoundingClientRect();
      const width = 224; const gap = 8;
      const left = Math.min(window.innerWidth - width - gap, Math.max(gap, rect.right - width));
      const top = rect.bottom + gap;
      setMenuPos({ top, left });
    }
    setUserMenuOpen(true);
  };

  const handleUserHoverLeave = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setUserMenuOpen(false);
      hoverTimerRef.current = null;
    }, 120);
  };
  return (
    <>
      <style>{`
        @media (min-width: 475px) {
          .xs\\:inline { display: inline !important; }
          .xs\\:w-4 { width: 1rem !important; }
          .xs\\:h-4 { height: 1rem !important; }
          .xs\\:w-5 { width: 1.25rem !important; }
          .xs\\:h-5 { height: 1.25rem !important; }
          .xs\\:w-7 { width: 1.75rem !important; }
          .xs\\:h-7 { height: 1.75rem !important; }
          .xs\\:w-9 { width: 2.25rem !important; }
          .xs\\:h-9 { height: 2.25rem !important; }
          .xs\\:text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .xs\\:text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
        }
        @media (min-width: 1536px) {
          .2xl\\:text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
        }
      `}</style>
      <header className="th-header header-layout-default relative z-[70]">
      {/* Logo Background Half */}
      <div 
        className="logo-bg-half absolute h-7 w-64 xl:w-80 2xl:w-96 rounded-tr-[50px] top-4 left-0 z-10 xl:block hidden"
        style={{ backgroundColor: 'var(--color-primary)' }}
      ></div>
      
      {/* Header Top */}
      <div 
        className="header-top relative z-30 px-2 xs:px-3 sm:px-4 lg:px-6 xl:pl-[300px] xl:pr-[88px] py-1 sm:py-1.5"
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
            {/* Left side - Contact info (responsive) */}
            <div className="hidden sm:block">
              <div className="header-links">
                <ul className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm">
                  <li className="flex items-center space-x-1 sm:space-x-2 relative pr-2 sm:pr-3 lg:pr-5 mr-2 sm:mr-3 lg:mr-4">
                    <IconPhone size={14} className="sm:w-4 sm:h-4" />
                    <a href="tel:+11156456825" className="hover:opacity-80 transition-opacity whitespace-nowrap">
                      +111 (564) 568 25
                    </a>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-3 sm:h-4 bg-white bg-opacity-20"></div>
                  </li>
                  <li className="hidden lg:flex items-center space-x-2 relative pr-5 mr-4">
                    <IconMail size={16} />
                    <a href="mailto:info@askyourtutor.com" className="hover:opacity-80 transition-opacity">info@askyourtutor.com</a>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-white bg-opacity-20"></div>
                  </li>
                  <li className="flex items-center space-x-1 sm:space-x-2">
                    <IconClock size={14} className="sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">Mon - Sat: 8:00 - 15:00</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side - Social links and mobile toggle */}
            <div className="flex items-center justify-between lg:justify-end w-full sm:w-auto">
              <div className="header-links header-right">
                <ul className="flex items-center space-x-2 sm:space-x-4">
                  <li>
                    <div className="header-social flex items-center space-x-2 sm:space-x-3">
                      <span className="social-title text-xs sm:text-sm font-normal hidden sm:inline">Follow Us:</span>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <a href="https://www.facebook.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandFacebook size={12} className="sm:w-3.5 sm:h-3.5" />
                        </a>
                        <a href="https://www.twitter.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandTwitter size={12} className="sm:w-3.5 sm:h-3.5" />
                        </a>
                        <a href="https://www.linkedin.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandLinkedin size={12} className="sm:w-3.5 sm:h-3.5" />
                        </a>
                        <a href="https://www.youtube.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandYoutube size={12} className="sm:w-3.5 sm:h-3.5" />
                        </a>
                        <a href="https://www.instagram.com/" className="text-sm hover:opacity-60 transition-opacity">
                          <IconBrandSkype size={12} className="sm:w-3.5 sm:h-3.5" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2 sm:space-x-3 relative">
                    {!user ? (
                      <>
                        <IconUser size={14} className="sm:w-4 sm:h-4" />
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <Link to="/login" className="hover:opacity-60 transition-opacity text-xs sm:text-sm">Login</Link>
                          <span className="text-white/40 text-xs sm:text-sm">/</span>
                          <Link to="/register" className="hover:opacity-60 transition-opacity text-xs sm:text-sm">Register</Link>
                        </div>
                      </>
                    ) : (
                      <div
                        className="relative"
                        onMouseEnter={handleUserHoverEnter}
                        onMouseLeave={handleUserHoverLeave}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-3 py-1 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                          onClick={() => {
                            if (!userMenuOpen && userBtnRef.current) {
                              const rect = userBtnRef.current.getBoundingClientRect();
                              const width = 224; const gap = 8;
                              const left = Math.min(window.innerWidth - width - gap, Math.max(gap, rect.right - width));
                              const top = rect.bottom + gap;
                              setMenuPos({ top, left });
                            }
                            setUserMenuOpen((v) => !v);
                          }}
                          aria-haspopup="menu"
                          aria-expanded={userMenuOpen}
                          ref={userBtnRef}
                        >
                          <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/20">
                            <IconUser size={12} className="sm:w-3.5 sm:h-3.5" />
                          </span>
                          <span className="text-xs sm:text-sm max-w-[120px] sm:max-w-[180px] truncate hidden xs:inline">{user.email}</span>
                          <IconChevronDown size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                        {userMenuOpen && menuPos && createPortal(
                          <div
                            ref={userMenuRef}
                            className="fixed w-48 sm:w-56 origin-top-right rounded-lg sm:rounded-xl bg-white/95 backdrop-blur shadow-xl ring-1 ring-black/5 border border-gray-100 animate-[fadeIn_120ms_ease-out] z-[9999]"
                            style={{ top: menuPos.top, left: menuPos.left }}
                            role="menu"
                          >
                            <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-gray-100">
                              <div className="text-xs text-gray-500">Signed in as</div>
                              <div className="truncate text-xs sm:text-sm font-medium text-gray-800">{user.email}</div>
                            </div>
                            <div className="py-1">
                              {(() => {
                                const profilePath = user?.role === 'TUTOR' ? '/tutor/profile' : '/student/profile';
                                return (
                                  <Link
                                    to={profilePath}
                                    className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                                    role="menuitem"
                                    onClick={() => setUserMenuOpen(false)}
                                  >
                                    <IconUser size={14} className="sm:w-4 sm:h-4" />
                                    <span>Profile</span>
                                  </Link>
                                );
                              })()}
                              <div className="my-1 h-px bg-gray-100" />
                              <button
                                type="button"
                                onClick={() => { setUserMenuOpen(false); logout(); }}
                                className="flex w-full items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50"
                                role="menuitem"
                              >
                                <IconArrowRight size={14} className="sm:w-4 sm:h-4 rotate-180" />
                                <span>Logout</span>
                              </button>
                            </div>
                          </div>,
                          document.body
                        )}
                      </div>
                    )}
                  </li>
                </ul>
              </div>

              {/* Mobile Menu Toggle - In Blue Header */}
              <button
                type="button"
                className="th-menu-toggle block lg:hidden p-1.5 sm:p-2 text-white hover:opacity-80 hover:bg-white/10 rounded-md transition-all ml-2 sm:ml-4"
                aria-label="Toggle mobile menu"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <IconX size={16} className="sm:w-5 sm:h-5" />
                ) : (
                  <IconMenu2 size={16} className="sm:w-5 sm:h-5" />
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
          className="menu-area relative z-20 px-2 xs:px-3 sm:px-4 lg:px-6 xl:pl-[30px] xl:pr-[88px] overflow-visible"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="container-fluid px-0">
            <div className="flex items-center justify-between w-full">
              {/* Logo */}
              <div className="header-logo py-3 lg:py-4 -mt-2 sm:-mt-3 lg:-mt-5 xl:mt-0 flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <div 
                    className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <IconSchool size={16} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                  </div>
                  <span 
                    className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white whitespace-nowrap tracking-wide"
                  >
                    ASKYOURTUTOR
                  </span>
                </Link>
              </div>

              {/* Main Navigation (Desktop) */}
              <nav className="main-menu hidden lg:inline-block ml-15">
                <ul className="flex items-center">
                  <li className="menu-item-has-children relative group mx-3">
                    <Link to="/" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-5 uppercase text-sm lg:text-base">
                      <span>Home</span>
                    </Link>
                  </li>
                  <li className="menu-item-has-children relative group mx-3">
                    <Link to="/courses" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-5 uppercase text-sm lg:text-base">
                      <span>Courses</span>
                    </Link>
                  </li>
                  <li className="menu-item-has-children relative group mx-3">
                    <a href="#" className="flex items-center font-medium text-white hover:opacity-80 transition-colors py-5 uppercase text-sm lg:text-base">
                      <span>Teachers</span>
                    </a>
                  </li>
                  <li className="mx-3">
                    <a href="#" className="font-medium text-white hover:opacity-80 transition-colors py-5 uppercase text-sm lg:text-base">
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Right Section - Header Actions */}
              <div className="hidden lg:block flex-1 max-w-none">
                <div className="flex items-center justify-end">
                  <div className="header-button flex items-center space-x-2 xl:space-x-4 h-full">
                    {/* Categories Menu with Search */}
                    <div className="category-menu-wrap mr-2 xl:mr-3 relative flex border border-white/20 rounded-md overflow-hidden max-w-sm xl:max-w-none bg-white/10">
                      <a 
                        className="menu-expand flex items-center space-x-1 xl:space-x-2 px-2 xl:px-3 py-2 text-white hover:bg-white/20 transition-colors border-r border-white/20 min-w-[100px] xl:min-w-[160px] flex-shrink-0" 
                        href="#"
                      >
                        <IconGrid3x3 size={14} className="xl:w-[18px] xl:h-[18px]" />
                        <span className="font-normal text-xs xl:text-sm hidden xl:inline">Categories</span>
                        <IconChevronDown size={12} className="xl:w-4 xl:h-4 ml-auto" />
                      </a>
                      
                      {/* Search Form */}
                      <form className="search-form flex items-center flex-1">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-full min-w-0 px-2 xl:px-4 py-2 border-0 bg-transparent focus:outline-none text-white placeholder-white/60 text-xs xl:text-base"
                        />
                        <button 
                          type="submit" 
                          className="px-2 xl:px-4 py-2 text-white hover:text-white/80 transition-colors bg-transparent border-0 flex-shrink-0"
                        >
                          <IconSearch size={14} className="xl:w-[18px] xl:h-[18px]" />
                        </button>
                      </form>
                    </div>

                    {/* Wishlist */}
                    <a 
                      href="#" 
                      className="icon-btn relative w-7 h-7 xl:w-9 xl:h-9 flex items-center justify-center border border-white/30 rounded-full hover:border-white hover:bg-white/10 transition-colors flex-shrink-0 text-white"
                      title={`${savedCount} saved courses`}
                    >
                      <IconHeart size={12} className="xl:w-4 xl:h-4" />
                      <span 
                        className="badge absolute -top-0.5 -right-0.5 xl:-top-1 xl:-right-1 min-w-[0.875rem] h-3.5 xl:w-4 xl:h-4 rounded-full text-[8px] xl:text-[10px] font-bold text-white flex items-center justify-center px-0.5"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        {savedCount > 99 ? '99+' : savedCount}
                      </span>
                    </a>

                    {/* Shopping Cart */}
                    <button 
                      type="button" 
                      className="icon-btn relative w-7 h-7 xl:w-9 xl:h-9 flex items-center justify-center border border-white/30 rounded-full hover:border-white hover:bg-white/10 transition-colors flex-shrink-0 text-white"
                    >
                      <IconShoppingCart size={12} className="xl:w-4 xl:h-4" />
                      <span 
                        className="badge absolute -top-0.5 -right-0.5 xl:-top-1 xl:-right-1 w-3.5 h-3.5 xl:w-4 xl:h-4 rounded-full text-[8px] xl:text-[10px] font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        5
                      </span>
                    </button>

                    {/* Contact Us Button */}
                    <a 
                      href="#" 
                      className="th-btn ml-2 xl:ml-3 px-3 xl:px-6 py-1.5 xl:py-2.5 rounded-sm font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-all flex items-center space-x-1 xl:space-x-2 text-xs xl:text-sm whitespace-nowrap flex-shrink-0 shadow-sm"
                    >
                      <span className="hidden xl:inline">Contact Us</span>
                      <span className="xl:hidden">Contact</span>
                      <IconArrowRight size={12} className="xl:w-4 xl:h-4" />
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
        <div className={`mobile-menu lg:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            {/* Mobile Search */}
            <div className="mb-3 sm:mb-4">
              <form className="search-form flex border border-gray-300 rounded-lg overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Search For Course..." 
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-0 bg-transparent focus:outline-none text-gray-600 placeholder-gray-400 text-sm sm:text-base"
                />
                <button 
                  type="submit" 
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors bg-gray-50 flex-shrink-0"
                >
                  <IconSearch size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="mobile-nav mb-3 sm:mb-4">
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link to="/" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/courses" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Courses
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Teachers
                  </a>
                </li>
                <li>
                  <a href="#" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Actions */}
            <div className="mobile-actions flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Mobile Wishlist */}
                <a 
                  href="#" 
                  className="icon-btn relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                >
                  <IconHeart size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span 
                    className="badge absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[8px] sm:text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    3
                  </span>
                </a>

                {/* Mobile Shopping Cart */}
                <button 
                  type="button" 
                  className="icon-btn relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                >
                  <IconShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span 
                    className="badge absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[8px] sm:text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    5
                  </span>
                </button>
              </div>

              {/* Mobile Login/Register */}
              {!user ? (
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <IconUser size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium text-sm sm:text-base">Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to={user?.role === 'TUTOR' ? '/tutor/profile' : '/student/profile'}
                    className="flex items-center space-x-1.5 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <IconUser size={16} />
                    <span className="font-medium text-sm">Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); toggleMobileMenu(); }}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-800 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;

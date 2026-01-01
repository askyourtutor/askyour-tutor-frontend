
import { 
  IconUser,
  IconChevronDown,
  IconBell,
  IconArrowRight,
  IconMenu2,
  IconSchool,
  IconX
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/api';
import { savedCoursesService } from '../../services/savedCoursesService';
import { featureFlags } from '../../utils/featureFlags';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      // Navigate to appropriate dashboard based on role
      const dashboardPath = user.role === 'STUDENT' ? '/student/dashboard' : 
                           user.role === 'ADMIN' ? '/admin/dashboard' : 
                           user.role === 'TUTOR' ? '/tutor/dashboard' :
                           '/';
      navigate(dashboardPath);
    }
  };

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
      {/* Sticky Wrapper */}
      <div className="sticky-wrapper">
        {/* Main Menu Area */}
        <div 
          className="menu-area relative z-20 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 2xl:px-12 py-1.5 sm:py-2"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between gap-4 md:gap-6 lg:gap-8">
              {/* Logo */}
              <div className="header-logo flex-shrink-0">
                <Link to="/" className="flex items-center gap-1 sm:gap-1.5">
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <IconSchool className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />
                  </div>
                  <span 
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white whitespace-nowrap tracking-wide"
                  >
                    ASKYOURTUTOR
                  </span>
                </Link>
              </div>

              {/* Main Navigation (Desktop) - Centered */}
              <nav className="main-menu hidden lg:flex flex-1 justify-center">
                <ul className="flex items-center gap-1 xl:gap-3">
                  <li className="relative group">
                    <Link to="/" className="flex items-center font-semibold text-white hover:text-white/80 transition-colors px-2.5 xl:px-3.5 py-1.5 uppercase text-xs xl:text-sm">
                      <span>Home</span>
                    </Link>
                  </li>
                  
                  {/* Show courses and teachers navigation for everyone (public pages) */}
                  <li className="relative group">
                    <Link to="/courses" className="flex items-center font-semibold text-white hover:text-white/80 transition-colors px-2.5 xl:px-3.5 py-1.5 uppercase text-xs xl:text-sm">
                      <span>Courses</span>
                    </Link>
                  </li>
                  <li className="relative group">
                    <Link to="/teachers" className="flex items-center font-semibold text-white hover:text-white/80 transition-colors px-2.5 xl:px-3.5 py-1.5 uppercase text-xs xl:text-sm">
                      <span>Teachers</span>
                    </Link>
                  </li>
                  
                  {/* Show Dashboard link for authenticated users */}
                  {user && (
                    <li className="relative group">
                      <a 
                        href="#"
                        onClick={handleDashboardClick}
                        className="flex items-center font-semibold text-white hover:text-white/80 transition-colors px-2.5 xl:px-3.5 py-1.5 uppercase text-xs xl:text-sm"
                      >
                        <span>Dashboard</span>
                      </a>
                    </li>
                  )}
                </ul>
              </nav>

              {/* Right Section - Header Actions */}
              <div className="hidden lg:flex flex-shrink-0 items-center gap-2 xl:gap-3">
                {/* Login/Register or User Profile */}
                {!user ? (
                  <>
                    <Link 
                      to="/login" 
                      className="px-3 xl:px-4 py-1 xl:py-1.5 rounded-[5px] font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-all flex items-center gap-0.5 text-xs xl:text-sm whitespace-nowrap shadow-sm"
                    >
                      <IconUser className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-3 xl:px-4 py-1 xl:py-1.5 rounded-[5px] font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-all text-xs xl:text-sm whitespace-nowrap shadow-sm"
                    >
                      <span>Register</span>
                    </Link>
                  </>
                ) : (
                  <div
                    className="relative"
                    onMouseEnter={handleUserHoverEnter}
                    onMouseLeave={handleUserHoverLeave}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-[5px] px-3 xl:px-4 py-1 xl:py-1.5 bg-white text-blue-600 hover:bg-gray-100 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-semibold text-xs xl:text-sm"
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
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-100">
                        <IconUser className="w-2.5 h-2.5" />
                      </span>
                      <span className="font-semibold max-w-[100px] truncate text-xs">{user.email}</span>
                      <IconChevronDown className="w-3 h-3" />
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
                                const profilePath = user?.role === 'TUTOR' ? '/tutor/profile' : 
                                                  user?.role === 'STUDENT' ? '/student/profile' : 
                                                  '/admin/dashboard';
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

                {/* Contact Us Button */}
                <Link 
                  to="/contact" 
                  className="px-3 xl:px-4 py-1 xl:py-1.5 rounded-[5px] font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-all flex items-center gap-0.5 text-xs xl:text-sm whitespace-nowrap shadow-sm"
                >
                  <span>Contact Us</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Notifications */}
                <button 
                  className="relative w-8 h-8 xl:w-9 xl:h-9 flex items-center justify-center border-2 border-white/30 rounded-full hover:border-white hover:bg-white/10 transition-colors text-white"
                  title="Notifications"
                >
                  <IconBell className="w-4 h-4 xl:w-4.5 xl:h-4.5" />
                  {savedCount > 0 && (
                    <span 
                      className="badge absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1.5"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    >
                      {savedCount > 99 ? '99+' : savedCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="flex lg:hidden items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-lg transition-all"
                aria-label="Toggle mobile menu"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <IconX className="w-6 h-6" />
                ) : (
                  <IconMenu2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Logo Background (hidden on mobile/tablet to avoid overlap) */}
          <div 
            className="logo-bg hidden xl:block absolute h-full w-72 2xl:w-80 bottom-0 left-0 z-[-1]"
            style={{ backgroundColor: 'var(--color-primary)' }}
          ></div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu lg:hidden bg-white border-t border-gray-200 shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            {/* Mobile Navigation Links */}
            <nav className="mobile-nav mb-3 sm:mb-4">
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <Link to="/" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Home
                  </Link>
                </li>
                
                {/* Show courses and teachers navigation for everyone (public pages) */}
                <li>
                  <Link to="/courses" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/teachers" onClick={toggleMobileMenu} className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base">
                    Teachers
                  </Link>
                </li>
                
                {/* Show Dashboard link for authenticated users */}
                {user && (
                  <li>
                    <a 
                      href="#"
                      onClick={(e) => {
                        handleDashboardClick(e);
                        toggleMobileMenu();
                      }}
                      className="block py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      Dashboard
                    </a>
                  </li>
                )}
              </ul>
            </nav>

            {/* Mobile Actions */}
            <div className="mobile-actions flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Mobile Notifications */}
                <button 
                  className="icon-btn relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-full hover:border-blue-600 transition-colors"
                >
                  <IconBell size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span 
                    className="badge absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[8px] sm:text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    3
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
                    to={user?.role === 'TUTOR' ? '/tutor/profile' : 
                        user?.role === 'STUDENT' ? '/student/profile' : 
                        '/admin/dashboard'}
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

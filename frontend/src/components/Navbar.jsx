import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/clerk-react';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/predict', label: 'Predict', icon: '🔮' },
    { path: '/breeds', label: 'Breeds', icon: '🐕' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-purple-500/5'
          : 'bg-transparent'
      } ${isDarkMode ? 'dark' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigation('/')}
          >
            <div className="relative">
              <div className="text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                🐾
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                PawPredict
              </span>
              <span className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400">
                Mind in Motion
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 group ${
                  activeLink === link.path
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <span className="text-lg transform group-hover:scale-125 transition-transform duration-300">
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {activeLink === link.path && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 dark:from-indigo-400 dark:to-purple-500">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      'w-10 h-10 rounded-xl ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300',
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeLink === link.path
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}

          <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 px-4 py-3">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        'w-10 h-10 rounded-xl ring-2 ring-purple-500/20',
                    },
                  }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Your Account
                </span>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Predict', path: '/predict' },
    { label: 'Breeds', path: '/breeds' },
    { label: 'About', path: '/about' },
  ];

  const features = [
    { icon: '🤖', value: 'AI', label: 'Powered' },
    { icon: '⚡', value: 'Instant', label: 'Results' },
    { icon: '🐕', value: '100+', label: 'Breeds' },
    { icon: '🆓', value: 'Free', label: 'To Use' },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-500' },
  ];

  return (
    <footer className={`relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-200' 
        : 'bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 text-white'
    }`}>
      
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Paw Prints - Reduced */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: '20s',
            }}
          >
            🐾
          </div>
        ))}
      </div>

      {/* Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={isDarkMode ? 'fill-gray-50' : 'fill-yellow-50'}
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                🐾
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  PawPredict
                </span>
                <span className="text-xs font-semibold tracking-widest opacity-70">
                  AI POWERED
                </span>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Revolutionizing pet care with cutting-edge AI technology. Predict, protect, and provide the best for your furry friends.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                        : 'bg-white/20 hover:bg-white/30 border border-white/30'
                    } ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group flex items-center gap-2 text-sm opacity-85 hover:opacity-100 transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              Features
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode 
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                      : 'bg-white/20 hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">{feature.value}</span>
                    <span className="text-xs opacity-80">{feature.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Get the latest updates on AI-powered pet care delivered to your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:-translate-y-1 focus:shadow-lg ${
                  isDarkMode 
                    ? 'bg-white/10 border border-white/20 focus:bg-white/15 focus:border-purple-400 text-white placeholder-gray-400' 
                    : 'bg-white/30 border border-white/40 focus:bg-white/40 focus:border-white text-gray-900 placeholder-gray-600'
                }`}
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Subscribe</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </form>
            <div className="flex flex-col gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                isDarkMode ? 'bg-white/5' : 'bg-white/20'
              }`}>
                <span className="text-base">🔒</span>
                <span>Secure & Trusted</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                isDarkMode ? 'bg-white/5' : 'bg-white/20'
              }`}>
                <span className="text-base">⚡</span>
                <span>Fast & Reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${
          isDarkMode ? 'border-white/10' : 'border-white/30'
        } flex flex-col md:flex-row items-center justify-between gap-4 text-sm`}>
          <div className="flex items-center gap-2 opacity-80">
            <span className="font-bold">©</span>
            <span>{new Date().getFullYear()} PawPredict. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/privacy')}
              className="opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              Privacy
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => navigate('/terms')}
              className="opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              Terms
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => navigate('/cookies')}
              className="opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              Cookies
            </button>
          </div>

          <div className="flex items-center gap-2 opacity-80">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse text-base">❤️</span>
            <span>for pets</span>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) rotate(15deg);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import ZkLoginButton from '@/components/ZkLoginButton';
import { useAuth } from '@/hooks/useAuth';

const FloatingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Community', href: '#community' },
    ...(isAuthenticated ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <img 
              src="/image/51eb3693-5839-4ffb-b4d9-304c31db9ca5.png" 
              alt="PeerVerse Logo" 
              className="h-8 w-auto"
            />
            <div className="h-6 w-px bg-gray-600" />
            <img 
              src="/image/white-sui-logo.png" 
              alt="Sui On Campus Logo" 
              className="h-6 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => item.href.startsWith('#') ? handleSmoothScroll(e, item.href) : undefined}
                className={`text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer flex items-center ${
                  item.label === 'Dashboard' ? 'gap-1' : ''
                }`}
              >
                {item.label === 'Dashboard' && <LayoutDashboard className="h-4 w-4" />}
                {item.label}
              </a>
            ))}
            <ZkLoginButton className="px-6 py-2" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => item.href.startsWith('#') ? handleSmoothScroll(e, item.href) : undefined}
                  className={`block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer flex items-center ${
                    item.label === 'Dashboard' ? 'gap-2' : ''
                  }`}
                >
                  {item.label === 'Dashboard' && <LayoutDashboard className="h-4 w-4" />}
                  {item.label}
                </a>
              ))}
              <div className="px-3 py-2">
                <ZkLoginButton className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default FloatingNavbar;

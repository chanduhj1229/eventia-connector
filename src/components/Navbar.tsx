
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 glass-morphism' 
          : 'py-4 bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-medium">
            Eventia
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Browse Events
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="rounded-full">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button size="sm" className="rounded-full">
                Create Event
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-background/95 pt-20 px-4 z-40 animate-fade-in">
            <div className="flex flex-col space-y-6 items-center text-center">
              <Link to="/" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/browse" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Browse Events
              </Link>
              <Link to="/dashboard" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <div className="pt-6 flex flex-col space-y-4 w-full">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button className="w-full">
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

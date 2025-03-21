
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            
            {isAuthenticated ? (
              <>
                {isOrganizer() ? (
                  // Organizer Links
                  <>
                    <Link to="/dashboard" className="text-sm font-medium hover:text-primary/80 transition-colors">
                      Organizer Dashboard
                    </Link>
                    <Link to="/create-event" className="text-sm font-medium hover:text-primary/80 transition-colors">
                      Create Event
                    </Link>
                  </>
                ) : (
                  // Attendee Links
                  <Link to="/my-events" className="text-sm font-medium hover:text-primary/80 transition-colors">
                    My Events
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full p-0 h-10 w-10">
                      <Avatar>
                        <AvatarImage src={user?.profileImage} alt={user?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name}
                    </div>
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    {isOrganizer() && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
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
              
              {isAuthenticated ? (
                <>
                  {isOrganizer() ? (
                    // Organizer Mobile Links
                    <>
                      <Link to="/dashboard" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <Link to="/create-event" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        Create Event
                      </Link>
                    </>
                  ) : (
                    // Attendee Mobile Links
                    <Link to="/my-events" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      My Events
                    </Link>
                  )}
                  
                  <Link to="/profile" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="pt-6 flex flex-col space-y-4 w-full">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

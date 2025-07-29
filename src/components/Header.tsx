/**
 * Header Component
 * Refactored to meet coding standards with proper theming and semantic constants
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import { Search, Database, User, LogOut, Plus, History } from 'lucide-react';
import { SPACING, TEXT_SIZES } from '@/constants/ui';

const Header: React.FC = () => {
  // Add error boundary for router hooks
  let location;
  let navigate;
  
  try {
    location = useLocation();
    navigate = useNavigate();
  } catch (error) {
    console.error('Header: Router context not available:', error);
    // Fallback when router is not available
    location = { pathname: '/' };
    navigate = () => {};
  }
  const { user, loading } = useAuthState();
  const { toast } = useToast();

  const handleSignOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignInClick = (): void => {
    console.log('Sign in button clicked, navigating to /auth');
    navigate('/auth');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Home', icon: Database },
    { path: '/new-project', label: 'New Project', icon: Plus },
    { path: '/query-history', label: 'Projects', icon: History },
  ];

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className={`container flex h-14 items-center px-${SPACING.MD}`}>
          <div className="animate-pulse w-32 h-8 bg-gray-200 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`container flex h-14 items-center px-${SPACING.MD}`}>
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <DataDetectiveLogo showText={true} />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 transition-colors hover:text-foreground/80 ${
                isActive(path) ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              <Icon className={`w-${SPACING.MD} h-${SPACING.MD}`} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className={`w-${SPACING.MD} h-${SPACING.MD}`} />
                <span className="hidden sm:inline text-sm">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className={`w-${SPACING.MD} h-${SPACING.MD} mr-2`} />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleSignInClick} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
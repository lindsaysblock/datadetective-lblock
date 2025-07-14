
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import { 
  BarChart3, 
  Plus, 
  History, 
  Settings, 
  User,
  LogOut,
  HelpCircle
} from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, loading } = useAuthState();
  const { toast } = useToast();

  const handleSignOut = async () => {
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

  const isActive = (path: string) => location.pathname === path;

  // Check if user has admin access (you can modify this logic as needed)
  const isAdmin = user?.email === 'admin@datadetective.com'; // Replace with your admin logic

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <DataDetectiveLogo size="sm" showText={true} />
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/new-project"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/new-project') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Link>
              
              <Link
                to="/query-history"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/query-history') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Project History</span>
              </Link>

              {/* Admin-only navigation */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-red-100 text-red-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                  <Badge variant="secondary" className="ml-1 text-xs">Admin</Badge>
                </Link>
              )}
            </nav>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Help button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>

            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <Link
                  to="/profile"
                  className={`p-2 rounded-md transition-colors ${
                    isActive('/profile')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Sign In / Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

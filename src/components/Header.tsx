
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { useToast } from '@/hooks/use-toast';
import DataDetectiveLogo from './DataDetectiveLogo';

interface HeaderProps {
  user?: any;
  onUserChange?: (newUser: any) => void;
}

const Header: React.FC<HeaderProps> = ({ user: propUser, onUserChange }) => {
  const { user: hookUser } = useAuthState();
  const { toast } = useToast();
  
  // Use prop user if provided, otherwise use hook user
  const user = propUser || hookUser;

  const handleSignOut = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <DataDetectiveLogo size="sm" showText={true} />
            </Link>
            
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link to="/new-project" className="text-gray-600 hover:text-gray-900 font-medium">
                New Project
              </Link>
              <Link to="/query-history" className="text-gray-600 hover:text-gray-900 font-medium">
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{user.email}</span>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

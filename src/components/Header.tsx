
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';

interface HeaderProps {
  user?: any;
  onUserChange?: (newUser: any) => void;
}

const Header: React.FC<HeaderProps> = ({ user: propUser, onUserChange }) => {
  const { user: hookUser } = useAuthState();
  
  // Use prop user if provided, otherwise use hook user
  const user = propUser || hookUser;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DD</span>
              </div>
              <span className="font-semibold text-gray-900">Data Detective</span>
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
              </div>
            ) : (
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

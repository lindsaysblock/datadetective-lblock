
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DataDetectiveLogo from './DataDetectiveLogo';

interface HeaderProps {
  user?: any;
  onUserChange?: (user: any) => void;
  onShowSignIn?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onUserChange, onShowSignIn }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <DataDetectiveLogo size="sm" showText={true} />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/new-project">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
            
            {onShowSignIn && (
              <Button 
                onClick={onShowSignIn}
                variant="outline"
                className="border-gray-300"
              >
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

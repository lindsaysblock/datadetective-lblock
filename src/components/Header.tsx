
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import DataDetectiveLogo from './DataDetectiveLogo';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <DataDetectiveLogo size="sm" showText={true} />
            </Link>
            
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
            
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

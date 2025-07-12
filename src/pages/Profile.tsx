
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfilePanel from '@/components/UserProfilePanel';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';

const Profile = () => {
  const { user } = useAuthState();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to view your profile.</p>
            <Link to="/">
              <Button>Go Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Profile & Settings
            </h1>
            <p className="text-blue-600 text-lg">Manage your account and preferences</p>
          </div>
        </div>

        <UserProfilePanel />
      </div>
    </div>
  );
};

export default Profile;

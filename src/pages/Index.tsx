import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, History, BarChart3, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import HelpMenu from '@/components/HelpMenu';
import DatasetsGrid from '@/components/data/DatasetsGrid';
import { useIndexPageState } from '@/hooks/useIndexPageState';
import { SignInModal } from '@/components/auth/SignInModal';

const Index = () => {
  const {
    user,
    loading,
    handleUserChange,
    datasets,
    datasetsLoading,
  } = useIndexPageState();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContinueExistingProject = () => {
    if (!user) {
      setShowSignInModal(true);
    } else {
      navigate('/query-history');
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        setShowSignInModal(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/new-project`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Check your email for the confirmation link!",
        });
        setShowSignInModal(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Updated Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2">
                  <DataDetectiveLogo size="sm" showText={true} />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Link to="/new-project">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                </Link>
                
                <Link to="/query-history">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Projects
                  </Button>
                </Link>

                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link to="/test-runner">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Test Runner
                  </Button>
                </Link>

                <HelpMenu />
                
                <Button onClick={() => setShowSignInModal(true)}>
                  Sign In / Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Updated Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <DataDetectiveLogo size="sm" showText={true} />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/new-project">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleContinueExistingProject}
              >
                <History className="w-4 h-4" />
                Projects
              </Button>

              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>

              <Link to="/test-runner">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Test Runner
                </Button>
              </Link>

              <HelpMenu />
              
              <Button onClick={() => setShowSignInModal(true)}>
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {user ? 'Welcome Back, Detective!' : 'Welcome to Data Detective'}
            </h1>
            <p className="text-gray-600">
              {user 
                ? 'What would you like to investigate today?' 
                : 'Discover insights from your data with AI-powered analysis'
              }
            </p>
          </div>

          {/* Dashboard Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card 
              className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate('/new-project')}
            >
              <div className="text-center">
                <div className="p-4 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Start New Project</h3>
                <p className="text-gray-600">Upload fresh data and begin a new investigation</p>
              </div>
            </Card>

            <Card 
              className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
              onClick={handleContinueExistingProject}
            >
              <div className="text-center">
                <div className="p-4 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <History className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Continue Existing Project</h3>
                <p className="text-gray-600">Resume analysis on your saved datasets</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity Section - Only show for authenticated users */}
          {user && datasets && datasets.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <Card className="border-blue-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
                  <CardDescription className="text-gray-600">
                    Quick access to your latest investigations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DatasetsGrid datasets={datasets?.slice(0, 3) || []} loading={datasetsLoading} />
                  {datasets && datasets.length > 3 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => navigate('/query-history')}>
                        View All Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        email={email}
        password={password}
        loading={authLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
      />
    </div>
  );
};

export default Index;
